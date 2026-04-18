import { Metadata } from 'next'
import Link from 'next/link'
import { Code2, Zap, Lock, Cpu, Globe, Workflow, Check, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Watermark Remover API — Fast HTTPS endpoint via RapidAPI',
  description:
    'Remove watermarks programmatically with a single HTTPS call. Pay-as-you-go on RapidAPI, base64 or URL input, base64 PNG output. No SDK, no infrastructure.',
  keywords: [
    'watermark remover api',
    'remove watermark api',
    'watermark removal api',
    'rapidapi watermark remover',
    'image processing api',
    'ai watermark removal endpoint',
    'batch watermark removal api',
  ],
  openGraph: {
    title: 'Watermark Remover API — Fast HTTPS endpoint via RapidAPI',
    description:
      'A single POST request, watermark gone. Distributed via RapidAPI, metered billing, instant keys.',
    url: 'https://goodbyewatermark.com/api-watermark-remover',
    siteName: 'Goodbye Watermark',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watermark Remover API — Fast HTTPS endpoint via RapidAPI',
    description:
      'Plug Goodbye Watermark into your code. JSON in, base64 PNG out. Pay-as-you-go on RapidAPI.',
  },
  alternates: {
    canonical: 'https://goodbyewatermark.com/api-watermark-remover',
  },
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Sub-second to a few seconds per image',
    desc: 'Powered by Qwen Image 2 Pro on warm GPUs. No cold-start tax, no queue delays at typical loads.',
  },
  {
    icon: Globe,
    title: 'URL or base64 input',
    desc: 'Pass an HTTPS URL the gateway can reach, or a raw base64 string. We normalize both.',
  },
  {
    icon: Cpu,
    title: 'State-of-the-art inpainting',
    desc: 'Same model the consumer site uses — preserves resolution and reconstructs textures behind watermarks instead of blurring them out.',
  },
  {
    icon: Workflow,
    title: 'Batch-friendly by design',
    desc: 'Stateless endpoint. Fan out as many parallel requests as your RapidAPI plan allows.',
  },
  {
    icon: Lock,
    title: 'No image retention',
    desc: 'Inputs and outputs flow through the inference pipeline and are not stored on our servers.',
  },
  {
    icon: Code2,
    title: 'Plain HTTPS + JSON',
    desc: 'No SDK, no client library lock-in. If your stack speaks HTTP, it speaks this API.',
  },
]

const CURL = `curl -X POST \\
  https://goodbye-watermark-api.p.rapidapi.com/api/v1/remove-watermark \\
  -H "x-rapidapi-key: YOUR_RAPIDAPI_KEY" \\
  -H "x-rapidapi-host: goodbye-watermark-api.p.rapidapi.com" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "https://example.com/photo-with-watermark.jpg"
  }'`

const NODE = `import fetch from "node-fetch";

const res = await fetch(
  "https://goodbye-watermark-api.p.rapidapi.com/api/v1/remove-watermark",
  {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "goodbye-watermark-api.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: "https://example.com/photo-with-watermark.jpg",
    }),
  }
);

const { image } = await res.json();
// "image" is a data URI you can write to disk or return to a client
`

const PYTHON = `import os, requests

response = requests.post(
    "https://goodbye-watermark-api.p.rapidapi.com/api/v1/remove-watermark",
    headers={
        "x-rapidapi-key": os.environ["RAPIDAPI_KEY"],
        "x-rapidapi-host": "goodbye-watermark-api.p.rapidapi.com",
        "Content-Type": "application/json",
    },
    json={"image": "https://example.com/photo-with-watermark.jpg"},
    timeout=60,
)

data = response.json()
print(data["image"][:80])  # data:image/png;base64,iVBORw0KGgo...
`

