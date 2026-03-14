'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ChevronRight, Loader2 } from 'lucide-react'
import { useSession } from './SessionProvider'
import { ProcessedImage } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import ProcessedImageModal from './ProcessedImageModal'

export default function ImageHistory() {
  const { history, isLoading } = useSession()
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null)

  if (isLoading) {
    return (
      <div className="py-4 px-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs sm:text-sm">Loading history…</span>
        </div>
      </div>
    )
  }

  if (history.length === 0) return null

  const recentImages = history.slice(0, 5)

  return (
    <>
      {selectedImage && (
        <ProcessedImageModal
          image={selectedImage}
          title="Image Preview"
          onClose={() => setSelectedImage(null)}
        />
      )}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">Your recent removals</span>
          </div>
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
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recentImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 ring-2 ring-transparent group-hover:ring-gray-300 transition-all">
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
      </div>
    </>
  )
}
