import { NextRequest, NextResponse } from 'next/server'
import { removeWatermark } from '@/lib/replicate'

export const maxDuration = 60

const MAX_BASE64_BYTES = 50 * 1024 * 1024 // ~37 MB decoded — matches the UI's 50 MB raw cap

function unauthorized(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 401 })
}

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 })
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

function isDataUri(value: string): boolean {
  return value.startsWith('data:')
}

function normalizeImage(value: string): string {
  if (isHttpUrl(value) || isDataUri(value)) return value
  return `data:image/png;base64,${value}`
}

export async function POST(request: NextRequest) {
  const expected = process.env.RAPIDAPI_PROXY_SECRET
  if (!expected) {
    console.error('RAPIDAPI_PROXY_SECRET is not configured')
    return NextResponse.json(
      { success: false, error: 'Server is not configured for API access' },
      { status: 503 }
    )
  }

  // RapidAPI gateway forwards the static value configured in the provider
  // dashboard. Tolerate an optional `Bearer ` prefix so callers hitting the
  // origin directly with the same secret keep working.
  const auth = request.headers.get('authorization') ?? ''
  const presented = auth.replace(/^Bearer\s+/i, '').trim()
  if (presented !== expected) {
    return unauthorized('Invalid or missing API key')
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest('Request body must be valid JSON')
  }

  const image = (body as { image?: unknown })?.image
  if (typeof image !== 'string' || image.length === 0) {
    return badRequest('Field "image" is required (base64 string or HTTPS URL)')
  }

  if (image.length > MAX_BASE64_BYTES) {
    return badRequest('Image exceeds maximum size of 50 MB')
  }

  try {
    const buffer = await removeWatermark(normalizeImage(image))
    const base64 = Buffer.from(buffer).toString('base64')

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64}`,
      format: 'png',
    })
  } catch (error) {
    console.error('RapidAPI process error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process image',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      name: 'Goodbye Watermark API',
      version: '1.0',
      endpoints: {
        process: 'POST /api/v1/remove-watermark',
        health: 'GET /api/v1/ping',
      },
      authentication: 'Authorization header (provisioned via RapidAPI)',
      input: { image: 'base64 string OR https URL' },
      output: { success: 'boolean', image: 'data:image/png;base64,...', format: 'png' },
      docs: '/api-watermark-remover',
    },
    { status: 200 }
  )
}
