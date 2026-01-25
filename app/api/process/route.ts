import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { ApiResponse, ProcessImageResponse } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

const DAILY_LIMIT = 5
const DASHSCOPE_API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

async function processWithQwen(imageBase64: string): Promise<string> {
  const response = await fetch(DASHSCOPE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'disable'
    },
    body: JSON.stringify({
      model: 'qwen-image-edit-max',
      input: {
        messages: [
          {
            role: 'user',
            content: [
              { image: imageBase64 },
              { text: 'No watermark' }
            ]
          }
        ]
      },
      parameters: {
        n: 1,
        watermark: false,
        prompt_extend: false
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Qwen API error:', errorText)
    throw new Error('Failed to process image with AI')
  }

  const result = await response.json()

  if (result.output?.choices?.[0]?.message?.content?.[0]?.image) {
    return result.output.choices[0].message.content[0].image
  }

  throw new Error('No processed image in response')
}

async function uploadToSupabase(imageUrl: string, sessionId: string): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin()

  // Fetch the processed image from Qwen's temporary URL
  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    throw new Error('Failed to fetch processed image')
  }

  const imageBuffer = await imageResponse.arrayBuffer()
  const fileName = `${sessionId}/${uuidv4()}.png`

  const { data, error } = await supabaseAdmin
    .storage
    .from('processed-images')
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
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

    // Process image with Qwen API
    const processedImageUrl = await processWithQwen(imageBase64)

    // Upload to Supabase Storage (Qwen URLs expire after 24h)
    const permanentUrl = await uploadToSupabase(processedImageUrl, sessionId)

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
