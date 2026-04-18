import Link from 'next/link'
import { Code2, Zap, Lock, ArrowRight } from 'lucide-react'

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: 'One call, clean image',
    desc: 'Send a base64 string or a URL. Get back a watermark-free PNG in seconds.',
  },
  {
    icon: Code2,
    title: 'No SDK required',
    desc: 'Plain HTTPS + JSON. Works from any language, any runtime, any cloud.',
  },
  {
    icon: Lock,
    title: 'Pay-as-you-go on RapidAPI',
    desc: 'Predictable per-call pricing, no monthly minimums, free tier to start.',
  },
]

const SAMPLE = `curl -X POST \\
  https://goodbye-watermark-api.p.rapidapi.com/api/v1/remove-watermark \\
  -H "x-rapidapi-key: YOUR_RAPIDAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "https://example.com/photo-with-watermark.jpg"
  }'`

export default function ApiSection() {
  return (
    <section className="bg-gray-950 text-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: pitch */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">
              For developers
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5">
              Same model, behind a single HTTP call.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-lg">
              Plug Goodbye Watermark&apos;s removal pipeline straight into your app, your scraper,
              your e-commerce automation, or your batch processing job. Distributed via
              RapidAPI &mdash; metered billing, instant keys, zero infra on your side.
            </p>

            <ul className="space-y-5 mb-9">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/api-watermark-remover"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                See API docs
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://rapidapi.com/"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-white/5 transition-colors"
              >
                Subscribe on RapidAPI
              </a>
            </div>
          </div>

          {/* Right: code sample */}
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
              </div>
              <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">
                cURL
              </span>
            </div>
            <pre className="p-5 text-[12px] sm:text-[13px] leading-relaxed font-mono text-gray-300 overflow-x-auto">
              <code>{SAMPLE}</code>
            </pre>
            <div className="px-5 py-3 border-t border-white/10 bg-white/[0.02] text-[11px] text-gray-500 font-mono">
              → 200 OK · {'{ "success": true, "image": "data:image/png;base64,...", "format": "png" }'}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
