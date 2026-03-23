import Link from 'next/link'

export interface RelatedArticle {
  href: string
  label: string
  labelColor: string
  title: string
  readTime: string
}

export default function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  return (
    <section className="py-10 border-t border-gray-100">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Related articles</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 hover:border-gray-200 hover:shadow-sm transition-all flex flex-col gap-3"
          >
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start ${article.labelColor}`}>
              {article.label}
            </span>
            <p className="text-sm font-bold text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors flex-1 font-heading">
              {article.title}
            </p>
            <p className="text-xs text-gray-400">{article.readTime}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
