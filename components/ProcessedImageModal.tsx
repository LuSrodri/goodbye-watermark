'use client'

import { useState } from 'react'
import { X, Download, Share2, Check, Copy, Loader2 } from 'lucide-react'
import { ProcessedImage } from '@/lib/types'
import { useSession } from './SessionProvider'

interface Props {
  image: ProcessedImage
  onClose: () => void
}

export default function ProcessedImageModal({ image, onClose }: Props) {
  const { sessionId } = useSession()
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleDownload = async () => {
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

  const handleShare = async () => {
    if (shareUrl) {
      await copyToClipboard(shareUrl)
      return
    }

    setIsSharing(true)
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id, sessionId })
      })

      const result = await response.json()
      if (result.success && result.data) {
        setShareUrl(result.data.shareUrl)
        await copyToClipboard(result.data.shareUrl)
      }
    } catch (error) {
      console.error('Share failed:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-none"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Watermark Removed!</h3>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image.processed_url}
              alt="Processed image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-900 text-white rounded-xl text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Download
          </button>
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : copied ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                {shareUrl ? <Copy className="w-4 h-4 sm:w-5 sm:h-5" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                {shareUrl ? 'Copy Link' : 'Share'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
