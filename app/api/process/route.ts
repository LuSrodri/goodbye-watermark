import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { ApiResponse, ProcessImageResponse } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'
import Replicate from 'replicate'

const DAILY_LIMIT = 5
const replicate = new Replicate()

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

async function processWithReplicate(imageBase64: string): Promise<ArrayBuffer> {
  const input = {
    image: [imageBase64],
    prompt: "Remove the watermark from this image",
    disable_safety_checker: true,
    output_quality: 100
  }

  const output = await replicate.run("qwen/qwen-image-edit-plus", { input })

  if (output && Array.isArray(output) && output.length > 0) {
    // output[0] is a FileOutput object, we need to get its content
    const fileOutput = output[0] as { url: () => string }
    const imageUrl = fileOutput.url()

    // Fetch the image content from the URL
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch processed image from Replicate')
    }

    return response.arrayBuffer()
  }

  throw new Error('No processed image in response')
}

async function uploadToSupabase(imageBuffer: ArrayBuffer, sessionId: string): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin()

  const fileName = `${sessionId}/${uuidv4()}.webp`

  const { data, error } = await supabaseAdmin
    .storage
    .from('processed-images')
    .upload(fileName, imageBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000'
    })

  if (error) {
    console.error('Storage upload error:', error)
    throw new Error('Failed to save processed image')
  }

  const { data: urlData } = supabaseAdmin
    .storage
    .from('processed-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ProcessImageResponse>>> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { sessionId, imageBase64, originalUrl } = await request.json()

    if (!sessionId || !imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Session ID and image are required' },
        { status: 400 }
      )
    }

    const today = getTodayDate()

    // Check session and daily limit
    const { data: session } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('uuid', sessionId)
      .single()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found. Please refresh the page.' },
        { status: 404 }
      )
    }

    let currentCount = session.daily_count

    // Reset if new day
    if (session.last_reset_date !== today) {
      await supabaseAdmin
        .from('sessions')
        .update({ daily_count: 0, last_reset_date: today })
        .eq('uuid', sessionId)
      currentCount = 0
    }

    if (currentCount >= DAILY_LIMIT) {
      return NextResponse.json(
        { success: false, error: 'Daily limit reached. Come back tomorrow!' },
        { status: 429 }
      )
    }

    // Process image with Replicate API
    const processedImageBuffer = await processWithReplicate(imageBase64)

    // Upload to Supabase Storage
    const permanentUrl = await uploadToSupabase(processedImageBuffer, sessionId)

    // Create image record
    const imageId = uuidv4()
    const { error: insertError } = await supabaseAdmin
      .from('processed_images')
      .insert({
        id: imageId,
        session_id: sessionId,
        original_url: originalUrl || imageBase64.substring(0, 100),
        processed_url: permanentUrl,
        is_public: false,
        share_slug: null
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error('Failed to save image record')
    }

    // Increment daily count
    await supabaseAdmin
      .from('sessions')
      .update({ daily_count: currentCount + 1 })
      .eq('uuid', sessionId)

    return NextResponse.json({
      success: true,
      data: {
        processedUrl: permanentUrl,
        imageId,
        remainingToday: DAILY_LIMIT - currentCount - 1
      }
    })
  } catch (error) {
    console.error('Process error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    )
  }
}
