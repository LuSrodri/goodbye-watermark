'use client'

import Link from 'next/link'
import { Layers } from 'lucide-react'
import BeforeAfterSlider from './BeforeAfterSlider'
import { SloganData } from '@/lib/slogans'
import { useSession } from './SessionProvider'

interface Props {
  sloganData: SloganData
}

export default function Hero({ sloganData }: Props) {
  const { openPaywall, paidCredits } = useSession()

  return (
    <div className="flex flex-col items-stretch lg:items-start justify-center h-full">
        {/* Running man before/after — auto-animates on load, then interactive */}
        <div className="relative mb-6 sm:mb-8 self-center w-[56%]">
          <BeforeAfterSlider
            beforeSrc="/before-after/running-man-witht-watermark-fotop.png"
            afterSrc="/before-after/running-man-without-watermark-fotop.png"
            autoAnimate
            className="w-full h-auto shadow-lg"
          />
          {/* Platform badge overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none z-20">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            <span className="text-[10px] font-semibold text-gray-700 tracking-wide">Fotop</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight text-center lg:text-left font-heading">
          {sloganData.slogan}
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 text-center lg:text-left px-4 sm:px-0">
          {sloganData.subslogan}
        </p>

        <div className="mt-3 flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-4 px-4 sm:px-0">
          <Link
            href="/blog/how-to-detect-and-remove-invisible-ai-watermarks"
            className="text-sm text-gray-400 hover:text-indigo-600 transition-colors text-center lg:text-left"
          >
            Also: How to remove invisible AI watermarks (SynthID & others) →
          </Link>

          {!paidCredits && (
            <button
              onClick={openPaywall}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors cursor-pointer group whitespace-nowrap"
              aria-label="Batch processing"
            >
              <Layers className="w-3.5 h-3.5 group-hover:text-emerald-500 transition-colors" />
              <span>Need bulk processing?</span>
            </button>
          )}
        </div>
    </div>
  )
}
