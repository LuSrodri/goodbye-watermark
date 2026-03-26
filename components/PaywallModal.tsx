'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Layers, Infinity, Zap, Check } from 'lucide-react'
import { useSession } from './SessionProvider'

interface Props {
  onClose: () => void
}

const PACKAGES = [
  {
    id: '10credits',
    credits: 10,
    price: '$3',
    priceNote: '$0.30 / image',
    label: 'Starter',
    best: false,
  },
  {
    id: '50credits',
    credits: 50,
    price: '$10',
    priceNote: '$0.20 / image',
    label: 'Best Value',
    best: true,
  },
]

const BENEFITS = [
  {
    icon: Layers,
    title: 'Batch Processing',
    desc: 'Select and clean multiple images at once.',
  },
  {
    icon: Infinity,
    title: 'No Daily Waiting',
    desc: 'Use your credits whenever you need, no reset timer.',
  },
  {
    icon: Zap,
    title: 'Best Price Around',
    desc: 'Cheaper per image than any comparable service.',
  },
]

const PACKAGE_CREDITS: Record<string, number> = {
  '10credits': 10,
  '50credits': 50,
}

export default function PaywallModal({ onClose }: Props) {
  const { savePendingPayment } = useSession()
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('50credits')
  const [isLoading, setIsLoading] = useState(false)

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
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose])

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selectedPackage }),
      })
      const data = await res.json()
      if (data.url && data.sessionId) {
        // Persist session ID before leaving — credits survive if browser closes mid-checkout
        await savePendingPayment(data.sessionId, PACKAGE_CREDITS[selectedPackage] ?? 0)
        window.location.href = data.url
        return
      }
      throw new Error(data.error || 'No checkout URL returned')
    } catch (err) {
      console.error('Checkout error:', err)
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible && !isClosing ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent backdrop-blur-none'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
          isVisible && !isClosing
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="px-6 pt-8 pb-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading leading-tight">
              Remove more watermarks
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Your free credits are used up. Pick a pack to keep going.
            </p>
          </div>

          {/* Benefits */}
          <ul className="space-y-3 mb-7">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-800">{title}</span>
                  <span className="text-sm text-gray-500"> — {desc}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Package Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {PACKAGES.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedPackage === pkg.id
                    ? 'border-gray-900 bg-gray-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {pkg.best && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white whitespace-nowrap">
                    Best Value
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900 font-heading">{pkg.price}</span>
                <span className="text-sm font-semibold text-gray-700 mt-0.5">{pkg.credits} credits</span>
                <span className="text-xs text-gray-400 mt-1">{pkg.priceNote}</span>

                {selectedPackage === pkg.id && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? 'Redirecting to checkout…' : 'Continue to payment →'}
          </button>

          {/* No thanks */}
          <button
            onClick={handleClose}
            className="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            No, thanks
          </button>
        </div>
      </div>
    </div>
  )
}
