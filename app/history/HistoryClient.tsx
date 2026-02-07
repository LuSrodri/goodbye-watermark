'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Share2, Loader2, ImageIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ProcessedImage } from '@/lib/types'
import { getAllImages, getImageBlob, StoredImage } from '@/lib/db'
import ProcessedImageModal from '@/components/ProcessedImageModal'

function storedToProcessed(stored: StoredImage): ProcessedImage {
  return {
    id: stored.id,
    processed_url: URL.createObjectURL(stored.blob),
    original_url: stored.originalName,
    created_at: stored.createdAt,
  }
}

export default function HistoryClient() {
  const [history, setHistory] = useState<ProcessedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null)
  const objectUrlsRef = useRef<string[]>([])

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const images = await getAllImages()
        const processed = images.map(storedToProcessed)
        objectUrlsRef.current = processed.map(p => p.processed_url)
        setHistory(processed)
      } catch (error) {
        console.error('Failed to load history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()

    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const handleDownload = async (image: ProcessedImage) => {
    try {
      const blob = await getImageBlob(image.id)
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const fileType = blob.type.split('/')[1] || 'webp'
      a.href = url
      a.download = `watermark-removed-${image.id.slice(0, 8)}.${fileType}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleShare = async (image: ProcessedImage) => {
    try {
      const blob = await getImageBlob(image.id)
      if (!blob) return

      const file = new File([blob], `watermark-removed-${image.id.slice(0, 8)}.webp`, {
        type: blob.type || 'image/webp',
      })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Goodbye Watermark',
          text: 'Check out this watermark-free image!',
        })
      } else {
        handleDownload(image)
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link
            href="/"
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your History</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">No images yet</h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">Process your first image to see it here</p>
            <Link
              href="/"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-xl text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors"
            >
              Remove a watermark
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {history.map((image) => (
              <div
                key={image.id}
                className="group relative bg-gray-100 rounded-xl overflow-hidden aspect-square cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.processed_url}
                  alt="Processed image"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                    <p className="text-white text-xs mb-2 truncate">
                      {formatDate(image.created_at)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(image) }}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 bg-white text-gray-900 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShare(image) }}
                        className="p-1.5 sm:p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <ProcessedImageModal
          image={selectedImage}
          title="Image Preview"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  )
}
