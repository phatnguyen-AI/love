import type { ThemeType } from './ParticleBackground'

type FloatingItem = {
  left: string
  delay: string
  duration: string
  size: string
  type: 'heart' | 'rose-petal' | 'rose-flower' | 'heart-outline'
  opacity?: number
}

const floatingElements: FloatingItem[] = [
  { left: '4%', delay: '0s', duration: '9.5s', size: '17px', type: 'heart', opacity: 0.75 },
  { left: '12%', delay: '3.2s', duration: '12.5s', size: '13px', type: 'rose-petal', opacity: 0.8 },
  { left: '22%', delay: '6.0s', duration: '11.0s', size: '19px', type: 'rose-flower', opacity: 0.7 },
  { left: '34%', delay: '1.5s', duration: '10.5s', size: '15px', type: 'heart-outline', opacity: 0.7 },
  { left: '46%', delay: '7.8s', duration: '13.0s', size: '18px', type: 'heart', opacity: 0.8 },
  { left: '58%', delay: '2.2s', duration: '11.5s', size: '14px', type: 'rose-petal', opacity: 0.85 },
  { left: '68%', delay: '5.4s', duration: '10.0s', size: '20px', type: 'rose-flower', opacity: 0.75 },
  { left: '78%', delay: '0.8s', duration: '12.0s', size: '16px', type: 'heart', opacity: 0.8 },
  { left: '88%', delay: '4.0s', duration: '14.0s', size: '13px', type: 'rose-petal', opacity: 0.75 },
  { left: '94%', delay: '8.5s', duration: '10.5s', size: '18px', type: 'heart-outline', opacity: 0.7 },
  { left: '18%', delay: '9.2s', duration: '13.5s', size: '16px', type: 'heart', opacity: 0.65 },
  { left: '52%', delay: '4.8s', duration: '12.2s', size: '15px', type: 'rose-flower', opacity: 0.7 },
  { left: '82%', delay: '6.7s', duration: '11.2s', size: '17px', type: 'heart', opacity: 0.75 },
]

const sparkles = [
  { left: '8%', top: '14%', delay: '0s', size: '5px' },
  { left: '88%', top: '18%', delay: '1.2s', size: '6px' },
  { left: '16%', top: '65%', delay: '2.0s', size: '4px' },
  { left: '82%', top: '72%', delay: '0.6s', size: '5px' },
  { left: '48%', top: '10%', delay: '1.8s', size: '7px' },
  { left: '30%', top: '85%', delay: '2.5s', size: '4px' },
  { left: '72%', top: '42%', delay: '1.4s', size: '6px' },
]

export function AmbientEffects({
  celebrate = false,
  theme = 'starlight',
}: {
  celebrate?: boolean
  theme?: ThemeType
}) {
  return (
    <div
      className={`ambient-effects ambient-effects--${theme} ${celebrate ? 'ambient-effects--celebrate' : ''}`}
      aria-hidden="true"
    >
      <div className="soft-orb soft-orb--one" />
      <div className="soft-orb soft-orb--two" />
      <div className="soft-orb soft-orb--three" />
      <div className="soft-orb soft-orb--four" />

      {floatingElements.map((el, index) => (
        <span
          className={`floating-heart floating-heart--${el.type}`}
          key={index}
          style={{
            left: el.left,
            animationDelay: el.delay,
            animationDuration: el.duration,
            fontSize: el.size,
            opacity: el.opacity ?? 0.75,
          }}
        >
          <span className="floating-heart__shape" />
        </span>
      ))}

      {sparkles.map((sparkle, index) => (
        <span
          className="sparkle"
          key={index}
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: sparkle.delay,
          }}
        />
      ))}
    </div>
  )
}

