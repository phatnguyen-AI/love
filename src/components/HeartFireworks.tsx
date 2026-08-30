import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface FireworkParticle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  decay: number
  color: string
  size: number
  flicker: number
  gravity: number
  friction: number
  hasSparkle?: boolean
}

interface Rocket {
  x: number
  y: number
  targetY: number
  vx: number
  vy: number
  color: string
  trail: { x: number; y: number; alpha: number; size: number }[]
}

const FIREWORK_PALETTES = [
  ['#ff2a6d', '#ff758c', '#ffd700', '#ffffff'],
  ['#f6d365', '#fda085', '#ff9a9e', '#fff0f5'],
  ['#e056fd', '#ff7eb3', '#fecfef', '#ffffff'],
  ['#ff4757', '#ff6b81', '#ffa502', '#ffeaa7'],
  ['#a1c4fd', '#c2e9fb', '#ff758c', '#ffffff'],
  ['#ffd700', '#f9ca24', '#ff4d79', '#ffffff'],
]

export function HeartFireworks({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!active || prefersReducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = window.innerWidth
    let height = window.innerHeight
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    let paused = document.hidden

    const handleResize = () => {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    const rockets: Rocket[] = []
    const particles: FireworkParticle[] = []
    const MAX_PARTICLES = 500

    // Helper: Tạo vụ nổ hình trái tim nhiều tầng rực rỡ
    const createHeartExplosion = (cx: number, cy: number, palette?: string[]) => {
      const colors = palette || FIREWORK_PALETTES[Math.floor(Math.random() * FIREWORK_PALETTES.length)]
      const mainColor = colors[0]
      const numHeartParticles = 88

      // 1. Vòng biên trái tim chính
      for (let i = 0; i < numHeartParticles; i++) {
        if (particles.length >= MAX_PARTICLES) break
        const t = (Math.PI * 2 * i) / numHeartParticles
        // Phương trình tham số đường cong trái tim
        const heartX = 16 * Math.pow(Math.sin(t), 3)
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))

        const speedScale = Math.random() * 0.22 + 0.24
        const color = Math.random() > 0.35 ? mainColor : colors[Math.floor(Math.random() * colors.length)]

        particles.push({
          x: cx,
          y: cy,
          vx: heartX * speedScale + (Math.random() - 0.5) * 0.35,
          vy: heartY * speedScale + (Math.random() - 0.5) * 0.35,
          alpha: 1,
          decay: Math.random() * 0.009 + 0.007, // Kéo dài thời gian sáng
          color,
          size: Math.random() * 2.6 + 2.2,
          flicker: Math.random() * 0.25 + 0.8,
          gravity: 0.032,
          friction: 0.982,
          hasSparkle: Math.random() > 0.45,
        })
      }

      // 2. Vòng trái tim nhỏ bên trong (tạo chiều sâu 3D)
      for (let i = 0; i < 36; i++) {
        if (particles.length >= MAX_PARTICLES) break
        const t = (Math.PI * 2 * i) / 36
        const heartX = 16 * Math.pow(Math.sin(t), 3)
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))

        const innerSpeedScale = Math.random() * 0.12 + 0.12
        const color = colors[Math.floor(Math.random() * colors.length)]

        particles.push({
          x: cx,
          y: cy,
          vx: heartX * innerSpeedScale,
          vy: heartY * innerSpeedScale,
          alpha: 1,
          decay: Math.random() * 0.012 + 0.009,
          color,
          size: Math.random() * 2.2 + 1.8,
          flicker: 1,
          gravity: 0.025,
          friction: 0.985,
        })
      }

      // 3. Tâm vụ nổ tỏa tia sáng kim cương
      for (let i = 0; i < 28; i++) {
        if (particles.length >= MAX_PARTICLES) break
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 3.2 + 0.8
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.014,
          color: Math.random() > 0.5 ? '#ffffff' : '#ffd700',
          size: Math.random() * 2.5 + 1.5,
          flicker: 1,
          gravity: 0.035,
          friction: 0.965,
          hasSparkle: true,
        })
      }
    }

    // Bắn một tên lửa lên trời
    const launchRocket = (customStartX?: number, customTargetY?: number) => {
      if (rockets.length >= 6) return
      const startX = customStartX ?? Math.random() * (width * 0.8) + width * 0.1
      const targetY = customTargetY ?? Math.random() * (height * 0.42) + height * 0.12
      const palette = FIREWORK_PALETTES[Math.floor(Math.random() * FIREWORK_PALETTES.length)]
      const color = palette[0]
      const distanceY = height - targetY
      const speed = Math.sqrt(2 * 0.15 * distanceY) * (Math.random() * 0.15 + 0.92)

      rockets.push({
        x: startX,
        y: height,
        targetY,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -speed,
        color,
        trail: [],
      })
    }

    // Đợt bắn tự động: phóng liên tục với nhịp điệu tự nhiên
    let nextLaunchTimeout: number
    const scheduleNextLaunch = () => {
      if (paused) return
      const isMulti = Math.random() > 0.55
      const count = isMulti ? Math.floor(Math.random() * 2) + 2 : 1 // 1 đến 3 quả

      for (let i = 0; i < count; i++) {
        window.setTimeout(() => {
          if (!paused) launchRocket()
        }, i * 220)
      }

      // Giãn cách nhịp bắn ngẫu nhiên từ 800ms đến 1700ms
      const delay = Math.random() * 900 + 850
      nextLaunchTimeout = window.setTimeout(scheduleNextLaunch, delay)
    }

    // Bắn khởi động ngay lập tức 2 quả ở 2 phía
    launchRocket(width * 0.32, height * 0.24)
    window.setTimeout(() => launchRocket(width * 0.68, height * 0.28), 280)
    window.setTimeout(scheduleNextLaunch, 900)

    // Tương tác: Người dùng chạm / nhấp vào màn hình để nổ pháo hoa ngay lập tức
    const handlePointerDown = (e: PointerEvent) => {
      if (prefersReducedMotion) return
      const target = e.target as HTMLElement | null
      // Tránh cản trở khi đang gõ phím vào ô nhập liệu
      if (target?.closest('input, textarea')) return
      createHeartExplosion(e.clientX, e.clientY)
    }
    window.addEventListener('pointerdown', handlePointerDown)

    const handleVisibilityChange = () => {
      paused = document.hidden
      if (!paused) {
        window.cancelAnimationFrame(animationFrameId)
        scheduleNextLaunch()
        render()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Vòng lặp vẽ pháo hoa
    const render = () => {
      if (paused) return
      ctx.clearRect(0, 0, width, height)

      // Cập nhật & Vẽ tên lửa bay lên
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.trail.push({
          x: r.x,
          y: r.y,
          alpha: 1,
          size: Math.random() * 2.2 + 1.8,
        })
        r.x += r.vx
        r.y += r.vy
        r.vy += 0.08 // Trọng lực nhẹ khi bay lên

        // Vẽ vệt khói sáng của tên lửa
        for (let j = r.trail.length - 1; j >= 0; j--) {
          const pt = r.trail[j]
          pt.alpha -= 0.055
          if (pt.alpha <= 0) {
            r.trail.splice(j, 1)
            continue
          }
          ctx.save()
          ctx.globalAlpha = pt.alpha
          ctx.fillStyle = r.color
          ctx.shadowBlur = 6
          ctx.shadowColor = r.color
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        // Đầu phát sáng của tên lửa
        ctx.save()
        ctx.fillStyle = '#ffffff'
        ctx.shadowBlur = 12
        ctx.shadowColor = r.color
        ctx.beginPath()
        ctx.arc(r.x, r.y, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Đến độ cao mục tiêu hoặc bắt đầu rơi xuống -> Nổ thành hình trái tim
        if (r.y <= r.targetY || r.vy >= -0.5) {
          createHeartExplosion(r.x, r.y)
          rockets.splice(i, 1)
        }
      }

      // Cập nhật & Vẽ các hạt pháo hoa
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= p.friction
        p.vy *= p.friction
        p.alpha -= p.decay

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha * p.flicker)
        ctx.fillStyle = p.color
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Vẽ ánh sáng lấp lánh (sparkle starlet) cho các hạt đặc biệt
        if (p.hasSparkle && p.alpha > 0.4 && Math.random() > 0.6) {
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = '#ffffff'
          ctx.beginPath()
          ctx.arc(p.x + (Math.random() - 0.5) * 4, p.y + (Math.random() - 0.5) * 4, 1.2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.clearTimeout(nextLaunchTimeout)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [active, prefersReducedMotion])

  if (!active || prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="heart-fireworks-canvas"
      aria-hidden="true"
    />
  )
}
