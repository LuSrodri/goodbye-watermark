import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { ApiResponse, SessionInfo, ProcessedImage } from '@/lib/types'

const DAILY_LIMIT = 5

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SessionInfo>>> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const today = getTodayDate()

    // Check if session exists
    const { data: existingSession } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('uuid', sessionId)
      .single()

    let dailyCount = 0

    if (existingSession) {
      // Reset count if it's a new day
      if (existingSession.last_reset_date !== today) {
        await supabaseAdmin
          .from('sessions')
          .update({ daily_count: 0, last_reset_date: today })
          .eq('uuid', sessionId)
        dailyCount = 0
      } else {
        dailyCount = existingSession.daily_count
      }
    } else {
      // Create new session
      await supabaseAdmin
        .from('sessions')
        .insert({ uuid: sessionId, daily_count: 0, last_reset_date: today })
    }

    // Get history
    const { data: history } = await supabaseAdmin
      .from('processed_images')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        remainingToday: DAILY_LIMIT - dailyCount,
        history: (history as ProcessedImage[]) || []
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize session' },
      { status: 500 }
    )
  }
}
