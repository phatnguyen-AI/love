import { useEffect, useRef, useState } from 'react'

interface ScratchCardProps {
  prompt?: string
  secretText: string
  onComplete: () => void
}

export function ScratchCard({
  prompt = 'Chạm và vuốt để gạt đi lớp sương mờ…',
  secretText,
  onComplete,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const isDrawingRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawMist = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

      const isSakura = Boolean(canvas.closest('.love-page--sakura'))
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      if (isSakura) {
        gradient.addColorStop(0, '#f4b9ca')
        gradient.addColorStop(0.5, '#d985a2')
        gradient.addColorStop(1, '#f8d9e2')
      } else {
        gradient.addColorStop(0, '#26143e')
        gradient.addColorStop(0.5, '#551d4b')
        gradient.addColorStop(1, '#170c2b')
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < 58; i++) {
        const sx = Math.random() * width
        const sy = Math.random() * height
        const sr = Math.random() * 1.8 + 0.5
        ctx.fillStyle = isSakura ? 'rgba(255, 250, 248, 0.62)' : 'rgba(255, 220, 240, 0.5)'
        ctx.shadowBlur = 7
        ctx.shadowColor = isSakura ? '#fff8f5' : '#f6d365'
        ctx.beginPath()
        ctx.arc(sx, sy, sr, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      ctx.font = '600 13px "Be Vietnam Pro", sans-serif'
      ctx.fillStyle = isSakura ? 'rgba(91, 35, 55, 0.9)' : 'rgba(255, 235, 242, 0.94)'
      ctx.textAlign = 'center'
      ctx.fillText('✦  ' + prompt + '  ✦', width / 2, height / 2)
    }

    drawMist()
    if (typeof ResizeObserver === 'undefined') return
    const resizeObserver = new ResizeObserver(() => {
      if (!isRevealed) drawMist()
    })
    resizeObserver.observe(canvas)
    return () => resizeObserver.disconnect()
  }, [isRevealed, prompt])

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas || isRevealed) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 32, 0, Math.PI * 2)
    ctx.fill()

    checkScratchedPercentage()
  }

  const checkScratchedPercentage = () => {
    const canvas = canvasRef.current
    if (!canvas || isRevealed) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      let transparentCount = 0
      const totalPixels = data.length / 4

      // Sample 1 in 16 pixels
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) transparentCount++
      }

      const ratio = transparentCount / (totalPixels / 4)
      if (ratio > 0.45) {
        handleFullReveal()
      }
    } catch {
      // Ignore
    }
  }

  const handleFullReveal = () => {
    if (isRevealed) return
    setIsRevealed(true)

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 20, 50])
      } catch {
        // Ignore
      }
    }
  }

  return (
    <div className={`scratch-card-container ${isRevealed ? 'scratch-card-container--revealed' : ''}`}>
      <div className="scratch-card__viewport">
        <div className="scratch-card__under-content">
          <div className="scratch-card__heart-icon" aria-hidden="true">♥</div>
          <p className="scratch-card__secret-text">“{secretText}”</p>
        </div>

        <canvas
          ref={canvasRef}
          className="scratch-card__canvas"
          onPointerDown={(event) => {
            if (typeof event.currentTarget.setPointerCapture === 'function') {
              event.currentTarget.setPointerCapture(event.pointerId)
            }
            isDrawingRef.current = true
            scratch(event.clientX, event.clientY)
          }}
          onPointerUp={() => (isDrawingRef.current = false)}
          onPointerCancel={() => (isDrawingRef.current = false)}
          onPointerMove={(event) => {
            if (isDrawingRef.current) scratch(event.clientX, event.clientY)
          }}
          aria-label={prompt}
        />
      </div>

      <div className="scratch-card__actions">
        {!isRevealed ? (
          <button
            type="button"
            className="scratch-card__reveal-btn"
            onClick={handleFullReveal}
          >
            <span>Mở ngay</span>
            <span aria-hidden="true">✨</span>
          </button>
        ) : (
          <button
            type="button"
            className="next-button scratch-card__continue-btn"
            onClick={onComplete}
          >
            <span>Đọc tiếp chương sau</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  )
}
