'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Download, Share2, Check, Copy, Loader2, Sparkles } from 'lucide-react'
import { ProcessedImage } from '@/lib/types'

interface Props {
  image: ProcessedImage
  sessionId: string
  onClose: () => void
  title?: string
}

export default function ProcessedImageModal({ image, sessionId, onClose, title = "Watermark Removed!" }: Props) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ startY: 0, currentY: 0, isDragging: false })

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setIsVisible(false)
    setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [handleClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    dragRef.current.startY = e.touches[0].clientY
    dragRef.current.isDragging = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current.isDragging || !modalRef.current) return
    const currentY = e.touches[0].clientY
    const diff = currentY - dragRef.current.startY
    if (diff > 0) {
      modalRef.current.style.transform = `translateY(${diff}px)`
      modalRef.current.style.transition = 'none'
    }
  }

  const handleTouchEnd = () => {
    if (!modalRef.current) return
    const diff = dragRef.current.currentY - dragRef.current.startY
    modalRef.current.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
    if (diff > 100) {
      handleClose()
    } else {
      modalRef.current.style.transform = ''
    }
    dragRef.current.isDragging = false
  }

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
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
      }`}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={`relative w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white md:rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out will-change-transform ${
          isVisible && !isClosing
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-full md:translate-y-8 opacity-0 md:scale-95'
        }`}
        style={{
          maxHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
          paddingBottom: 'env(safe-area-inset-bottom)',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle - Mobile Only */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">{title}</h3>
              <p className="hidden sm:block text-xs text-gray-500">Your image is ready</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 md:p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          <div
            className="relative w-full overflow-auto"
            style={{
              maxHeight: 'calc(100vh - 200px)',
              minHeight: '200px'
            }}
          >
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  <span className="text-sm text-gray-500">Loading image...</span>
                </div>
              </div>
            )}

            {/* Checkerboard pattern for transparency */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
                  linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
                  linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)
                `,
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
              }}
            />

            <img
              src={image.processed_url}
              alt="Processed image"
              className={`relative w-full h-auto object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                maxHeight: 'calc(100vh - 200px)',
                minHeight: '200px'
              }}
              onLoad={() => setImageLoaded(true)}
              draggable={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 md:p-5 border-t border-gray-100 bg-white">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 px-4 md:px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl md:rounded-2xl text-sm md:text-base font-semibold hover:from-gray-800 hover:to-gray-700 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/20 touch-manipulation"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>

          <button
            onClick={handleShare}
            disabled={isSharing}
            className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 px-4 md:px-6 rounded-xl md:rounded-2xl text-sm md:text-base font-semibold transition-all active:scale-[0.98] touch-manipulation ${
              copied
                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSharing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Sharing...</span>
              </>
            ) : copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                {shareUrl ? <Copy className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                <span>{shareUrl ? 'Copy Link' : 'Share'}</span>
              </>
            )}
          </button>
        </div>

        {/* Share URL Display */}
        {shareUrl && (
          <div className="px-4 pb-4 md:px-5 md:pb-5 -mt-2">
            <div
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => copyToClipboard(shareUrl)}
            >
              <div className="flex-1 truncate text-sm text-gray-600 font-mono">
                {shareUrl}
              </div>
              <Copy className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
