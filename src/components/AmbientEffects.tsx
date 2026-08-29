const floatingHearts = [
  { left: '7%', delay: '0s', duration: '10s', size: '12px' },
  { left: '18%', delay: '3s', duration: '13s', size: '9px' },
  { left: '34%', delay: '6s', duration: '11s', size: '14px' },
  { left: '58%', delay: '1s', duration: '14s', size: '10px' },
  { left: '73%', delay: '7s', duration: '12s', size: '13px' },
  { left: '89%', delay: '4s', duration: '15s', size: '8px' },
]

const sparkles = [
  { left: '12%', top: '18%', delay: '0s' },
  { left: '84%', top: '22%', delay: '1.4s' },
  { left: '21%', top: '72%', delay: '2.2s' },
  { left: '78%', top: '78%', delay: '.7s' },
]

export function AmbientEffects({ celebrate = false }: { celebrate?: boolean }) {
  return (
    <div className={`ambient-effects ${celebrate ? 'ambient-effects--celebrate' : ''}`} aria-hidden="true">
      <div className="soft-orb soft-orb--one" />
      <div className="soft-orb soft-orb--two" />
      {floatingHearts.map((heart, index) => (
        <span
          className="floating-heart"
          key={index}
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            fontSize: heart.size,
          }}
        >
          ♥
        </span>
      ))}
      {sparkles.map((sparkle, index) => (
        <span
          className="sparkle"
          key={index}
          style={{ left: sparkle.left, top: sparkle.top, animationDelay: sparkle.delay }}
        />
      ))}
    </div>
  )
}

