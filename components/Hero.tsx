'use client'

import Link from 'next/link'
import BeforeAfterSlider from './BeforeAfterSlider'
import { SloganData } from '@/lib/slogans'

interface Props {
  sloganData: SloganData
}

export default function Hero({ sloganData }: Props) {
  return (
    <div className="flex flex-col items-stretch lg:items-start">
      {/* Running man before/after — auto-animates on load, then interactive */}
      <div className="relative mb-6 sm:mb-8">
        <BeforeAfterSlider
          beforeSrc="/before-after/running-man-witht-watermark-fotop.png"
          afterSrc="/before-after/running-man-without-watermark-fotop.png"
          autoAnimate
          className="w-[60%] h-auto shadow-lg"
        />
        {/* Platform badge overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 pointer-events-none z-20">
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
          <span className="text-[10px] font-semibold text-gray-700 tracking-wide">Fotop</span>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight text-center lg:text-left font-heading">
        {sloganData.slogan}
      </h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-md text-center lg:text-left px-4 sm:px-0">
        {sloganData.subslogan}
      </p>
      <Link
        href="/blog/how-to-detect-and-remove-invisible-ai-watermarks"
        className="mt-3 text-sm text-gray-400 hover:text-indigo-600 transition-colors text-center lg:text-left px-4 sm:px-0"
      >
        Also: How to remove invisible AI watermarks (SynthID & others) →
      </Link>
    </div>
  )
}
