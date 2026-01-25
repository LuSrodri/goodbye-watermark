import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { ApiResponse, ProcessedImage } from '@/lib/types'

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ProcessedImage[]>>> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const sessionId = request.nextUrl.searchParams.get('sessionId')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('processed_images')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('History fetch error:', error)
      throw new Error('Failed to fetch history')
    }

    return NextResponse.json({
      success: true,
      data: data as ProcessedImage[]
    })
  } catch (error) {
    console.error('History error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
