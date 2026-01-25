import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { ApiResponse } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

interface ShareResponse {
  shareUrl: string
  shareSlug: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ShareResponse>>> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { imageId, sessionId } = await request.json()

    if (!imageId || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Image ID and session ID are required' },
        { status: 400 }
      )
    }

    // Verify the image belongs to this session
    const { data: image } = await supabaseAdmin
      .from('processed_images')
      .select('*')
      .eq('id', imageId)
      .eq('session_id', sessionId)
      .single()

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    // If already shared, return existing share URL
    if (image.is_public && image.share_slug) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goodbyewatermark.com'
      return NextResponse.json({
        success: true,
        data: {
          shareUrl: `${siteUrl}/s/${image.share_slug}`,
          shareSlug: image.share_slug
        }
      })
    }

    // Generate share slug and make public
    const shareSlug = uuidv4().slice(0, 8)

    const { error } = await supabaseAdmin
      .from('processed_images')
      .update({ is_public: true, share_slug: shareSlug })
      .eq('id', imageId)

    if (error) {
      console.error('Share update error:', error)
      throw new Error('Failed to share image')
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goodbyewatermark.com'

    return NextResponse.json({
      success: true,
      data: {
        shareUrl: `${siteUrl}/s/${shareSlug}`,
        shareSlug
      }
    })
  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to share image' },
      { status: 500 }
    )
  }
}
