'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ChevronRight, Loader2 } from 'lucide-react'
import { useSession } from './SessionProvider'
import { ProcessedImage } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import ProcessedImageModal from './ProcessedImageModal'

function FooterCredit() {
  return (
    <p className="text-xs text-gray-400">
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

export default function ImageHistory() {
  const { history, sessionId, isLoading } = useSession()
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null)

  if (isLoading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 sm:p-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs sm:text-sm">Loading...</span>
          </div>
          <FooterCredit />
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <FooterCredit />
        </div>
      </div>
    )
  }

  const recentImages = history.slice(0, 5)

  return (
    <>
    {selectedImage && (
      <ProcessedImageModal
        image={selectedImage}
        sessionId={sessionId}
        title="Image Preview"
        onClose={() => setSelectedImage(null)}
      />
    )}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Recent</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {history.length > 5 && (
              <Link
                href="/history"
                className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                View all
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 sm:gap-4">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 flex-1 scrollbar-hide">
            {recentImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="flex-shrink-0 group"
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 ring-2 ring-transparent group-hover:ring-gray-300 transition-all">
                  <img
                    src={image.processed_url}
                    alt="Processed image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="hidden sm:block text-xs text-gray-400 mt-1 text-center truncate w-20">
                  {formatDate(image.created_at)}
                </p>
              </button>
            ))}
          </div>
          <div className="flex-shrink-0 pb-1 sm:pb-2 hidden sm:block">
            <FooterCredit />
          </div>
        </div>

        {/* Mobile footer credit */}
        <div className="sm:hidden mt-2 pt-2 border-t border-gray-100 flex justify-center">
          <FooterCredit />
        </div>
      </div>
    </div>
    </>
  )
}
