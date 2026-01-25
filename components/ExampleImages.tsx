'use client'

import { useState, useCallback, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useSession } from './SessionProvider'
import { ProcessedImage, ProcessImageResponse } from '@/lib/types'
import ProcessedImageModal from './ProcessedImageModal'

const examples = [
  { id: 1, src: '/examples/hug-couple-beach.jpg', alt: 'Couple hugging on beach' },
  { id: 2, src: '/examples/bottomless-girl.jpg', alt: 'Girl portrait' },
  { id: 3, src: '/examples/football-match.jpg', alt: 'Football match' },
  { id: 4, src: '/examples/two-girls-showering.jpg', alt: 'Two girls' }
]

export default function ExampleImages() {
  const { sessionId, remainingToday, updateRemaining, addToHistory } = useSession()
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [validExamples, setValidExamples] = useState<typeof examples>([])

  useEffect(() => {
    const checkExamples = async () => {
      const valid = await Promise.all(
        examples.map(async (example) => {
          try {
            const response = await fetch(example.src, { method: 'HEAD' })
            return response.ok ? example : null
          } catch {
            return null
          }
        })
      )
      setValidExamples(valid.filter((e): e is typeof examples[0] => e !== null))
    }

    checkExamples()
  }, [])

  const handleExampleClick = useCallback(async (example: typeof examples[0]) => {
    if (remainingToday <= 0 || processingId !== null) return

    setProcessingId(example.id)

    try {
      const response = await fetch(example.src)
      const blob = await response.blob()
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })

      const processResponse = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          imageBase64: base64,
          originalUrl: example.src
        })
      })

      const result = await processResponse.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to process image')
      }

      const data = result.data as ProcessImageResponse
      updateRemaining(data.remainingToday)

      const newImage: ProcessedImage = {
        id: data.imageId,
        session_id: sessionId,
        original_url: example.src,
        processed_url: data.processedUrl,
        is_public: false,
        share_slug: null,
        created_at: new Date().toISOString()
      }

      addToHistory(newImage)
      setProcessedImage(newImage)
      setShowModal(true)
    } catch (error) {
      console.error('Failed to process example:', error)
    } finally {
      setProcessingId(null)
    }
  }, [sessionId, remainingToday, updateRemaining, addToHistory, processingId])

  if (validExamples.length === 0) {
    return null
  }

  return (
    <>
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-3">Try with examples:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {validExamples.map((example) => (
            <button
              key={example.id}
              onClick={() => handleExampleClick(example)}
              disabled={remainingToday <= 0 || processingId !== null}
              className={`
                relative aspect-square rounded-lg overflow-hidden
                border-2 border-transparent hover:border-gray-300
                transition-all duration-200
                ${remainingToday <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <img
                src={example.src}
                alt={example.alt}
                className="w-full h-full object-cover"
              />
              {processingId === example.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              )}
            </button>
          ))}
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
