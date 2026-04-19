const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

type SiteverifyResponse = {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
}

export type TurnstileVerification =
  | { ok: true }
  | { ok: false; error: string }

export async function verifyTurnstileToken(
  token: unknown,
  remoteIp?: string
): Promise<TurnstileVerification> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return { ok: true }
  }

  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { ok: false, error: 'Missing or invalid verification token' }
  }

  try {
    const body: Record<string, string> = { secret, response: token }
    if (remoteIp) body.remoteip = remoteIp

    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = (await res.json()) as SiteverifyResponse
    if (data.success) return { ok: true }

    console.warn('Turnstile verification failed:', data['error-codes'])
    return { ok: false, error: 'Verification failed. Please refresh and try again.' }
  } catch (error) {
    console.error('Turnstile siteverify error:', error)
    return { ok: false, error: 'Verification service unavailable' }
  }
}
