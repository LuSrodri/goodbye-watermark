'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef, Suspense } from 'react'
import confetti from 'canvas-confetti'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProcessedImage } from '@/lib/types'
import {
  getAllImages,
  resetDailyCountIfNewDay,
  saveImage,
  incrementDailyCount,
  StoredImage,
  addPaidCredits as dbAddPaidCredits,
  consumePaidCredit as dbConsumePaidCredit,
  savePendingPayment as dbSavePendingPayment,
  deletePendingPayment as dbDeletePendingPayment,
  getAllPendingPayments,
} from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

const DAILY_LIMIT = 3

interface SessionContextType {
  remainingToday: number
  paidCredits: number
  history: ProcessedImage[]
  isLoading: boolean
  refreshSession: () => Promise<void>
  addToHistory: (blob: Blob, originalName: string, paid?: boolean) => Promise<ProcessedImage>
  updateRemaining: (count: number) => void
  addPaidCredits: (count: number) => Promise<void>
  consumePaidCredit: () => Promise<void>
  savePendingPayment: (sessionId: string, credits: number) => Promise<void>
  showPaywall: boolean
  openPaywall: () => void
  closePaywall: () => void
}

const SessionContext = createContext<SessionContextType | null>(null)

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}

function storedToProcessed(stored: StoredImage): ProcessedImage {
  return {
    id: stored.id,
    processed_url: URL.createObjectURL(stored.blob),
    original_url: stored.originalName,
    created_at: stored.createdAt,
  }
}

// Handles both: redirect-back flow (?payment_success) and pending recovery on mount
function PaymentHandler({ onCreditsAdded }: { onCreditsAdded: (count: number) => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const handledRef = useRef<Set<string>>(new Set())

  const verifyAndCredit = useCallback(async (sessionId: string): Promise<'credited' | 'open' | 'done'> => {
    const res = await fetch(`/api/verify-payment?session_id=${sessionId}`)
    const data = await res.json()

    if (data.success && data.credits > 0) {
      onCreditsAdded(data.credits)
      await dbDeletePendingPayment(sessionId)
      return 'credited'
    }

    if (data.alreadyClaimed) {
      await dbDeletePendingPayment(sessionId)
      return 'done'
    }

    // Session expired or not found — clean up
    if (data.paymentStatus === 'expired' || data.paymentStatus === 'not_found') {
      await dbDeletePendingPayment(sessionId)
      return 'done'
    }

    // Still open (user might be on checkout) — keep pending
    return 'open'
  }, [onCreditsAdded])

  // Handle redirect-back from Stripe success URL
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success')
    const sessionId = searchParams.get('session_id')
    if (!paymentSuccess || !sessionId || handledRef.current.has(sessionId)) return

    handledRef.current.add(sessionId)
    verifyAndCredit(sessionId).catch(console.error).finally(() => {
      const url = new URL(window.location.href)
      url.searchParams.delete('payment_success')
      url.searchParams.delete('session_id')
      router.replace(url.pathname + (url.search || ''))
    })
  }, [searchParams, router, verifyAndCredit])

  // Recover credits from any pending payments on mount (survives browser close)
  useEffect(() => {
    getAllPendingPayments().then(pending => {
      pending.forEach(payment => {
        if (handledRef.current.has(payment.sessionId)) return
        handledRef.current.add(payment.sessionId)
        verifyAndCredit(payment.sessionId).catch(console.error)
      })
    }).catch(console.error)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [remainingToday, setRemainingToday] = useState(DAILY_LIMIT)
  const [paidCredits, setPaidCredits] = useState(0)
  const [history, setHistory] = useState<ProcessedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPaywall, setShowPaywall] = useState(false)
  const objectUrlsRef = useRef<string[]>([])

  const revokeUrls = useCallback(() => {
    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    objectUrlsRef.current = []
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      revokeUrls()
      const [images, session] = await Promise.all([
        getAllImages(),
        resetDailyCountIfNewDay(),
      ])
      const processed = images.map(storedToProcessed)
      objectUrlsRef.current = processed.map(p => p.processed_url)
      setHistory(processed)
      setRemainingToday(DAILY_LIMIT - session.dailyCount)
      setPaidCredits(session.paidCredits ?? 0)
    } catch (error) {
      console.error('Failed to load session from IndexedDB:', error)
    } finally {
      setIsLoading(false)
    }
  }, [revokeUrls])

  useEffect(() => {
    refreshSession()
    return revokeUrls
  }, [refreshSession, revokeUrls])

  const addToHistory = useCallback(async (blob: Blob, originalName: string, paid = false): Promise<ProcessedImage> => {
    const id = uuidv4()
    await saveImage(id, blob, originalName)

    // Only burn daily credits when not using a paid credit
    if (!paid) {
      const session = await incrementDailyCount()
      setRemainingToday(DAILY_LIMIT - session.dailyCount)
    }

    const objectUrl = URL.createObjectURL(blob)
    objectUrlsRef.current.push(objectUrl)

    const image: ProcessedImage = {
      id,
      processed_url: objectUrl,
      original_url: originalName,
      created_at: new Date().toISOString(),
    }

    setHistory(prev => [image, ...prev])
    return image
  }, [])

  const addPaidCreditsHandler = useCallback(async (count: number) => {
    const session = await dbAddPaidCredits(count)
    setPaidCredits(session.paidCredits)
  }, [])

  const consumePaidCreditHandler = useCallback(async () => {
    const session = await dbConsumePaidCredit()
    setPaidCredits(session.paidCredits)
  }, [])

  const savePendingPaymentHandler = useCallback(async (sessionId: string, credits: number) => {
    await dbSavePendingPayment(sessionId, credits)
  }, [])

  const updateRemaining = useCallback((count: number) => {
    setRemainingToday(count)
  }, [])

  const openPaywall = useCallback(() => setShowPaywall(true), [])
  const closePaywall = useCallback(() => setShowPaywall(false), [])

  const handleCreditsAdded = useCallback(async (count: number) => {
    await addPaidCreditsHandler(count)
    // Celebrate payment confirmation with confetti
    const end = Date.now() + 3000
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [addPaidCreditsHandler])

  return (
    <SessionContext.Provider
      value={{
        remainingToday,
        paidCredits,
        history,
        isLoading,
        refreshSession,
        addToHistory,
        updateRemaining,
        addPaidCredits: addPaidCreditsHandler,
        consumePaidCredit: consumePaidCreditHandler,
        savePendingPayment: savePendingPaymentHandler,
        showPaywall,
        openPaywall,
        closePaywall,
      }}
    >
      <Suspense fallback={null}>
        <PaymentHandler onCreditsAdded={handleCreditsAdded} />
      </Suspense>
      {children}
    </SessionContext.Provider>
  )
}
