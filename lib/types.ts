export interface ProcessedImage {
  id: string
  processed_url: string
  original_url: string
  created_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface ProcessImageResponse {
  processedBase64: string
}
