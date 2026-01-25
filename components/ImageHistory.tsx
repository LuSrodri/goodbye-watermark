'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ChevronRight, Download, Share2, Check, Loader2 } from 'lucide-react'
import { useSession } from './SessionProvider'
import { ProcessedImage } from '@/lib/types'
import { formatDate } from '@/lib/utils'

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
  const [sharingId, setSharingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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

  const handleDownload = async (image: ProcessedImage) => {
    try {
      const response = await fetch(image.processed_url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `watermark-removed-${image.id.slice(0, 8)}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleShare = async (image: ProcessedImage) => {
    setSharingId(image.id)
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id, sessionId })
      })

      const result = await response.json()
      if (result.success && result.data) {
        await navigator.clipboard.writeText(result.data.shareUrl)
        setCopiedId(image.id)
        setTimeout(() => setCopiedId(null), 2000)
      }
    } catch (error) {
      console.error('Share failed:', error)
    } finally {
      setSharingId(null)
    }
  }

  return (
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
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-2 flex-1 scrollbar-hide">
            {recentImages.map((image) => (
              <div
                key={image.id}
                className="flex-shrink-0 group relative"
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.processed_url}
                    alt="Processed image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                  <button
                    onClick={() => handleDownload(image)}
                    className="p-1 sm:p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleShare(image)}
                    disabled={sharingId === image.id}
                    className="p-1 sm:p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Share"
                  >
                    {sharingId === image.id ? (
                      <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700 animate-spin" />
                    ) : copiedId === image.id ? (
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
                    ) : (
                      <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700" />
                    )}
                  </button>
                </div>
                <p className="hidden sm:block text-xs text-gray-400 mt-1 text-center truncate w-20">
                  {formatDate(image.created_at)}
                </p>
              </div>
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
  )
}
