'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Download, Share2, Loader2, Sparkles } from 'lucide-react'
import { ProcessedImage } from '@/lib/types'
import { getImageBlob } from '@/lib/db'

interface Props {
  image: ProcessedImage | null
  onClose: () => void
  title?: string
  isProcessing?: boolean
  originalSrc?: string
}

export default function ProcessedImageModal({
  image,
  onClose,
  title = "Watermark Removed!",
  isProcessing = false,
  originalSrc,
}: Props) {
  const [isSharing, setIsSharing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  // Start at 0 if not processing (history view), 100 if processing (will animate to 0 on reveal)
  const [revealPosition, setRevealPosition] = useState(isProcessing ? 100 : 0)
  const [processingPosition, setProcessingPosition] = useState(0)

  const modalRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ startY: 0, currentY: 0, isDragging: false })
  const rafRef = useRef<number | null>(null)
  const prevIsProcessing = useRef(isProcessing)
  const revealStartRef = useRef<number | null>(null)
  const processingStartRef = useRef<number | null>(null)

  // revealPosition > 0 (while image is ready) means the reveal sweep is in progress
  const revealInProgress = !isProcessing && image !== null && revealPosition > 0
  const showOriginal = isProcessing || revealInProgress
  const showProcessed = !isProcessing && image !== null

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Trigger reveal animation when processing finishes
  useEffect(() => {
    if (prevIsProcessing.current && !isProcessing && image) {
      setRevealPosition(100)
      revealStartRef.current = null

      const animate = (ts: number) => {
        if (!revealStartRef.current) revealStartRef.current = ts
        const t = Math.min((ts - revealStartRef.current) / 1400, 1)
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        setRevealPosition(100 - eased * 100)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setRevealPosition(0)
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    prevIsProcessing.current = isProcessing

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isProcessing, image])

  useEffect(() => {
    if (isProcessing) {
      processingStartRef.current = null

      const animateProcessing = (ts: number) => {
        if (!processingStartRef.current) processingStartRef.current = ts
        const t = (ts - processingStartRef.current) / 2000
        setProcessingPosition((t * 100) % 100)
        rafRef.current = requestAnimationFrame(animateProcessing)
      }
      rafRef.current = requestAnimationFrame(animateProcessing)
    } else {
      setProcessingPosition(0)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isProcessing])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setIsVisible(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
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
    if (!image) return
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

  const handleShare = async () => {
    if (!image) return
    setIsSharing(true)
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
        handleDownload()
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-all duration-300 ease-out ${isVisible && !isClosing ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
        }`}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={`relative flex flex-col w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white md:rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out will-change-transform ${isVisible && !isClosing
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
            <div className={`hidden sm:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg ${isProcessing ? 'animate-pulse' : ''}`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 font-heading">
                {isProcessing ? 'Removing watermark...' : title}
              </h3>
              <p className="hidden sm:block text-xs text-gray-500">
                {isProcessing ? 'AI is working its magic' : 'Your image is ready'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 md:p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 min-h-0 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          <div
            className="relative w-full h-full overflow-auto"
            style={{ minHeight: '120px' }}
          >
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

            {/* Original image — layout anchor during processing & reveal sweep */}
            {showOriginal && originalSrc && (
              <img
                src={originalSrc}
                alt="Original image"
                className="relative w-full h-auto object-contain"
                style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '200px' }}
                draggable={false}
              />
            )}

            {/* Placeholder when no originalSrc during processing */}
            {isProcessing && !originalSrc && (
              <div
                className="relative w-full bg-gray-200"
                style={{ height: '300px', minHeight: '200px' }}
              />
            )}

            {/* Processed image — absolute overlay during reveal, normal after */}
            {showProcessed && (
              <img
                src={image!.processed_url}
                alt="Processed image"
                className={`object-contain transition-opacity duration-300 ${revealInProgress
                  ? 'absolute inset-0 w-full h-full'
                  : `relative w-full h-auto ${imageLoaded ? 'opacity-100' : 'opacity-0'}`
                  }`}
                style={{
                  maxHeight: revealInProgress ? undefined : 'calc(100vh - 200px)',
                  minHeight: revealInProgress ? undefined : '200px',
                  clipPath: revealInProgress ? `inset(0 0 0 ${revealPosition}%)` : undefined,
                }}
                onLoad={() => setImageLoaded(true)}
                draggable={false}
              />
            )}

            {isProcessing && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-black/[0.07]" />
                <div
                  className="absolute top-0 bottom-0 w-8 pointer-events-none z-10"
                  style={{
                    right: `${processingPosition}%`,
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.64), transparent)',
                    mixBlendMode: 'screen',
                    filter: 'blur(2px)',
                  }}
                />
                <div className="absolute inset-0 flex items-end justify-center pb-6">
                  <p className="text-xs font-medium text-white/80 tracking-widest uppercase drop-shadow">
                    Processing
                  </p>
                </div>
              </div>
            )}

            {/* Reveal glow at the sweep edge */}
            {revealInProgress && (
              <div
                className="absolute top-0 bottom-0 w-8 pointer-events-none z-10"
                style={{
                  left: `${revealPosition}%`,
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.64), transparent)',
                }}
              />
            )}

            {/* Loading skeleton for history/direct open */}
            {!isProcessing && !imageLoaded && image && !revealInProgress && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  <span className="text-sm text-gray-500">Loading image...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 md:p-5 border-t border-gray-100 bg-white">
          <button
            onClick={handleDownload}
            disabled={isProcessing || !image}
            className="flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 px-4 md:px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl md:rounded-2xl text-sm md:text-base font-semibold hover:from-gray-800 hover:to-gray-700 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/20 touch-manipulation cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>

          <button
            onClick={handleShare}
            disabled={isSharing || isProcessing || !image}
            className="flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 px-4 md:px-6 rounded-xl md:rounded-2xl text-sm md:text-base font-semibold transition-all active:scale-[0.98] touch-manipulation bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Sharing...</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Cross-sell */}
        <div className="px-4 pb-4 md:px-5 md:pb-5">
          <a
            href="https://ihatebackground.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all group"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">Also need to remove the background?</p>
              <p className="text-xs md:text-sm text-gray-400 truncate">Try <span className="text-violet-600">ihatebackground.com</span> — free, private &amp; unlimited</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
