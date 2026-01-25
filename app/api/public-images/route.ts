import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { ApiResponse, ProcessedImage } from '@/lib/types'

export async function GET(): Promise<NextResponse<ApiResponse<ProcessedImage[]>>> {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('processed_images')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      console.error('Public images fetch error:', error)
      throw new Error('Failed to fetch public images')
    }

    return NextResponse.json({
      success: true,
      data: data as ProcessedImage[]
    })
  } catch (error) {
    console.error('Public images error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public images' },
      { status: 500 }
    )
  }
}
