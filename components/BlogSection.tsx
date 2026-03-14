import Link from 'next/link'

const articles = [
  {
    href: '/blog/how-to-detect-and-remove-invisible-ai-watermarks',
    label: 'AI & Watermarks',
    labelColor: 'bg-violet-100 text-violet-700',
    title: 'How to detect and remove invisible AI watermarks',
    description:
      'SynthID, C2PA, and steganographic watermarks are embedded invisibly into AI-generated images. Learn how they work, why they exist, and the techniques used to detect or remove them.',
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

          {/* Placeholder card — encourages exploration */}
          <div className="bg-white rounded-2xl p-6 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center min-h-[180px]">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">More articles coming soon</p>
          </div>
        </div>
      </div>
    </section>
  )
}
