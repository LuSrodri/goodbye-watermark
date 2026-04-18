'use client'

import { SessionProvider, useSession } from '@/components/SessionProvider'
import Hero from '@/components/Hero'
import DropZone from '@/components/DropZone'
import ExampleImages from '@/components/ExampleImages'
import ImageHistory from '@/components/ImageHistory'
import WatermarkSections from '@/components/WatermarkSections'
import ApiSection from '@/components/ApiSection'
import BlogSection from '@/components/BlogSection'
import PaywallModal from '@/components/PaywallModal'
import { SloganData } from '@/lib/slogans'

interface Props {
  sloganData: SloganData
}

function FooterCredit() {
  return (
    <div className="flex flex-col items-center gap-1.5">
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
      <p className="text-xs text-gray-400 text-center">
        Looking for help? Get in contact:{' '}
        <a
          href="mailto:rodrigueslucass@outlook.com.br"
          className="text-gray-500 hover:text-gray-700 hover:underline transition-colors"
        >
          rodrigueslucass@outlook.com.br
        </a>
      </p>
    </div>
  )
}

function PageContent({ sloganData }: Props) {
  const { showPaywall, closePaywall } = useSession()

  return (
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

        {/* ── Recent history ── */}
        <section className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ImageHistory />
          </div>
        </section>

        {/* ── Platform before/after sections ── */}
        <WatermarkSections />

        {/* ── Developer API ── */}
        <ApiSection />

        {/* ── Blog ── */}
        <BlogSection />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <FooterCredit />
        </div>
      </footer>

      {/* ── Paywall Modal (single mount point) ── */}
      {showPaywall && <PaywallModal onClose={closePaywall} />}
    </div>
  )
}

export default function HomeClient({ sloganData }: Props) {
  return (
    <SessionProvider>
      <PageContent sloganData={sloganData} />
    </SessionProvider>
  )
}
