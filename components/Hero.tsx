'use client'

import Image from 'next/image'
import { SloganData } from '@/lib/slogans'

interface Props {
  sloganData: SloganData
}

export default function Hero({ sloganData }: Props) {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <Image
        src="/goodbyewatermark.com-logo-hero.png"
        alt="Goodbye Watermark"
        width={280}
        height={280}
        priority
        className="mb-6 sm:mb-8 w-40 h-40 sm:w-56 sm:h-56 lg:w-[280px] lg:h-[280px]"
      />
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight text-center lg:text-left">
        {sloganData.slogan}
      </h1>
      <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-md text-center lg:text-left px-4 sm:px-0">
        {sloganData.subslogan}
      </p>
    </div>
  )
}
