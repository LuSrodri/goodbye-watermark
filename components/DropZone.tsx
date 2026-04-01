'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { track } from '@vercel/analytics'
import { Upload, ImageIcon, Loader2, Check, AlertCircle, Gem, Layers } from 'lucide-react'
import { useSession } from './SessionProvider'
import { fileToBase64, isValidImageType, MAX_FILE_SIZE } from '@/lib/utils'
import { ProcessedImage, ProcessImageResponse } from '@/lib/types'
import ProcessedImageModal from './ProcessedImageModal'
import BatchProcessModal, { BatchItem } from './BatchProcessModal'

function base64ToBlob(base64: string): Blob {
  const [header, data] = base64.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'image/webp'
  const bytes = atob(data)
  const buffer = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    buffer[i] = bytes.charCodeAt(i)
  }
  return new Blob([buffer], { type: mime })
}

export default function DropZone() {
  const { remainingToday, paidCredits, addToHistory, consumePaidCredit, openPaywall } = useSession()
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [originalSrc, setOriginalSrc] = useState<string | null>(null)
  const [batchItems, setBatchItems] = useState<BatchItem[]>([])
  const [showBatch, setShowBatch] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const originalSrcRef = useRef<string | null>(null)
  const batchProcessingRef = useRef(false)

  const hasPaidCredits = paidCredits > 0
  const totalRemaining = hasPaidCredits ? paidCredits : remainingToday
  const isDisabled = totalRemaining <= 0

  const revokeOriginalSrc = useCallback(() => {
    if (originalSrcRef.current) {
      URL.revokeObjectURL(originalSrcRef.current)
      originalSrcRef.current = null
    }
  }, [])

  // Single image processing
  const processImage = useCallback(async (file: File) => {
    if (!isValidImageType(file)) {
      setError('Please upload a JPG, PNG, or WebP image')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be less than 50MB')
      return
    }
    if (isDisabled) {
      track('free_limit_reached')
      openPaywall()
      return
    }

    setError(null)
    setIsProcessing(true)

    revokeOriginalSrc()
    const previewUrl = URL.createObjectURL(file)
    originalSrcRef.current = previewUrl
    setOriginalSrc(previewUrl)
    setProcessedImage(null)
    setShowModal(true)

    try {
      const base64 = await fileToBase64(file)
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Failed to process image')

      const data = result.data as ProcessImageResponse
      const blob = base64ToBlob(data.processedBase64)

      if (hasPaidCredits) {
        await consumePaidCredit()
      }

      const newImage = await addToHistory(blob, file.name, hasPaidCredits)
      track('image_processed', { credit_type: hasPaidCredits ? 'paid' : 'free' })
      setProcessedImage(newImage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image')
      setShowModal(false)
      revokeOriginalSrc()
      setOriginalSrc(null)
    } finally {
      setIsProcessing(false)
    }
  }, [isDisabled, hasPaidCredits, addToHistory, consumePaidCredit, openPaywall, revokeOriginalSrc])

  // Batch processing
  const processBatch = useCallback(async (files: File[]) => {
    const valid = files
      .filter(f => isValidImageType(f) && f.size <= MAX_FILE_SIZE)
      .slice(0, paidCredits)

    if (valid.length === 0) return

    const items: BatchItem[] = valid.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'queued',
    }))

    setBatchItems(items)
    setShowBatch(true)
    batchProcessingRef.current = true

    for (let i = 0; i < items.length; i++) {
      setBatchItems(prev => {
        const next = [...prev]
        next[i] = { ...next[i], status: 'processing' }
        return next
      })

      try {
        const base64 = await fileToBase64(items[i].file)
        const response = await fetch('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        })
        const result = await response.json()
        if (!result.success) throw new Error(result.error || 'Failed')

        const blob = base64ToBlob(result.data.processedBase64)
        await consumePaidCredit()
        const newImage = await addToHistory(blob, items[i].file.name, true)
        track('image_processed', { credit_type: 'paid' })

        setBatchItems(prev => {
          const next = [...prev]
          next[i] = { ...next[i], status: 'done', result: newImage }
          return next
        })
      } catch {
        setBatchItems(prev => {
          const next = [...prev]
          next[i] = { ...next[i], status: 'error', error: 'Failed to process' }
          return next
        })
      }
    }

    batchProcessingRef.current = false
  }, [paidCredits, addToHistory, consumePaidCredit])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    if (hasPaidCredits && files.length > 1) {
      processBatch(files)
    } else if (files[0]) {
      processImage(files[0])
    }
  }, [hasPaidCredits, processImage, processBatch])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    if (hasPaidCredits && files.length > 1) {
      processBatch(files)
    } else if (files[0]) {
      processImage(files[0])
    }
    e.target.value = ''
  }, [hasPaidCredits, processImage, processBatch])

  const handleClick = useCallback(() => {
    if (isDisabled) {
      openPaywall()
      return
    }
    fileInputRef.current?.click()
  }, [isDisabled, openPaywall])

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            processImage(file)
            break
          }
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [processImage])

  const handleModalClose = useCallback(() => {
    revokeOriginalSrc()
    setShowModal(false)
    setProcessedImage(null)
    setOriginalSrc(null)
  }, [revokeOriginalSrc])

  const handleBatchClose = useCallback(() => {
    batchItems.forEach(item => URL.revokeObjectURL(item.previewUrl))
    setShowBatch(false)
    setBatchItems([])
  }, [batchItems])

  return (
    <>
      <div className="w-full">
        <div
          onClick={!isProcessing ? handleClick : undefined}
          onDrop={!isProcessing ? handleDrop : undefined}
          onDragOver={!isProcessing ? handleDragOver : undefined}
          onDragLeave={handleDragLeave}
          className={`
            relative flex flex-col items-center justify-center
            w-full h-[40dvh] min-h-[320px] max-h-[400px] rounded-2xl border-2 border-dashed
            transition-all duration-200 cursor-pointer
            ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : isDisabled
                ? 'border-gray-200 bg-gray-50 cursor-pointer'
                : hasPaidCredits
                  ? 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-400 hover:bg-emerald-50/50'
                  : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }
            ${isProcessing ? 'pointer-events-none' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple={hasPaidCredits}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />

          {isProcessing ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 animate-spin" />
              <p className="text-gray-600 font-medium text-sm sm:text-base">Removing watermark...</p>
            </div>
          ) : isDisabled ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4 text-gray-400 px-4">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12" />
              <p className="font-medium text-sm sm:text-base">All credits used</p>
              <p className="text-xs sm:text-sm text-center">
                Out of credits.{' '}
                <button
                  onClick={e => { e.stopPropagation(); openPaywall() }}
                  className="text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Get more to continue
                </button>
                .
              </p>
            </div>
          ) : hasPaidCredits ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
              <div className="p-3 sm:p-4 rounded-full bg-emerald-100">
                {isDragging ? (
                  <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                ) : (
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                )}
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  {isDragging ? 'Drop your images here' : 'Drag & drop — single or multiple'}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  or tap to browse
                  <span className="hidden sm:inline text-gray-400"> • Ctrl+V to paste</span>
                </p>
              </div>
              <p className="text-xs text-gray-400">JPG, PNG, WebP • Max 50MB each</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
              <div className="p-3 sm:p-4 rounded-full bg-gray-100">
                {isDragging ? (
                  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                ) : (
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                )}
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-medium text-sm sm:text-base">
                  {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  or tap to browse
                  <span className="hidden sm:inline text-gray-400"> • Ctrl+V to paste</span>
                </p>
              </div>
              <p className="text-xs text-gray-400">JPG, PNG, WebP • Max 50MB</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs sm:text-sm">
          {hasPaidCredits ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                <Gem className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">{paidCredits} premium credit{paidCredits !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <div className={`w-2 h-2 rounded-full ${remainingToday > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{remainingToday} credits to use now</span>
            </div>
          )}
          {!hasPaidCredits && remainingToday > 0 && (
            <div className="flex items-center gap-1 text-gray-400">
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Freemium, no signup</span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ProcessedImageModal
          image={processedImage}
          isProcessing={isProcessing}
          originalSrc={originalSrc ?? undefined}
          onClose={handleModalClose}
        />
      )}

      {showBatch && (
        <BatchProcessModal
          items={batchItems}
          onClose={handleBatchClose}
        />
      )}

    </>
  )
}
