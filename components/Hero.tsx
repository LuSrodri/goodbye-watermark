'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SloganData } from '@/lib/slogans'

interface Props {
  sloganData: SloganData
}

export default function Hero({ sloganData }: Props) {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <Image
        src="/goodbyewatermark-hero.png"
        alt="Goodbye Watermark"
        width={480}
        height={480}
        priority
        className="mb-6 sm:mb-8 w-[80%] h-auto self-center"
      />
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
