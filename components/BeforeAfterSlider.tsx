'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
  initialPosition?: number
  className?: string
  autoAnimate?: boolean
  animationDuration?: number
  animationDelay?: number
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'With watermark',
  afterLabel = 'Without watermark',
  initialPosition = 50,
  className = '',
  autoAnimate = false,
  animationDuration = 2800,
  animationDelay = 700,
}: BeforeAfterSliderProps) {
  // position = bar % from LEFT
  // clean (after) overlay visible to RIGHT of bar: clip-path inset(0 0 0 position%)
  // autoAnimate: starts at 100 (all watermarked) → 0 (all clean), bar sweeps right→left
  const [position, setPosition] = useState(autoAnimate ? 100 : initialPosition)
  const [isAnimating, setIsAnimating] = useState(autoAnimate)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!autoAnimate) return
    const timeoutId = setTimeout(() => {
      const animate = (ts: number) => {
        if (!startTimeRef.current) startTimeRef.current = ts
        const t = Math.min((ts - startTimeRef.current) / animationDuration, 1)
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        setPosition(100 - eased * 100)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setPosition(0)
          setIsAnimating(false)
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }, animationDelay)
    return () => {
      clearTimeout(timeoutId)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [autoAnimate, animationDuration, animationDelay])

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isAnimating) return
      isDragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [isAnimating]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none rounded-2xl ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Before (with watermark) — base layer */}
      <img
        src={beforeSrc}
        alt={beforeLabel}
        className="block w-full h-full object-cover"
        draggable={false}
      />

      {/* After (without watermark) — right side of bar */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        draggable={false}
      />

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_10px_rgba(0,0,0,0.45)] pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      />

      {/* Sweep glow during auto-animation */}
      {isAnimating && (
        <div
          className="absolute top-0 bottom-0 w-10 pointer-events-none"
          style={{
            left: `${position}%`,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)',
          }}
        />
      )}

      {/* Drag handle — pointer events live here so capture works on touch */}
      {!isAnimating && (
        <div
          className="absolute top-1/2 w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing z-10 border border-gray-100/80"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M6 4L3.5 9L6 14M12 4L14.5 9L12 14"
              stroke="#374151"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Labels + hint — shown after animation */}
      {!isAnimating && (
        <>
          <span className="absolute bottom-3 left-3 text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none">
            {beforeLabel}
          </span>
          <span className="absolute bottom-3 right-3 text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none">
            {afterLabel}
          </span>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none whitespace-nowrap">
            ← Drag to compare →
          </div>
        </>
      )}
    </div>
  )
}
