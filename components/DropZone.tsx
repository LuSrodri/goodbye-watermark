'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react'
import { useSession } from './SessionProvider'
import { fileToBase64, isValidImageType, MAX_FILE_SIZE } from '@/lib/utils'
import { ProcessedImage, ProcessImageResponse } from '@/lib/types'
import ProcessedImageModal from './ProcessedImageModal'

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
  const { remainingToday, addToHistory } = useSession()
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = useCallback(async (file: File) => {
    if (!isValidImageType(file)) {
      setError('Please upload a JPG, PNG, or WebP image')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be less than 50MB')
      return
    }

    if (remainingToday <= 0) {
      setError('Daily limit reached. Come back tomorrow!')
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      const base64 = await fileToBase64(file)

      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to process image')
      }

      const data = result.data as ProcessImageResponse
      const blob = base64ToBlob(data.processedBase64)
      const newImage = await addToHistory(blob, file.name)

      setProcessedImage(newImage)
      setShowModal(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image')
    } finally {
      setIsProcessing(false)
    }
  }, [remainingToday, addToHistory])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      processImage(file)
    }
  }, [processImage])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
    e.target.value = ''
  }, [processImage])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Handle Ctrl+V paste
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

  const isDisabled = remainingToday <= 0

  return (
    <>
      <div className="w-full">
        <div
          onClick={!isProcessing && !isDisabled ? handleClick : undefined}
          onDrop={!isProcessing && !isDisabled ? handleDrop : undefined}
          onDragOver={!isProcessing && !isDisabled ? handleDragOver : undefined}
          onDragLeave={handleDragLeave}
          className={`
            relative flex flex-col items-center justify-center
            w-full h-48 sm:h-64 rounded-2xl border-2 border-dashed
            transition-all duration-200 cursor-pointer
            ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : isDisabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }
            ${isProcessing ? 'pointer-events-none' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing || isDisabled}
          />

          {isProcessing ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 animate-spin" />
              <p className="text-gray-600 font-medium text-sm sm:text-base">Removing watermark...</p>
            </div>
          ) : isDisabled ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4 text-gray-400 px-4">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12" />
              <p className="font-medium text-sm sm:text-base">Daily limit reached</p>
              <p className="text-xs sm:text-sm">Come back tomorrow for 5 more!</p>
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
              <p className="text-xs text-gray-400">
                JPG, PNG, WebP • Max 50MB
              </p>
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
          <div className="flex items-center gap-2 text-gray-500">
            <div className={`w-2 h-2 rounded-full ${remainingToday > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{remainingToday}/5 remaining</span>
          </div>
          {remainingToday > 0 && (
            <div className="flex items-center gap-1 text-gray-400">
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Free, no signup</span>
            </div>
          )}
        </div>
      </div>

      {showModal && processedImage && (
        <ProcessedImageModal
          image={processedImage}
          onClose={() => {
            setShowModal(false)
            setProcessedImage(null)
          }}
        />
      )}
    </>
  )
}
