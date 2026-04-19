'use client'

import Script from 'next/script'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'

type TurnstileRenderOptions = {
  sitekey: string
  execution?: 'render' | 'execute'
  appearance?: 'always' | 'execute' | 'interaction-only'
  callback?: (token: string) => void
  'error-callback'?: (errorCode: string) => void
  'expired-callback'?: () => void
  'timeout-callback'?: () => void
}

type TurnstileAPI = {
  ready: (cb: () => void) => void
  render: (selector: string | HTMLElement, options: TurnstileRenderOptions) => string
  execute: (widget: string) => void
  reset: (widget: string) => void
  remove: (widget: string) => void
  getResponse: (widget: string) => string | undefined
}

declare global {
  interface Window {
    turnstile?: TurnstileAPI
    onTurnstileLoad?: () => void
  }
}

interface TurnstileContextType {
  getToken: () => Promise<string>
}

const TurnstileContext = createContext<TurnstileContextType | null>(null)

export function useTurnstile() {
  const ctx = useContext(TurnstileContext)
  if (!ctx) {
    throw new Error('useTurnstile must be used within TurnstileProvider')
  }
  return ctx
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function TurnstileProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const pendingRef = useRef<{
    resolve: (token: string) => void
    reject: (error: Error) => void
  } | null>(null)

  const renderWidget = useCallback(() => {
    if (!SITE_KEY) return
    if (typeof window === 'undefined' || !window.turnstile) return
    if (!containerRef.current || widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      execution: 'execute',
      appearance: 'interaction-only',
      callback: (token: string) => {
        const pending = pendingRef.current
        pendingRef.current = null
        pending?.resolve(token)
      },
      'error-callback': (errorCode: string) => {
        const pending = pendingRef.current
        pendingRef.current = null
        pending?.reject(new Error(`Turnstile error: ${errorCode}`))
      },
      'expired-callback': () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
      },
    })
  }, [])

  useEffect(() => {
    if (!SITE_KEY) return
    window.onTurnstileLoad = renderWidget
    if (window.turnstile) renderWidget()
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
      delete window.onTurnstileLoad
    }
  }, [renderWidget])

  const getToken = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      if (!SITE_KEY) {
        resolve('')
        return
      }
      if (typeof window === 'undefined' || !window.turnstile || !widgetIdRef.current) {
        reject(new Error('Turnstile is not ready yet'))
        return
      }
      if (pendingRef.current) {
        pendingRef.current.reject(new Error('Superseded by a new Turnstile request'))
      }
      pendingRef.current = { resolve, reject }
      window.turnstile.reset(widgetIdRef.current)
      window.turnstile.execute(widgetIdRef.current)
    })
  }, [])

  if (!SITE_KEY) {
    return (
      <TurnstileContext.Provider value={{ getToken: async () => '' }}>
        {children}
      </TurnstileContext.Provider>
    )
  }

  return (
    <TurnstileContext.Provider value={{ getToken }}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad"
        strategy="afterInteractive"
      />
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          zIndex: 9999,
          pointerEvents: 'auto',
        }}
        aria-hidden="true"
      />
      {children}
    </TurnstileContext.Provider>
  )
}
