'use client'

import { SessionProvider } from '@/components/SessionProvider'
import Hero from '@/components/Hero'
import DropZone from '@/components/DropZone'
import ExampleImages from '@/components/ExampleImages'
import ImageHistory from '@/components/ImageHistory'
import WatermarkSections from '@/components/WatermarkSections'
import BlogSection from '@/components/BlogSection'
import { SloganData } from '@/lib/slogans'

interface Props {
  sloganData: SloganData
}

function FooterCredit() {
  return (
    <p className="text-xs text-gray-400 text-center">
      Feito com ❤️ por{' '}
      <a
        href="https://lusrodri.me"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-700 hover:underline transition-colors"
      >
        Lucas Santos Rodrigues
      </a>
    </p>
  )
}

export default function HomeClient({ sloganData }: Props) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1">
          {/* ── Hero + Tool ── above the fold */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
              <Hero sloganData={sloganData} />
              <div>
                <DropZone />
                <ExampleImages />
              </div>
            </div>
          </section>

          {/* ── Recent history — moved from footer ── */}
          <section className="border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <ImageHistory />
            </div>
          </section>

          {/* ── Platform before/after sections ── */}
          <WatermarkSections />

          {/* ── Blog ── */}
          <BlogSection />
        </main>

        {/* ── Footer ── */}
        <footer className="bg-white border-t border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <FooterCredit />
          </div>
        </footer>
      </div>
    </SessionProvider>
  )
}
