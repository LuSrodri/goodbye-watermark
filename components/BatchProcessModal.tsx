'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Download, Loader2, Check, Clock, AlertCircle, Sparkles } from 'lucide-react'
import { ProcessedImage } from '@/lib/types'
import { getImageBlob } from '@/lib/db'

export interface BatchItem {
  file: File
  previewUrl: string
  status: 'queued' | 'processing' | 'done' | 'error'
  result?: ProcessedImage
  error?: string
}

interface Props {
  items: BatchItem[]
  onClose: () => void
}

export default function BatchProcessModal({ items, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const allDone = items.every(i => i.status === 'done' || i.status === 'error')
  const doneCount = items.filter(i => i.status === 'done').length
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setIsVisible(false)
    setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && allDone) handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose, allDone])

  const downloadSingle = async (item: BatchItem) => {
    if (!item.result) return
    const blob = await getImageBlob(item.result.id)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const ext = blob.type.split('/')[1] || 'webp'
    a.href = url
    a.download = `watermark-removed-${item.result.id.slice(0, 8)}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    setIsDownloadingAll(true)
    const doneItems = items.filter(i => i.status === 'done' && i.result)
    for (let i = 0; i < doneItems.length; i++) {
      await downloadSingle(doneItems[i])
      if (i < doneItems.length - 1) {
        await new Promise(r => setTimeout(r, 200))
      }
    }
    setIsDownloadingAll(false)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div
        ref={modalRef}
        className={`relative flex flex-col w-full md:max-w-2xl lg:max-w-3xl bg-white md:rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
          isVisible && !isClosing
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-full md:translate-y-8 opacity-0 md:scale-95'
        }`}
        style={{
          maxHeight: 'calc(100vh - env(safe-area-inset-top) - 32px)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
        }}
      >
        {/* Drag handle — mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 font-heading">
                Batch Processing
              </h3>
              <p className="hidden sm:block text-xs text-gray-500">
                {allDone
                  ? `${doneCount} of ${items.length} completed`
                  : `Processing ${items.length} image${items.length !== 1 ? 's' : ''}…`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={!allDone}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((item, idx) => (
              <BatchCard
                key={idx}
                item={item}
                onDownload={() => downloadSingle(item)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 md:p-5 border-t border-gray-100 bg-white flex-shrink-0">
          <button
            onClick={downloadAll}
            disabled={!allDone || doneCount === 0 || isDownloadingAll}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl text-sm font-semibold hover:from-gray-800 hover:to-gray-700 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
          >
            {isDownloadingAll ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Downloading…</span></>
            ) : (
              <><Download className="w-4 h-4" /><span>Download All ({doneCount})</span></>
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={!allDone}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function BatchCard({ item, onDownload }: { item: BatchItem; onDownload: () => void }) {
  const [rafId, setRafId] = useState<number | null>(null)
  const [shimPos, setShimPos] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (item.status !== 'processing') {
      if (rafId) cancelAnimationFrame(rafId)
      setShimPos(0)
      return
    }
    startRef.current = null
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const t = (ts - startRef.current) / 2000
      setShimPos((t * 100) % 100)
      setRafId(requestAnimationFrame(animate))
    }
    const id = requestAnimationFrame(animate)
    setRafId(id)
    return () => cancelAnimationFrame(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.status])

  const src = item.status === 'done' && item.result ? item.result.processed_url : item.previewUrl

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
      <img
        src={src}
        alt={item.file.name}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Checkerboard for transparency */}
      {item.status === 'done' && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)`,
            backgroundSize: '12px 12px',
            backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
          }}
        />
      )}

      {/* Processing shimmer */}
      {item.status === 'processing' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black/[0.07]" />
          <div
            className="absolute top-0 bottom-0 w-8 pointer-events-none"
            style={{
              right: `${shimPos}%`,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.64), transparent)',
              mixBlendMode: 'screen',
              filter: 'blur(2px)',
            }}
          />
        </div>
      )}

      {/* Status badge */}
      <div className="absolute bottom-2 left-2">
        {item.status === 'queued' && (
          <span className="flex items-center gap-1 bg-black/60 text-white text-[10px] font-medium rounded-full px-2 py-0.5">
            <Clock className="w-2.5 h-2.5" /> Queued
          </span>
        )}
        {item.status === 'processing' && (
          <span className="flex items-center gap-1 bg-black/60 text-white text-[10px] font-medium rounded-full px-2 py-0.5">
            <Loader2 className="w-2.5 h-2.5 animate-spin" /> Processing
          </span>
        )}
        {item.status === 'done' && (
          <span className="flex items-center gap-1 bg-emerald-500/90 text-white text-[10px] font-medium rounded-full px-2 py-0.5">
            <Check className="w-2.5 h-2.5" /> Done
          </span>
        )}
        {item.status === 'error' && (
          <span className="flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-medium rounded-full px-2 py-0.5">
            <AlertCircle className="w-2.5 h-2.5" /> Error
          </span>
        )}
      </div>

      {/* Download on hover (done state) */}
      {item.status === 'done' && (
        <button
          onClick={onDownload}
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all cursor-pointer"
          aria-label="Download"
        >
          <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}
    </div>
  )
}