const FAQ = [
  {
    q: 'How is the API priced?',
    a: 'Pricing is set in the RapidAPI dashboard with tiered, pay-as-you-go plans plus a free tier so you can test before committing. Subscribe and manage limits directly from your RapidAPI account.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG, PNG, and WebP up to 50 MB. The API always returns a base64 PNG to preserve the cleanest possible output.',
  },
  {
    q: 'How long does a request take?',
    a: 'Most requests complete in 5 to 15 seconds end-to-end. The endpoint allows up to 60 seconds. Use a generous client-side timeout.',
  },
  {
    q: 'Do you store the images I send?',
    a: 'No. Images flow through the inference pipeline and are discarded. Nothing is logged to durable storage on our side.',
  },
  {
    q: 'Can I batch process multiple images?',
    a: 'The endpoint processes one image per request. To handle a batch, fire requests in parallel up to the concurrency limit of your RapidAPI plan.',
  },
  {
    q: 'What happens on errors?',
    a: 'Non-2xx responses always return JSON of the form { "success": false, "error": "..." }. Authentication errors return 401, malformed input returns 400, upstream failures return 500.',
  },
]

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900/60">
        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <pre className="p-5 text-[12px] sm:text-[13px] leading-relaxed font-mono text-gray-200 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function ApiLandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Top nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
            Goodbye Watermark
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <Link
              href="/"
              className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              Try the tool →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-4">
            Watermark Remover API
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 max-w-3xl">
            One POST request. <br className="hidden sm:block" />
            Watermark gone.
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mb-8">
            Goodbye Watermark&apos;s removal pipeline, exposed as a simple HTTPS endpoint and
            distributed via RapidAPI. Plug it into your scraper, your e-commerce automation,
            your photo workflow &mdash; without standing up a single GPU.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://rapidapi.com/"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Get an API key on RapidAPI
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#endpoint"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-900 text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
            >
              Read the docs
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-10 max-w-2xl">
            Built for production from day one.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-100 p-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoint reference */}
      <section id="endpoint" className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Endpoint reference
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            POST /api/v1/remove-watermark
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Health check available at <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">GET /api/v1/ping</code> &mdash;
            unauthenticated, returns 200 with <code className="text-xs">{'{ status: "ok" }'}</code>. Use it for uptime monitors and gateway readiness probes.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Request body
              </h3>
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Field</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-3 font-mono text-gray-900">image</td>
                      <td className="px-4 py-3 text-gray-600">string (required)</td>
                      <td className="px-4 py-3 text-gray-600">
                        Either an HTTPS URL pointing at the source image or a base64 string
                        (with or without the <code className="text-xs">data:</code> prefix).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Successful response (200)
              </h3>
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Field</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-3 font-mono text-gray-900">success</td>
                      <td className="px-4 py-3 text-gray-600">boolean</td>
                      <td className="px-4 py-3 text-gray-600">Always <code>true</code> on 2xx.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-gray-900">image</td>
                      <td className="px-4 py-3 text-gray-600">string</td>
                      <td className="px-4 py-3 text-gray-600">
                        Data URI: <code className="text-xs">data:image/png;base64,...</code>.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-gray-900">format</td>
                      <td className="px-4 py-3 text-gray-600">string</td>
                      <td className="px-4 py-3 text-gray-600">Always <code>&quot;png&quot;</code>.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 mb-10 text-sm text-amber-900 leading-relaxed">
            <p className="font-semibold mb-1">Authentication</p>
            <p>
              Requests must come through the RapidAPI gateway. The <code className="text-xs bg-amber-100 px-1.5 py-0.5 rounded">x-rapidapi-key</code>
              {' '}you send identifies your subscription, and RapidAPI forwards a static
              {' '}<code className="text-xs bg-amber-100 px-1.5 py-0.5 rounded">Authorization</code> secret to our origin to prove the call is authentic.
              Calling the origin directly without the right secret returns <code>401</code>.
            </p>
          </div>

          <div className="space-y-6">
            <CodeBlock label="cURL" code={CURL} />
            <CodeBlock label="Node.js" code={NODE} />
            <CodeBlock label="Python" code={PYTHON} />
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            What people build with it
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Anywhere a watermark stands between you and a usable asset, this API drops in.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['E-commerce catalogs', 'Clean supplier and dropshipping photos before publishing them on Shopify, Amazon, or Etsy listings.'],
              ['Real estate platforms', 'Strip MLS and photographer watermarks from listing imagery in your ingestion pipeline.'],
              ['Media monitoring', 'Normalize scraped imagery for downstream OCR, classification, or visual search models.'],
              ['Content tools', 'Offer a one-click watermark removal feature inside your photo editor, social scheduler, or AI app.'],
              ['Stock asset workflows', 'Process licensed previews at scale once you have purchased the rights to the underlying images.'],
              ['Internal automations', 'Wire it into Zapier, n8n, or a Lambda function and forget about the inference layer.'],
            ].map(([title, desc]) => (
              <div key={title as string} className="rounded-2xl bg-white border border-gray-100 p-6">
                <p className="font-semibold text-gray-900 mb-2 text-sm">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <p className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                  {q}
                </p>
                <p className="text-gray-600 leading-relaxed pl-6">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight mb-4">
            Ship clean images today.
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Subscribe on RapidAPI, copy your key, and you are live in under five minutes.
          </p>
          <a
            href="https://rapidapi.com/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Get your API key
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  )
}
