export interface ProcessedImage {
  id: string
  session_id: string
  original_url: string
  processed_url: string
  is_public: boolean
  share_slug: string | null
  created_at: string
}

export interface Session {
  id: string
  uuid: string
  daily_count: number
  last_reset_date: string
  created_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface ProcessImageResponse {
  processedUrl: string
  imageId: string
  remainingToday: number
}

export interface SessionInfo {
  sessionId: string
  remainingToday: number
  history: ProcessedImage[]
}
