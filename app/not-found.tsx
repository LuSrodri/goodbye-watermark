import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Image
        src="/goodbyewatermark.com-logo-hero.png"
        alt="Goodbye Watermark"
        width={120}
        height={120}
        className="mb-8 opacity-50"
      />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-8">Page not found</p>
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to home
      </Link>
    </div>
  )
}
