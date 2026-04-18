import { Metadata } from 'next'
import Link from 'next/link'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  title: 'Introducing the Goodbye Watermark API — watermark removal as a single HTTP call',
  description:
    'A look at the new watermark removal API: what it does, how it is priced, how to integrate it, and why we shipped it on RapidAPI instead of building yet another dashboard.',
  keywords: [
    'watermark remover api',
    'watermark removal api',
    'rapidapi watermark remover',
    'remove watermark programmatically',
    'image processing api',
    'goodbye watermark api',
  ],
  openGraph: {
    title: 'Introducing the Goodbye Watermark API — watermark removal as a single HTTP call',
    description:
      'JSON in, base64 PNG out. Distributed on RapidAPI, metered billing, no SDK required. Here is the design and how to use it.',
    url: 'https://goodbyewatermark.com/blog/watermark-removal-api',
    siteName: 'Goodbye Watermark',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Introducing the Goodbye Watermark API — watermark removal as a single HTTP call',
    description:
      'JSON in, base64 PNG out. Distributed on RapidAPI, metered billing, no SDK required.',
  },
  alternates: {
    canonical: 'https://goodbyewatermark.com/blog/watermark-removal-api',
  },
}

export default function WatermarkRemovalApiPost() {
  return (
    <div className="min-h-screen bg-white">

      {/* Top nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
            Goodbye Watermark
          </Link>
          <Link
            href="/api-watermark-remover"
            className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            See the API →
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="py-12 sm:py-16 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-4">
            Product
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
            Introducing the Goodbye Watermark API
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl">
            We took the same removal pipeline that powers the website, wrapped it in a single
            HTTPS endpoint, and shipped it on RapidAPI. Here is what it does, how it is priced,
            and how to plug it into your stack in under five minutes.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
            <span>Goodbye Watermark</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
        </div>

        {/* Body */}
        <div className="py-10 sm:py-14 space-y-10">

          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              Why an API, and why on RapidAPI
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Plenty of users have written in asking for programmatic access. Catalog teams
                want to clean supplier photos at scale. Real estate platforms need to scrub
                MLS watermarks during ingestion. Indie developers want to drop watermark removal
                into their own apps without standing up GPU infrastructure.
              </p>
              <p>
                We could have built a dashboard, an account system, billing, rate limiting,
                fraud checks, and a key rotation flow. Or we could ship the endpoint behind
                a marketplace that already does all of that. We picked the second option.
              </p>
              <p>
                RapidAPI handles authentication, metering, billing, and analytics. We handle
                the inference. Subscribers get a single SDK-free integration point, and we
                stay focused on what we are good at.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              What the endpoint does
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                One route, one verb: <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">POST /api/v1/remove-watermark</code>.
                You send a JSON body with a single field, <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">image</code>,
                which can be either an HTTPS URL we can reach or a base64 string. You get back
                a base64 PNG with the watermark removed.
              </p>
              <p>
                Under the hood it is the same Qwen Image 2 Pro pipeline that powers the
                consumer site &mdash; the same model, the same prompt strategy, the same
                resolution preservation. Outputs are not stored. Inputs are not logged. The
                request is fire-and-forget from a privacy standpoint.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              The five-minute integration
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <ol className="space-y-3 list-decimal list-inside">
                <li>Subscribe to the API on RapidAPI and grab your <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">x-rapidapi-key</code>.</li>
                <li>Add it to your environment as <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">RAPIDAPI_KEY</code>.</li>
                <li>POST a JSON body with an <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">image</code> URL or base64 payload.</li>
                <li>Decode the returned <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">image</code> field. Done.</li>
              </ol>
              <p>
                Here is the smallest possible Node.js example:
              </p>
              <pre className="text-xs sm:text-sm bg-gray-950 text-gray-100 p-5 rounded-2xl overflow-x-auto leading-relaxed">
{`const res = await fetch(
  "https://goodbye-watermark-api.p.rapidapi.com/api/v1/remove-watermark",
  {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "goodbye-watermark-api.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageUrlOrBase64 }),
  }
);

const { image } = await res.json();`}
              </pre>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              Pricing and limits
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Plans live on RapidAPI and are tiered pay-as-you-go. There is a free tier so
                you can validate the integration on real images before committing, and paid
                plans scale from hobby to production volumes. Limits, quotas, and overage
                rates are all visible from your RapidAPI dashboard.
              </p>
              <p>
                On the technical side: requests time out after 60 seconds, the maximum image
                size is 50 MB, and concurrency is bounded by the plan you subscribe to.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              How it differs from running the model yourself
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Qwen Image 2 Pro is hosted on Replicate and you can absolutely call it
                directly. The reason to go through this API instead is operational:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>The prompting and parameter setup are already tuned for watermark removal specifically.</li>
                <li>Output normalization to base64 PNG happens server-side &mdash; no extra fetch and re-encode loop in your code.</li>
                <li>You pay one bill, in one currency, on one platform, with one analytics dashboard.</li>
                <li>If we improve the underlying model or swap pipelines later, your integration does not change.</li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              What is on the roadmap
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The v1 endpoint is intentionally minimal. The next iterations on the
                short list:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>A batch endpoint that accepts an array of inputs and returns parallel results.</li>
                <li>An async mode with webhook callbacks for very large jobs.</li>
                <li>Format negotiation: opt in to JPEG or WebP output if PNG is not what you want downstream.</li>
                <li>Region pinning for latency-sensitive workloads.</li>
              </ul>
              <p>
                Have a use case that is not covered? Tell us &mdash; we tend to ship what
                paying customers actually ask for.
              </p>
            </div>
          </section>

          {/* Dark callout */}
          <div className="rounded-2xl bg-gray-900 text-white p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
              Goodbye Watermark API
            </p>
            <h3 className="font-heading text-xl sm:text-2xl font-bold mb-3 leading-snug">
              Same pipeline, exposed as one HTTPS call.
            </h3>
            <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <p>
                Free tier on RapidAPI to test, paid plans starting cheap, no SDK required.
                JSON in, base64 PNG out, watermark gone.
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/api-watermark-remover"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                Read the API docs
              </Link>
              <a
                href="https://rapidapi.com/"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/5 transition-colors"
              >
                Subscribe on RapidAPI
              </a>
            </div>
          </div>

        </div>

        <RelatedArticles articles={[
          {
            href: '/blog/batch-watermark-remover-multiple-images-free',
            label: 'Guide',
            labelColor: 'bg-blue-100 text-blue-700',
            title: 'Batch watermark remover — process multiple images free',
            readTime: '5 min read',
          },
          {
            href: '/blog/best-free-ai-watermark-remover-no-output-watermark',
            label: 'Comparison',
            labelColor: 'bg-indigo-100 text-indigo-700',
            title: 'Best free AI watermark removers that don\'t re-watermark your output',
            readTime: '7 min read',
          },
          {
            href: '/blog/remove-watermark-from-product-photo-ecommerce',
            label: 'E-commerce Guide',
            labelColor: 'bg-emerald-100 text-emerald-700',
            title: 'Remove watermarks from product photos for e-commerce',
            readTime: '6 min read',
          },
        ]} />

        {/* Footer */}
        <div className="py-10 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-gray-900 text-sm">Ready to integrate?</p>
            <p className="text-xs text-gray-400 mt-0.5">Free tier on RapidAPI. No SDK required.</p>
          </div>
          <Link
            href="/api-watermark-remover"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            Open API docs
          </Link>
        </div>

      </div>
    </div>
  )
}
