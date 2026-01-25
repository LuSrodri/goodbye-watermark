'use client'

import { SessionProvider } from '@/components/SessionProvider'
import Hero from '@/components/Hero'
import DropZone from '@/components/DropZone'
import ExampleImages from '@/components/ExampleImages'
import ImageHistory from '@/components/ImageHistory'
import { SloganData } from '@/lib/slogans'

interface Props {
  sloganData: SloganData
}

export default function HomeClient({ sloganData }: Props) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 pb-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Hero sloganData={sloganData} />
            <div>
              <DropZone />
              <ExampleImages />
            </div>
          </div>
        </main>
        <ImageHistory />
      </div>
    </SessionProvider>
  )
}
