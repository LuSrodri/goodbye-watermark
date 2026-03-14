import Link from 'next/link'

const articles = [
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
    href: '/blog/remove-shutterstock-watermark-free',
    label: 'Stock Photos',
    labelColor: 'bg-orange-100 text-orange-700',
    title: 'Remove Shutterstock watermarks free — without paying',
    description:
      'Shutterstock\'s diagonal watermark covers the entire image. Here\'s how AI handles it, what to expect by watermark type, and the legal path forward.',
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
    href: '/blog/remove-watermark-from-graduation-photo',
    label: 'Guide',
    labelColor: 'bg-blue-100 text-blue-700',
    title: 'Remove watermarks from graduation photos — free AI tool',
    description:
      'Photography studios put watermarks on preview shots to drive sales. Here\'s how to remove them, your rights, and the ethical path.',
    readTime: '5 min read',
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
    href: '/blog/remove-canva-watermark-free',
    label: 'Guide',
    labelColor: 'bg-amber-100 text-amber-700',
    title: 'Remove Canva watermarks free — without Canva Pro',
    description:
      'Canva stamps a copyright mark on premium elements when you export without Pro. Here\'s what it is and your three options for removing it.',
    readTime: '6 min read',
  },
]

export default function BlogSection() {
  return (
    <section className="bg-gray-50 border-t border-gray-100 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
              From the blog
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight font-heading">
              Learn about watermarks
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            View all articles
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Article cards */}
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
              <h3 className="text-base font-bold text-gray-900 tracking-tight font-heading leading-snug mb-3 group-hover:text-indigo-600 transition-colors flex-1">
                {article.title}
              </h3>
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

        {/* Mobile view all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            View all articles
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
