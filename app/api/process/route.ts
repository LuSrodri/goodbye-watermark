import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, ProcessImageResponse } from '@/lib/types'
import { removeWatermark } from '@/lib/replicate'

export const maxDuration = 60

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ProcessImageResponse>>> {
  try {
    const { imageBase64 } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      )
    }

    const processedImageBuffer = await removeWatermark(imageBase64)

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
