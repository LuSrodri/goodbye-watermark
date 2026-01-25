'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Download, ArrowRight, Check, Copy } from 'lucide-react'
import { ProcessedImage } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface Props {
  image: ProcessedImage
}

export default function ShareClient({ image }: Props) {
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/goodbyewatermark.com-logo-favicon.png"
              alt="Goodbye Watermark"
              width={32}
              height={32}
            />
            <span className="font-semibold text-gray-900">Goodbye Watermark</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Try it free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
                <img
                  src={image.processed_url}
                  alt="Processed image"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-3 px-6 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Processed on {formatDate(image.created_at)} with Goodbye Watermark
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-sm text-gray-500">
          Remove watermarks from your images for free at{' '}
          <Link href="/" className="text-gray-900 font-medium hover:underline">
            goodbyewatermark.com
          </Link>
        </p>
      </footer>
    </div>
  )
}
