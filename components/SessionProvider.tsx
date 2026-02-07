'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { ProcessedImage } from '@/lib/types'
import { getAllImages, resetDailyCountIfNewDay, saveImage, incrementDailyCount, StoredImage } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

const DAILY_LIMIT = 5

interface SessionContextType {
  remainingToday: number
  history: ProcessedImage[]
  isLoading: boolean
  refreshSession: () => Promise<void>
  addToHistory: (blob: Blob, originalName: string) => Promise<ProcessedImage>
  updateRemaining: (count: number) => void
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

export function SessionProvider({ children }: { children: ReactNode }) {
  const [remainingToday, setRemainingToday] = useState(DAILY_LIMIT)
  const [history, setHistory] = useState<ProcessedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  const addToHistory = useCallback(async (blob: Blob, originalName: string): Promise<ProcessedImage> => {
    const id = uuidv4()
    await saveImage(id, blob, originalName)
    const session = await incrementDailyCount()

    const objectUrl = URL.createObjectURL(blob)
    objectUrlsRef.current.push(objectUrl)

    const image: ProcessedImage = {
      id,
      processed_url: objectUrl,
      original_url: originalName,
      created_at: new Date().toISOString(),
    }

    setHistory(prev => [image, ...prev])
    setRemainingToday(DAILY_LIMIT - session.dailyCount)

    return image
  }, [])

  const updateRemaining = useCallback((count: number) => {
    setRemainingToday(count)
  }, [])

  return (
    <SessionContext.Provider
      value={{
        remainingToday,
        history,
        isLoading,
        refreshSession,
        addToHistory,
        updateRemaining,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
