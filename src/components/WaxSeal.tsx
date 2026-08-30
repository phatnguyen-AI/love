import { useState } from 'react'

interface WaxSealProps {
  onBreak: () => void
  disabled?: boolean
}

export function WaxSeal({ onBreak, disabled = false }: WaxSealProps) {
  const [broken, setBroken] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number }[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || broken) return
    setBroken(true)

    // Trigger haptic vibration if supported on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 60])
      } catch {
        // Ignore vibration error
      }
    }

    // Generate burst sparkles
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const newSparkles = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2
      const dist = Math.random() * 45 + 25
      return {
        id: i,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        size: Math.random() * 6 + 4,
      }
    })
    setSparkles(newSparkles)

    // Notify parent
    onBreak()
  }

  return (
    <div className={`wax-seal-wrapper ${broken ? 'wax-seal-wrapper--broken' : ''}`}>
      <button
        type="button"
        className="wax-seal-button"
        onClick={handleClick}
        disabled={disabled}
        aria-label="Chạm vào con dấu sáp để mở phong bì thư"
        title="Chạm vào con dấu sáp để mở thư"
      >
        <span className="wax-seal-texture" aria-hidden="true" />
        <span className="wax-seal-rim" aria-hidden="true" />
        <span className="wax-seal-icon" aria-hidden="true">♥</span>
        <span className="wax-seal-gold-leaf" aria-hidden="true" />
        <span className="wax-seal-glow" aria-hidden="true" />
      </button>

      {sparkles.map((s) => (
        <span
          key={s.id}
          className="wax-seal-burst-particle"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
