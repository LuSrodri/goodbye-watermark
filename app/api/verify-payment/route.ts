import Stripe from 'stripe'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return Response.json({ success: false, error: 'Missing session_id' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Stripe session not paid yet — user may still be on checkout
    if (session.payment_status === 'unpaid') {
      return Response.json({ success: false, paymentStatus: 'open' })
    }

    // Session expired without payment
    if (session.status === 'expired') {
      return Response.json({ success: false, paymentStatus: 'expired' })
    }

    if (session.payment_status !== 'paid') {
      return Response.json({ success: false, paymentStatus: session.payment_status })
    }

    if (!session.payment_intent) {
      return Response.json({ success: false, error: 'No payment intent found' })
    }

    const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string)

    // Already credited — idempotent, safe to call multiple times
    if (pi.metadata?.credited === 'true') {
      return Response.json({ success: true, credits: 0, alreadyClaimed: true, paymentStatus: 'paid' })
    }

    // Mark as credited before returning — prevents race conditions
    await stripe.paymentIntents.update(pi.id, {
      metadata: { credited: 'true' },
    })

    const credits = parseInt(session.metadata?.credits ?? '0', 10)
    return Response.json({ success: true, credits, paymentStatus: 'paid' })
  } catch (err: unknown) {
    // Stripe throws when session ID is invalid/not found
    if (err instanceof Error && err.message.includes('No such checkout.session')) {
      return Response.json({ success: false, paymentStatus: 'not_found' })
    }
    console.error('verify-payment error:', err)
    return Response.json({ success: false, error: 'Failed to verify payment' }, { status: 500 })
  }
}
