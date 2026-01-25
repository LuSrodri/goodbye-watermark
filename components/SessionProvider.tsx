'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { ProcessedImage, SessionInfo } from '@/lib/types'
import { getSessionId } from '@/lib/utils'

interface SessionContextType {
  sessionId: string
  remainingToday: number
  history: ProcessedImage[]
  isLoading: boolean
  refreshSession: () => Promise<void>
  addToHistory: (image: ProcessedImage) => void
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

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState('')
  const [remainingToday, setRemainingToday] = useState(5)
  const [history, setHistory] = useState<ProcessedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    const id = getSessionId()
    if (!id) return

    setSessionId(id)

    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id })
      })

      const result = await response.json()

      if (result.success && result.data) {
        const data = result.data as SessionInfo
        setRemainingToday(data.remainingToday)
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to initialize session:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const addToHistory = (image: ProcessedImage) => {
    setHistory(prev => [image, ...prev])
  }

  const updateRemaining = (count: number) => {
    setRemainingToday(count)
  }

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        remainingToday,
        history,
        isLoading,
        refreshSession,
        addToHistory,
        updateRemaining
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
