import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — Watermark Removal Guides & Tutorials',
  description:
    'Guides, tutorials, and comparisons about watermark removal — stock photos, PDFs, product images, AI tools, and more.',
  openGraph: {
    title: 'Blog — Watermark Removal Guides & Tutorials',
    description:
      'Guides, tutorials, and comparisons about watermark removal — stock photos, PDFs, product images, AI tools, and more.',
    url: 'https://goodbyewatermark.com/blog',
    siteName: 'Goodbye Watermark',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Watermark Removal Guides & Tutorials',
    description:
      'Guides, tutorials, and comparisons about watermark removal — stock photos, PDFs, product images, AI tools, and more.',
  },
  alternates: {
    canonical: 'https://goodbyewatermark.com/blog',
  },
}

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Stock Photos', value: 'Stock Photos' },
  { label: 'Guide', value: 'Guide' },
  { label: 'Tutorial', value: 'Tutorial' },
  { label: 'Comparison', value: 'Comparison' },
  { label: 'AI & Watermarks', value: 'AI & Watermarks' },
  { label: 'Product', value: 'Product' },
]

const articles = [
  {
    href: '/blog/watermark-removal-api',
    label: 'Product',
    labelColor: 'bg-emerald-100 text-emerald-700',
    title: 'Introducing the Goodbye Watermark API — watermark removal as a single HTTP call',
    description:
      'JSON in, base64 PNG out. The new endpoint, what it does, how it is priced, and how to integrate it via RapidAPI in five minutes.',
    readTime: '5 min read',
  },
  {
    href: '/blog/goodbye-watermark-vs-monica-im',
    label: 'Comparison',
    labelColor: 'bg-indigo-100 text-indigo-700',
    title: 'Goodbye Watermark vs Monica.im — which is better for removing watermarks?',
    description:
      'Monica.im is an all-in-one AI assistant. Goodbye Watermark does one thing. Pricing, file size limits, signup requirements, and batch support compared.',
    readTime: '6 min read',
  },
  {
    href: '/blog/goodbye-watermark-vs-watermarkremover',
    label: 'Comparison',
    labelColor: 'bg-indigo-100 text-indigo-700',
    title: 'Goodbye Watermark vs WatermarkRemover.io — honest comparison 2026',
    description:
      'WatermarkRemover.io gives 3 total free credits. Goodbye Watermark gives 3 per day with no signup. Full breakdown of pricing, API, and batch support.',
    readTime: '6 min read',
  },
  {
    href: '/blog/goodbye-watermark-vs-dewatermark',
    label: 'Comparison',
    labelColor: 'bg-indigo-100 text-indigo-700',
    title: 'Goodbye Watermark vs DeWatermark.ai — pricing and features compared',
    description:
      'DeWatermark supports video, PDF, and images with a manual brush tool. Goodbye Watermark is simpler with no account, no ads, and no subscriptions. Which fits your workflow?',
    readTime: '6 min read',
  },
  {
    href: '/blog/goodbye-watermark-vs-ezremove',
    label: 'Comparison',
    labelColor: 'bg-indigo-100 text-indigo-700',
    title: 'Goodbye Watermark vs EzRemove.ai — features and free tier compared',
    description:
      'EzRemove gives 50 free credits per day and cheaper one-time pricing. Goodbye Watermark has batch processing. An honest look at both tools.',
    readTime: '6 min read',
  },
  {
    href: '/blog/how-to-detect-and-remove-invisible-ai-watermarks',
    label: 'AI & Watermarks',
    labelColor: 'bg-violet-100 text-violet-700',
    title: 'How to detect and remove invisible AI watermarks',
    description:
      'SynthID, C2PA, and steganographic watermarks are embedded invisibly into AI-generated images. Learn how they work, why they exist, and how to remove them.',
    readTime: '6 min read',
  },
  {
    href: '/blog/best-free-ai-watermark-remover-no-output-watermark',
    label: 'Comparison',
    labelColor: 'bg-indigo-100 text-indigo-700',
    title: 'Best free AI watermark removers that don\'t re-watermark your output',
    description:
      'Many free tools remove one watermark and add their own. We compared 6 tools to find which ones give you a truly clean image for free.',
    readTime: '7 min read',
  },
  {
    href: '/blog/remove-watermark-without-blurring',
    label: 'Technical Guide',
    labelColor: 'bg-cyan-100 text-cyan-700',
    title: 'Remove watermarks without blurring the image — AI vs old methods',
    description:
      'Old tools smeared the area underneath. Modern AI reconstructs it. Here\'s the difference, why it matters, and how to get artifact-free results every time.',
    readTime: '5 min read',
  },
  {
    href: '/blog/goodbye-watermark-alternative-free',
    label: 'Comparison',
    labelColor: 'bg-indigo-100 text-indigo-700',
    title: 'Goodbye Watermark alternatives — free online tools with no signup',
    description:
      'A comparison of the best free online watermark removers available today, what each one does well, and why no-signup matters.',
    readTime: '6 min read',
  },
  {
    href: '/blog/remove-shutterstock-watermark-free',
    label: 'Stock Photos',
    labelColor: 'bg-orange-100 text-orange-700',
    title: 'Remove Shutterstock watermarks free — without paying',
    description:
      'Shutterstock\'s diagonal watermark covers the entire image. Here\'s how AI handles it, what to expect by watermark type, and the legal path forward.',
    readTime: '5 min read',
  },
  {
    href: '/blog/remove-getty-images-watermark-free',
    label: 'Stock Photos',
    labelColor: 'bg-orange-100 text-orange-700',
    title: 'Remove Getty Images watermarks — free AI tool',
    description:
      'Getty Images watermarks are among the most persistent in stock photography. Here\'s how they work and what AI can do about them.',
    readTime: '5 min read',
  },
  {
    href: '/blog/how-to-remove-istock-watermark-online-free',
    label: 'Stock Photos',
    labelColor: 'bg-orange-100 text-orange-700',
    title: 'How to remove iStock watermarks online free (2026)',
    description:
      'iStock preview images carry Getty\'s watermark system. Here\'s an up-to-date guide on removal options, tools, and what works best in 2026.',
    readTime: '5 min read',
  },
  {
    href: '/blog/remove-adobe-stock-watermark-free',
    label: 'Stock Photos',
    labelColor: 'bg-orange-100 text-orange-700',
    title: 'Remove Adobe Stock preview watermarks free with AI',
    description:
      'Adobe Stock preview images have a distinctive watermark. Here\'s how AI handles it and when you should just license the asset instead.',
    readTime: '5 min read',
  },
  {
    href: '/blog/remove-canva-watermark-free',
    label: 'Guide',
    labelColor: 'bg-amber-100 text-amber-700',
    title: 'Remove Canva watermarks free — without Canva Pro',
    description:
      'Canva stamps a copyright mark on premium elements when you export without Pro. Here\'s what it is and your three options for removing it.',
    readTime: '6 min read',
  },
  {
    href: '/blog/remove-transparent-watermark-without-photoshop',
    label: 'Tutorial',
    labelColor: 'bg-green-100 text-green-700',
    title: 'Remove transparent watermarks from images — without Photoshop',
    description:
      'Semi-transparent overlays and ghost logos are among the hardest to remove manually. AI handles them automatically by seeing through the layer.',
    readTime: '6 min read',
  },
  {
    href: '/blog/remove-watermark-from-graduation-photo',
    label: 'Guide',
    labelColor: 'bg-blue-100 text-blue-700',
    title: 'Remove watermarks from graduation photos — free AI tool',
    description:
      'Photography studios put watermarks on preview shots to drive sales. Here\'s how to remove them, your rights, and the ethical path.',
    readTime: '5 min read',
  },
  {
    href: '/blog/remove-timestamp-watermark-from-old-photos',
    label: 'Tutorial',
    labelColor: 'bg-green-100 text-green-700',
    title: 'Remove timestamp watermarks from old photos online',
    description:
      'Date stamps from film cameras, VHS frame grabs, and old digital cameras burn into memories. AI erases them cleanly — step by step.',
    readTime: '5 min read',
  },
  {
    href: '/blog/remove-watermark-from-product-photo-ecommerce',
    label: 'E-commerce Guide',
    labelColor: 'bg-emerald-100 text-emerald-700',
    title: 'Remove watermarks from product photos for e-commerce',
    description:
      'Supplier images, AliExpress catalog photos, and stock shots often come watermarked. The complete workflow for Amazon, Shopify, and Etsy sellers.',
    readTime: '6 min read',
  },
  {
    href: '/blog/watermark-remover-real-estate-photos',
    label: 'Real Estate Guide',
    labelColor: 'bg-teal-100 text-teal-700',
    title: 'Watermark remover for real estate listing photos',
    description:
      'MLS photos, agency watermarks, and photographer branding can clutter listings. The professional workflow for clean real estate images.',
    readTime: '6 min read',
  },
  {
    href: '/blog/remove-watermark-from-contract-pdf',
    label: 'Guide',
    labelColor: 'bg-amber-100 text-amber-700',
    title: 'Remove watermarks from contract PDFs — no software needed',
    description:
      'DRAFT, CONFIDENTIAL, and VOID watermarks on PDF contracts are meant to be temporary. Here\'s how to remove them online when you have the final version.',
    readTime: '6 min read',
  },
  {
    href: '/blog/remove-watermark-from-pdf-online-free',
    label: 'Guide',
    labelColor: 'bg-amber-100 text-amber-700',
    title: 'Remove watermarks from PDFs online — free, no signup',
    description:
      'A practical guide to removing text and image watermarks from PDF files without installing software or creating an account.',
    readTime: '5 min read',
  },
  {
    href: '/blog/remove-watermark-from-video-without-re-encoding',
    label: 'Tutorial',
    labelColor: 'bg-green-100 text-green-700',
    title: 'Remove watermarks from video without re-encoding',
    description:
      'Re-encoding a video to remove a watermark degrades quality. Here are the techniques that preserve the original encoding while cleaning the frame.',
    readTime: '6 min read',
  },
  {
    href: '/blog/how-to-remove-watermark-from-jpeg-image-online',
    label: 'Tutorial',
    labelColor: 'bg-green-100 text-green-700',
    title: 'How to remove watermarks from JPEG images online',
    description:
      'JPEG\'s compression makes watermark removal trickier than PNG. Here\'s a step-by-step guide that accounts for JPEG-specific quirks.',
    readTime: '5 min read',
  },
  {
    href: '/blog/batch-watermark-remover-multiple-images-free',
    label: 'Guide',
    labelColor: 'bg-blue-100 text-blue-700',
    title: 'Batch watermark remover — process multiple images free',
    description:
      'Removing watermarks one by one is slow. Here\'s how to handle multiple images at once and which free tools actually support bulk processing.',
    readTime: '5 min read',
  },
  {
    href: '/blog/ai-watermark-remover-for-screenshots',
    label: 'Tutorial',
    labelColor: 'bg-green-100 text-green-700',
    title: 'AI watermark remover for screenshots — no download needed',
    description:
      'Screenshots often carry UI watermarks, app branding, or overlay text. Here\'s how to remove them online without installing anything.',
    readTime: '4 min read',
  },
  {
    href: '/blog/remove-watermark-from-image-iphone-free',
    label: 'Guide',
    labelColor: 'bg-blue-100 text-blue-700',
    title: 'How to remove watermarks from images on iPhone — free',
    description:
      'No desktop? No problem. Here\'s the complete mobile guide for removing watermarks directly from your iPhone using browser-based AI tools.',
    readTime: '4 min read',
  },
  {
    href: '/blog/remove-logo-from-image-ai',
    label: 'Tutorial',
    labelColor: 'bg-green-100 text-green-700',
    title: 'Remove logos from images automatically with AI',
    description:
      'AI can detect and erase brand logos, copyright badges, and agency marks from images automatically. Here\'s how it works and when it excels.',
    readTime: '5 min read',
  },
  {
    href: '/blog/remove-watermark-free-without-losing-quality',
    label: 'Guide',
    labelColor: 'bg-blue-100 text-blue-700',
    title: 'Remove watermarks free without losing image quality',
    description:
      'Cheap tools degrade resolution. AI-based inpainting preserves full HD quality while removing watermarks. Here\'s what to look for and why it matters.',
    readTime: '5 min read',
  },
  {
    href: '/blog/remove-dreamstime-watermark-free',
    label: 'Stock Photos',
    labelColor: 'bg-orange-100 text-orange-700',
    title: 'Remove Dreamstime watermarks free — AI tool guide',
    description:
      'Dreamstime places a semi-transparent watermark on every preview image. Here\'s how their system works, what AI can realistically do, and when to just license the image.',
    readTime: '5 min read',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Top nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="py-12 sm:py-16 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4">Blog</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Watermark removal guides &amp; tutorials
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
            Practical guides on removing watermarks from stock photos, PDFs, product images, videos, and more — using AI tools that are actually free.
          </p>
        </div>

        {/* Article grid */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.labelColor}`}>
                    {article.label}
                  </span>
                  <span className="text-xs text-gray-400">{article.readTime}</span>
                </div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight font-heading leading-snug mb-3 group-hover:text-indigo-600 transition-colors flex-1">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {article.description}
                </p>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-indigo-600 transition-colors mt-auto">
                  Read article
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
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
