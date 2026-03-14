'use client'

import BeforeAfterSlider from './BeforeAfterSlider'

interface PlatformSectionProps {
  badge: string
  badgeColor: string
  headline: string
  body: string
  beforeSrc: string
  afterSrc: string
  reverse?: boolean
}

function PlatformSection({
  badge,
  badgeColor,
  headline,
  body,
  beforeSrc,
  afterSrc,
  reverse = false,
}: PlatformSectionProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-14 items-center`}>
      {/* Text */}
      <div className="flex-1 flex flex-col items-start">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: badgeColor }}
          />
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">
            {badge}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight font-heading leading-tight mb-4">
          {headline}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-md">
          {body}
        </p>
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          Remove watermark free
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Slider */}
      <div className="flex-1 w-full">
        <BeforeAfterSlider
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          className="w-full shadow-lg"
        />
        <p className="mt-2 text-center text-xs text-gray-400">
          Drag the handle to compare before &amp; after
        </p>
      </div>
    </div>
  )
}

export default function WatermarkSections() {
  return (
    <section className="border-t border-gray-100">
      {/* Getty Images */}
      <div className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlatformSection
            badge="Getty Images"
            badgeColor="#CC0000"
            headline="Preview Getty Images without the watermark"
            body="Getty Images uses a bold diagonal watermark that covers the entire photo—making it impossible to judge composition, detail, or color. Our AI removes it cleanly so you can evaluate any stock photo before you buy."
            beforeSrc="/before-after/bikini-girl-with-watermark-gettyimages.png"
            afterSrc="/before-after/bikini-girl-without-watermark-gettyimages.png"
          />
        </div>
      </div>

      {/* Shutterstock */}
      <div className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlatformSection
            badge="Shutterstock"
            badgeColor="#EE2222"
            headline="Shutterstock preview images, unlocked"
            body="Shutterstock's repeating watermark grid makes it nearly impossible to visualize how a photo will look in your project. Remove it instantly to see the full, unobstructed image — free, no account needed."
            beforeSrc="/before-after/football-match-with-watermark-shutterstock.png"
            afterSrc="/before-after/football-match-without-watermark-shutterstock.png"
            reverse
          />
        </div>
      </div>

      {/* Fotop */}
      <div className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PlatformSection
            badge="Fotop"
            badgeColor="#F97316"
            headline="Sports photography without the Fotop watermark"
            body="Fotop documents races, events, and sporting moments — all with prominent watermarks. Whether you're an athlete, fan, or journalist, see your photos clearly. Our AI handles text-based and overlay watermarks alike."
            beforeSrc="/before-after/running-man-witht-watermark-fotop.png"
            afterSrc="/before-after/running-man-without-watermark-fotop.png"
          />
        </div>
      </div>
    </section>
  )
}
