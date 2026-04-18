import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, ProcessImageResponse } from '@/lib/types'
import Replicate from 'replicate'

const replicate = new Replicate()

async function processWithReplicate(imageBase64: string): Promise<ArrayBuffer> {
  const input = {
    image: imageBase64,
    prompt: "Remove all watermarks and the image overlay elements. Be assertive. And keep the better image quality and size.",
    negative_prompt: "watermarks, logos, text overlays, signatures, stamps, blur, distortion",
    match_input_image: true,
    enable_prompt_expansion: false,
  }

  const output = await replicate.run("qwen/qwen-image-2-pro", { input }) as { url: () => string }

  const imageUrl = output?.url?.()
  if (!imageUrl) {
    throw new Error('No processed image in response')
  }

  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch processed image from Replicate')
  }

  return response.arrayBuffer()
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ProcessImageResponse>>> {
  try {
    const { imageBase64 } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      )
    }

    const processedImageBuffer = await processWithReplicate(imageBase64)

    const base64 = Buffer.from(processedImageBuffer).toString('base64')
    const processedBase64 = `data:image/webp;base64,${base64}`

    return NextResponse.json({
      success: true,
      data: { processedBase64 }
    })
  } catch (error) {
    console.error('Process error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    )
  }
}
