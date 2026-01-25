import { v4 as uuidv4 } from 'uuid'

export function generateUUID(): string {
  return uuidv4()
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem('gbw_session_id')
  if (!sessionId) {
    sessionId = generateUUID()
    localStorage.setItem('gbw_session_id', sessionId)
  }
  return sessionId
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function generateShareSlug(): string {
  return uuidv4().slice(0, 8)
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(file.type)
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}
