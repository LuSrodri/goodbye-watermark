import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Detect & Remove Invisible AI Watermarks (SynthID and Others)',
  description:
    "Learn what invisible AI watermarks like Google's SynthID are, how they work, why they exist, and how AI image processing can disrupt them.",
  keywords: [
    'remove SynthID watermark',
    'invisible AI watermark',
    'SynthID remover',
    'remove invisible watermark AI image',
    'Google SynthID',
    'C2PA watermark',
    'AI image watermark detection',
    'how to remove AI watermark',
  ],
  openGraph: {
    title: 'How to Detect & Remove Invisible AI Watermarks (SynthID and Others)',
    description:
      "Learn what invisible AI watermarks like Google's SynthID are, how they work, and how AI image processing can disrupt them.",
    url: 'https://goodbyewatermark.com/blog/how-to-detect-and-remove-invisible-ai-watermarks',
    siteName: 'Goodbye Watermark',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Detect & Remove Invisible AI Watermarks (SynthID and Others)',
    description:
      "Learn what invisible AI watermarks like Google's SynthID are, how they work, and how AI image processing can disrupt them.",
  },
  alternates: {
    canonical: 'https://goodbyewatermark.com/blog/how-to-detect-and-remove-invisible-ai-watermarks',
  },
}

export default function InvisibleWatermarkArticle() {
  return (
    <div className="min-h-screen bg-white">

      {/* Top nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
            Goodbye Watermark
          </Link>
          <Link
            href="/"
            className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            Try the tool →
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="py-12 sm:py-16 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4">Guide</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
            Invisible AI Watermarks:<br className="hidden sm:block" /> What They Are and How to Remove Them
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl">
            Google&rsquo;s SynthID, C2PA, and steganographic signals — decoded. How they work, why they exist, and what actually disrupts them.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
            <span>Goodbye Watermark</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
        </div>

        {/* Body */}
        <div className="py-10 sm:py-14 space-y-10">

          {/* Section */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">What is an invisible AI watermark?</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                When you generate an image with tools like Google&rsquo;s Imagen, Gemini, Adobe Firefly, or Stable Diffusion, the resulting file often contains more than what you can see. Alongside the visible pixels, AI companies embed a hidden signal — an <strong className="text-gray-900 font-medium">invisible watermark</strong> — designed to identify the content as AI-generated.
              </p>
              <p>
                Unlike the visible watermarks you&rsquo;re used to (logos, text overlays, semi-transparent stamps), these signals are imperceptible to the human eye. You cannot see them, but specialized tools can detect them — and platforms increasingly use them to label or restrict AI-generated content.
              </p>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Section */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">The main types</h2>

            <div className="space-y-8">
              {/* SynthID */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">G</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">Google SynthID</h3>
                    <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                      <p>
                        SynthID is Google DeepMind&rsquo;s watermarking system, embedded across Imagen, Veo (video), Lyria (audio), and Gemini-generated content. As of late 2025, it has watermarked over <strong className="text-gray-800">10 billion pieces of content</strong>.
                      </p>
                      <p>
                        It works by subtly altering pixel values in the <strong className="text-gray-800">frequency domain</strong> of the image — modifying patterns invisible to humans but detectable by a trained model. It&rsquo;s designed to survive cropping, resizing, JPEG compression, and basic color adjustments.
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400">Strength: High &nbsp;·&nbsp; Survives: Most edits &nbsp;·&nbsp; Detectable via: Google&rsquo;s SynthID tool</p>
                  </div>
                </div>
              </div>

              {/* C2PA */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-xs font-bold">C</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">C2PA / Content Credentials</h3>
                    <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                      <p>
                        C2PA is an industry standard backed by Adobe, Microsoft, Google, and Sony. Instead of hiding a signal inside pixels, it attaches a cryptographically signed <strong className="text-gray-800">manifest to the file&rsquo;s metadata</strong>. This manifest records the content&rsquo;s origin: who created it, when, and with what tool.
                      </p>
                      <p>
                        Adobe Content Credentials (used in Firefly-generated images) are based on C2PA. Unlike SynthID, C2PA credentials are easily removed — simply re-saving or converting the file often strips the metadata.
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400">Strength: Low &nbsp;·&nbsp; Survives: Basic edits only &nbsp;·&nbsp; Detectable via: contentcredentials.org/verify</p>
                  </div>
                </div>
              </div>

              {/* Steganographic */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">S</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">Steganographic watermarks</h3>
                    <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                      <p>
                        Some providers use classical steganography — hiding a binary payload inside the <strong className="text-gray-800">least significant bits</strong> of pixel color values. This is the oldest form of digital watermarking. Stable Diffusion uses it by default.
                      </p>
                      <p>
                        These are the most fragile: aggressive JPEG compression, resizing, or re-encoding typically destroys them entirely.
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-gray-400">Strength: Low &nbsp;·&nbsp; Survives: Minimal edits &nbsp;·&nbsp; Detectable via: Specialized LSB tools</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">Why do these watermarks exist?</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>The stated goals are generally:</p>
              <ul className="space-y-2 pl-4">
                {[
                  ['Provenance & transparency', 'letting platforms and users verify whether content is AI-generated, especially as deepfakes proliferate.'],
                  ['Platform policy enforcement', 'helping platforms detect and label AI content per emerging regulations (EU AI Act, US executive orders).'],
                  ['Copyright tracking', 'some providers use watermarks to monitor unauthorized redistribution of their generated content.'],
                ].map(([term, def]) => (
                  <li key={term} className="flex gap-2">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span><strong className="text-gray-900 font-medium">{term}</strong> — {def}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section — the key one, with honest claim */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">Can invisible watermarks be removed?</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Technically, yes — but with caveats that depend on the type.
              </p>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">SynthID</p>
                  <p className="text-sm">
                    The hardest to remove. Research shows that <strong className="text-gray-800">diffusion model re-rendering disrupts it with ~79% success</strong>, because the process rewrites pixel statistics across the entire image, destroying the frequency-domain patterns where the watermark lives. Other methods — aggressive filters, format re-encoding — degrade detection confidence rather than eliminate the signal completely.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">C2PA / metadata</p>
                  <p className="text-sm">
                    Trivially removable: a simple format conversion (PNG → JPG), stripping EXIF data, or re-saving in any editor that discards metadata eliminates it. The trade-off is losing the verifiable provenance chain.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Steganographic</p>
                  <p className="text-sm">
                    Generally fragile. JPEG re-compression at lower quality, aggressive resizing, or any re-encoding operation typically destroys LSB-based watermarks.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Callout — honest claim about Goodbye Watermark */}
          <div className="rounded-2xl bg-gray-900 text-white p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">How Goodbye Watermark works</p>
            <h3 className="font-heading text-xl sm:text-2xl font-bold mb-3 leading-snug">
              AI image regeneration disrupts invisible watermarks as a side effect
            </h3>
            <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <p>
                Goodbye Watermark uses a multimodal AI model to edit your image — rewriting pixel values throughout the entire frame to cleanly remove visible watermarks like logos, text overlays, and stamps.
              </p>
              <p>
                Because this process <strong className="text-white">regenerates pixel statistics from scratch</strong>, it also disrupts frequency-domain signals like SynthID — the same mechanism behind diffusion re-rendering, which research places at ~79% effectiveness. C2PA metadata is discarded entirely in the output file.
              </p>
              <p className="text-gray-400 text-xs">
                Note: this is a byproduct of how the model works, not a guaranteed feature. Results may vary by image and watermark strength.
              </p>
            </div>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              Try it free — no signup
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <hr className="border-gray-100" />

          {/* Section */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">Detecting AI watermarks: tools</h2>
            <div className="space-y-3">
              {[
                {
                  name: 'SynthID Detector',
                  desc: "Google's public tool for checking images generated by Imagen or Gemini for a SynthID signal.",
                  href: 'https://aisandbox.withgoogle.com/',
                },
                {
                  name: 'Content Credentials Verify',
                  desc: "Adobe's verification tool that reads C2PA manifests and displays the full provenance chain.",
                  href: 'https://contentcredentials.org/verify',
                },
                {
                  name: 'ExifTool',
                  desc: 'Free command-line tool that reads all metadata from image files, including C2PA and standard EXIF fields.',
                  href: null,
                },
                {
                  name: 'Hive Moderation',
                  desc: 'API-based AI content detector that classifies images as AI-generated with high accuracy, regardless of watermark presence.',
                  href: null,
                },
              ].map((tool) => (
                <div key={tool.name} className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
                  <div className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{tool.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{tool.desc}</p>
                    {tool.href && (
                      <a
                        href={tool.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-500 hover:text-indigo-700 mt-1 inline-block transition-colors"
                      >
                        {tool.href.replace('https://', '')} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Ethics note */}
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-sm text-amber-900">
              <strong>Ethics note:</strong> Removing invisible watermarks to misrepresent AI-generated content as human-made can violate platform terms of service and, in some jurisdictions, emerging AI transparency laws. Use this information responsibly.
            </p>
          </div>

          {/* TL;DR */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">The bottom line</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Invisible AI watermarks are becoming standard practice as the industry grapples with provenance, transparency, and regulation. SynthID is the most robust, C2PA is the most interoperable, and steganographic approaches are the most fragile.
              </p>
              <p>
                For most users, the watermark you actually need to remove is the <em>visible</em> one — the logo on a preview image, a stock photo stamp, or an AI generator&rsquo;s branding. As a byproduct of full-image AI regeneration, invisible watermarks are often disrupted in the process too.
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="py-10 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-gray-900 text-sm">Ready to remove a watermark?</p>
            <p className="text-xs text-gray-400 mt-0.5">Free, no signup required. 5 images per day.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            Open Goodbye Watermark
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}
