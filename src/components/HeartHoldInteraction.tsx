import { type CSSProperties, useEffect, useRef, useState } from 'react'

interface HeartHoldInteractionProps {
  prompt?: string
  subprompt?: string
  onComplete: () => void
}

export function HeartHoldInteraction({
  prompt = 'Chạm và giữ trái tim',
  subprompt = 'để kết nối từng nhịp đập chân thành…',
  onComplete,
}: HeartHoldInteractionProps) {
  const [progress, setProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [completed, setCompleted] = useState(false)
  const holdIntervalRef = useRef<number | null>(null)
  const decayIntervalRef = useRef<number | null>(null)
  const completedRef = useRef(false)

  const startHold = () => {
    if (completedRef.current || holdIntervalRef.current) return
    setIsHolding(true)

    if (decayIntervalRef.current) {
      clearInterval(decayIntervalRef.current)
      decayIntervalRef.current = null
    }

    holdIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4.2
        if (next >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
          holdIntervalRef.current = null
          completedRef.current = true
          setCompleted(true)
          setIsHolding(false)
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate([60, 40, 80])
            } catch {
              // Ignore
            }
          }
          return 100
        }
        return next
      })
    }, 30)
  }

  const endHold = () => {
    if (completedRef.current) return
    setIsHolding(false)
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
    // Gradual decay if released early
    if (decayIntervalRef.current) return
    decayIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          if (decayIntervalRef.current) clearInterval(decayIntervalRef.current)
          decayIntervalRef.current = null
          return 0
        }
        return Math.max(0, prev - 5)
      })
    }, 24)
  }

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
      if (decayIntervalRef.current) clearInterval(decayIntervalRef.current)
    }
  }, [])

  return (
    <div className={`heart-hold-scene ${completed ? 'heart-hold-scene--completed' : ''}`}>
      <p className="heart-hold__eyebrow">Một khoảnh khắc dành cho em</p>
      <h3 className="heart-hold__title">{prompt}</h3>
      <p className="heart-hold__subprompt">{subprompt}</p>

      <div
        className="heart-hold__control-wrapper"
        role="progressbar"
        aria-label="Tiến độ kết nối nhịp đập"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        style={{ '--heart-progress': `${progress}%` } as CSSProperties}
      >
        <span className="heart-hold__aura heart-hold__aura--one" aria-hidden="true" />
        <span className="heart-hold__aura heart-hold__aura--two" aria-hidden="true" />
        <svg className="heart-hold__progress-ring" viewBox="0 0 160 160" aria-hidden="true">
          <circle
            className="heart-hold__progress-bg"
            cx="80"
            cy="80"
            r="68"
          />
          <circle
            className="heart-hold__progress-bar"
            cx="80"
            cy="80"
            r="68"
            style={{
              strokeDasharray: 2 * Math.PI * 68,
              strokeDashoffset: 2 * Math.PI * 68 * (1 - progress / 100),
            }}
          />
        </svg>

        <button
          type="button"
          className={`heart-hold__button ${isHolding ? 'heart-hold__button--holding' : ''} ${completed ? 'heart-hold__button--full' : ''}`}
          onPointerDown={(event) => {
            if (typeof event.currentTarget.setPointerCapture === 'function') {
              event.currentTarget.setPointerCapture(event.pointerId)
            }
            startHold()
          }}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          onKeyDown={(event) => {
            if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
              event.preventDefault()
              startHold()
            }
          }}
          onKeyUp={(event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault()
              endHold()
            }
          }}
          aria-label={completed ? 'Đã sạc đầy nhịp đập' : 'Chạm và giữ để sạc đầy trái tim'}
        >
          <span className="heart-hold__heart-icon" aria-hidden="true">♥</span>
          {isHolding && <span className="heart-hold__pulse-wave" aria-hidden="true" />}
        </button>
      </div>

      <p className="heart-hold__percent" aria-live="polite">
        {completed ? 'Từng nhịp đập đều dành cho em ✨' : `${Math.round(progress)}%`}
      </p>

      <div className="heart-hold__actions">
        {completed && (
          <button
            type="button"
            className="next-button heart-hold__next-btn"
            onClick={onComplete}
          >
            <span>Xem tiếp nhé</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  )
}
