import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, ProcessImageResponse } from '@/lib/types'
import Replicate from 'replicate'

const replicate = new Replicate()

async function processWithReplicate(imageBase64: string): Promise<ArrayBuffer> {
  const input = {
    image: [imageBase64],
    prompt: "No one watermarks. Clean, high quality image.",
    disable_safety_checker: true,
    output_quality: 100,
    output_format: "webp"
  }

  const output = await replicate.run("qwen/qwen-image-edit-2511", { input })

  if (output && Array.isArray(output) && output.length > 0) {
    const fileOutput = output[0] as { url: () => string }
    const imageUrl = fileOutput.url()

    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch processed image from Replicate')
    }

    return response.arrayBuffer()
  }

  throw new Error('No processed image in response')
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
