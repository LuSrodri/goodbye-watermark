import Stripe from 'stripe'

const PACKAGES: Record<string, { price: number; credits: number; name: string }> = {
  '10credits': { price: 300, credits: 10, name: '10 Credits — Goodbye Watermark' },
  '50credits': { price: 1000, credits: 50, name: '50 Credits — Goodbye Watermark' },
}

export async function POST(req: Request) {
  const { packageId } = await req.json()

  const pkg = PACKAGES[packageId]
  if (!pkg) {
    return Response.json({ error: 'Invalid package' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: pkg.name },
          unit_amount: pkg.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${siteUrl}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/`,
    metadata: { credits: String(pkg.credits) },
  })

  return Response.json({ url: session.url, sessionId: session.id })
}
