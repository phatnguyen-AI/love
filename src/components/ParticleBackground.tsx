import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export type ThemeType = 'starlight' | 'sakura'

interface ParticleBackgroundProps {
  theme: ThemeType
  interactive?: boolean
}

interface Star {
  x: number
  y: number
  radius: number
  alpha: number
  deltaAlpha: number
  color: string
}

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  alpha: number
  active: boolean
}

interface FallingElement {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  swaySpeed: number
  swayAmplitude: number
  swayOffset: number
  rotation: number
  rotationSpeed: number
  flipRotation: number
  flipSpeed: number
  alpha: number
  type: 'sakura' | 'rose-petal' | 'rose-bloom' | 'heart'
  color: string
}

interface TrailParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
  decay: number
  shape: 'star' | 'circle' | 'heart' | 'petal' | 'rose'
}

const SAKURA_COLORS = [
  '#ffb7c5',
  '#ffd1dc',
  '#ffe1eb',
  '#ffa0b4',
  '#fff0f5',
]

const ROSE_COLORS = [
  '#e8175d',
  '#ff2a6d',
  '#d81b60',
  '#ff477e',
  '#c2185b',
  '#ff5e7e',
]

const HEART_COLORS = [
  '#ff4081',
  '#ff758c',
  '#ff80ab',
  '#ff9a9e',
  '#f53b57',
]

type ParticleCanvasProps = ParticleBackgroundProps & {
  layerState?: 'steady' | 'entering' | 'leaving'
}

function ParticleCanvas({ theme, interactive = true, layerState = 'steady' }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
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
      initScene()
    }
    window.addEventListener('resize', handleResize)

    // Starlight Star Colors
    const STAR_COLORS = ['#ffffff', '#ffe9f0', '#ffd1dc', '#c5d3ff', '#fcd5ce', '#ffd700']

    let stars: Star[] = []
    let fallingElements: FallingElement[] = []
    const shootingStars: ShootingStar[] = []
    let nextShootingStarTime = Date.now() + Math.random() * 4000 + 2000
    const trailParticles: TrailParticle[] = []
    let lastTrailAt = 0

    const initScene = () => {
      if (theme === 'starlight') {
        const starCount = Math.min(Math.floor((width * height) / 9000), 120)
        stars = []
        for (let i = 0; i < starCount; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.7 + 0.3,
            deltaAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          })
        }
      } else {
        // Sakura & Rose Romance Theme: Cánh hoa anh đào + Cánh hoa hồng + Hoa hồng nở + Trái tim hồng
        const totalCount = Math.min(Math.floor((width * height) / 14000), 65)
        fallingElements = []
        for (let i = 0; i < totalCount; i++) {
          const rand = Math.random()
          let type: FallingElement['type'] = 'sakura'
          let color = SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)]
          let size = Math.random() * 8 + 10

          if (rand < 0.36) {
            type = 'sakura'
            color = SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)]
            size = Math.random() * 7 + 10
          } else if (rand < 0.65) {
            type = 'rose-petal'
            color = ROSE_COLORS[Math.floor(Math.random() * ROSE_COLORS.length)]
            size = Math.random() * 9 + 12
          } else if (rand < 0.84) {
            type = 'heart'
            color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]
            size = Math.random() * 8 + 11
          } else {
            type = 'rose-bloom'
            color = ROSE_COLORS[Math.floor(Math.random() * ROSE_COLORS.length)]
            size = Math.random() * 8 + 14
          }

          fallingElements.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size,
            speedY: type === 'heart' ? Math.random() * 0.8 + 0.5 : Math.random() * 1.1 + 0.7,
            speedX: Math.random() * 0.7 + 0.3,
            swaySpeed: Math.random() * 0.025 + 0.015,
            swayAmplitude: Math.random() * 1.8 + 1.1,
            swayOffset: Math.random() * Math.PI * 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
            flipRotation: Math.random() * Math.PI * 2,
            flipSpeed: Math.random() * 0.03 + 0.012,
            alpha: Math.random() * 0.35 + 0.65,
            type,
            color,
          })
        }
      }
    }

    handleResize()

    // Interactive pointer trail & petal / heart disturbance
    const addTrail = (x: number, y: number) => {
      if (prefersReducedMotion || !interactive) return
      const now = performance.now()
      if (now - lastTrailAt < 28) return
      lastTrailAt = now

      if (trailParticles.length > 150) {
        trailParticles.splice(0, trailParticles.length - 150)
      }

      if (theme === 'sakura') {
        // Swirl nearby petals, hearts, roses
        for (const el of fallingElements) {
          const dx = el.x - x
          const dy = el.y - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            const force = (130 - dist) / 130
            el.x += (dx / (dist || 1)) * force * 16
            el.y += (dy / (dist || 1)) * force * 14
            el.rotationSpeed += 0.06 * (Math.random() > 0.5 ? 1 : -1)
          }
        }
      }

      // Add gentle sparkle / rose / heart / petal trail
      const count = theme === 'sakura' ? 3 : 3
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 1.8 + 0.6
        const shapes: ('star' | 'circle' | 'heart' | 'petal' | 'rose')[] =
          theme === 'sakura' ? ['heart', 'rose', 'petal', 'circle'] : ['star', 'circle', 'heart']

        const selectedShape = shapes[Math.floor(Math.random() * shapes.length)]
        let particleColor = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
        if (theme === 'sakura') {
          if (selectedShape === 'rose') {
            particleColor = ROSE_COLORS[Math.floor(Math.random() * ROSE_COLORS.length)]
          } else if (selectedShape === 'heart') {
            particleColor = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]
          } else {
            particleColor = SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)]
          }
        }

        trailParticles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (theme === 'sakura' ? 0.3 : 0.5),
          radius: selectedShape === 'rose' || selectedShape === 'heart' ? Math.random() * 4 + 4 : Math.random() * 3 + 2,
          alpha: 1,
          color: particleColor,
          decay: Math.random() * 0.022 + 0.018,
          shape: selectedShape,
        })
      }
    }

    const handlePointerMove = (e: PointerEvent) => addTrail(e.clientX, e.clientY)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    const handleVisibilityChange = () => {
      paused = document.hidden
      if (!paused) {
        window.cancelAnimationFrame(animationFrameId)
        render()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Helper: Draw realistic Sakura Petal
    const drawSakuraPetal = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      flipRotation: number,
      color: string,
      alpha: number,
    ) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.scale(Math.cos(flipRotation), 1)

      ctx.beginPath()
      const w = size * 0.65
      const h = size

      ctx.moveTo(0, h * 0.5)
      ctx.bezierCurveTo(-w * 0.8, h * 0.2, -w, -h * 0.3, -w * 0.3, -h * 0.5)
      ctx.lineTo(0, -h * 0.42) // notch
      ctx.lineTo(w * 0.3, -h * 0.5)
      ctx.bezierCurveTo(w, -h * 0.3, w * 0.8, h * 0.2, 0, h * 0.5)

      const grad = ctx.createLinearGradient(0, h * 0.5, 0, -h * 0.5)
      grad.addColorStop(0, color)
      grad.addColorStop(0.7, 'rgba(255, 235, 240, 0.95)')
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.98)')
      ctx.fillStyle = grad
      ctx.fill()

      ctx.strokeStyle = 'rgba(255, 140, 165, 0.35)'
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.moveTo(0, h * 0.4)
      ctx.lineTo(0, -h * 0.2)
      ctx.stroke()

      ctx.restore()
    }

    // Helper: Draw lush Rose Petal
    const drawRosePetal = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      flipRotation: number,
      color: string,
      alpha: number,
    ) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.scale(Math.cos(flipRotation), 1)

      ctx.beginPath()
      const w = size * 0.85
      const h = size * 1.1

      ctx.moveTo(0, h * 0.5)
      // Plump rounded rose petal shape with elegant natural curves
      ctx.bezierCurveTo(-w * 0.9, h * 0.3, -w * 0.95, -h * 0.2, -w * 0.4, -h * 0.5)
      ctx.bezierCurveTo(-w * 0.1, -h * 0.55, w * 0.1, -h * 0.55, w * 0.4, -h * 0.5)
      ctx.bezierCurveTo(w * 0.95, -h * 0.2, w * 0.9, h * 0.3, 0, h * 0.5)

      const grad = ctx.createRadialGradient(0, 0, 1, 0, -h * 0.1, h * 0.7)
      grad.addColorStop(0, color)
      grad.addColorStop(0.65, '#ff4d79')
      grad.addColorStop(1, '#ffaec0')
      ctx.fillStyle = grad
      ctx.shadowBlur = 6
      ctx.shadowColor = 'rgba(225, 24, 76, 0.35)'
      ctx.fill()

      // Velvety sheen line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 0.9
      ctx.beginPath()
      ctx.arc(0, -h * 0.1, w * 0.45, Math.PI * 0.8, Math.PI * 1.4)
      ctx.stroke()

      ctx.restore()
    }

    // Helper: Draw delicate blooming Rose
    const drawRoseFlower = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number,
    ) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.rotate(rotation)

      const r = size * 0.5
      ctx.shadowBlur = 8
      ctx.shadowColor = 'rgba(232, 23, 93, 0.4)'

      // Outer petals
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2) / 5
        const px = Math.cos(a) * (r * 0.65)
        const py = Math.sin(a) * (r * 0.65)
        ctx.beginPath()
        ctx.arc(px, py, r * 0.55, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }

      // Middle petals
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI * 2) / 4 + 0.3
        const px = Math.cos(a) * (r * 0.35)
        const py = Math.sin(a) * (r * 0.35)
        ctx.beginPath()
        ctx.arc(px, py, r * 0.42, 0, Math.PI * 2)
        ctx.fillStyle = '#ff4d79'
        ctx.fill()
      }

      // Inner spiral bud
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2)
      ctx.fillStyle = '#b71540'
      ctx.fill()

      // Spiral swirl highlight
      ctx.strokeStyle = '#ffe4ec'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.18, 0, Math.PI * 1.5)
      ctx.stroke()

      ctx.restore()
    }

    // Helper: Draw Glowing Pink Heart
    const drawPinkHeart = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number,
    ) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.rotate(rotation)

      const d = size * 0.6
      ctx.shadowBlur = 10
      ctx.shadowColor = color

      ctx.beginPath()
      ctx.moveTo(0, d * 0.6)
      ctx.bezierCurveTo(0, 0, -d, 0, -d, -d * 0.6)
      ctx.bezierCurveTo(-d, -d * 1.2, 0, -d * 1.1, 0, -d * 0.35)
      ctx.bezierCurveTo(0, -d * 1.1, d, -d * 1.2, d, -d * 0.6)
      ctx.bezierCurveTo(d, 0, 0, 0, 0, d * 0.6)

      const grad = ctx.createRadialGradient(0, -d * 0.3, 0, 0, 0, d)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.35, color)
      grad.addColorStop(1, '#e8175d')
      ctx.fillStyle = grad
      ctx.fill()

      // Cute highlight dot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.beginPath()
      ctx.arc(-d * 0.35, -d * 0.65, size * 0.1, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    const drawStarShape = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      let rot = (Math.PI / 2) * 3
      let x = cx
      let y = cy
      const step = Math.PI / spikes

      ctx.moveTo(cx, cy - outerRadius)
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius
        y = cy + Math.sin(rot) * outerRadius
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius
        y = cy + Math.sin(rot) * innerRadius
        ctx.lineTo(x, y)
        rot += step
      }
      ctx.lineTo(cx, cy - outerRadius)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    // Main render loop
    const render = () => {
      if (paused) return
      ctx.clearRect(0, 0, width, height)

      if (theme === 'starlight') {
        // 1. Twinkle Stars
        for (const star of stars) {
          if (!prefersReducedMotion) {
            star.alpha += star.deltaAlpha
            if (star.alpha > 0.95 || star.alpha < 0.2) {
              star.deltaAlpha = -star.deltaAlpha
            }
          }

          ctx.save()
          ctx.globalAlpha = star.alpha
          ctx.fillStyle = star.color
          ctx.shadowBlur = 4
          ctx.shadowColor = star.color
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        // 2. Shooting Stars
        if (!prefersReducedMotion) {
          const now = Date.now()
          if (now > nextShootingStarTime && shootingStars.length < 2) {
            shootingStars.push({
              x: Math.random() * width * 0.8,
              y: Math.random() * (height * 0.4),
              length: Math.random() * 80 + 50,
              speed: Math.random() * 10 + 8,
              angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
              alpha: 1,
              active: true,
            })
            nextShootingStarTime = now + Math.random() * 6000 + 4000
          }

          for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i]
            if (!s.active) continue

            const tailX = s.x - Math.cos(s.angle) * s.length
            const tailY = s.y - Math.sin(s.angle) * s.length

            const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
            grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`)
            grad.addColorStop(0.3, `rgba(255, 215, 230, ${s.alpha * 0.8})`)
            grad.addColorStop(1, 'rgba(255, 215, 230, 0)')

            ctx.save()
            ctx.strokeStyle = grad
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(s.x, s.y)
            ctx.lineTo(tailX, tailY)
            ctx.stroke()
            ctx.restore()

            s.x += Math.cos(s.angle) * s.speed
            s.y += Math.sin(s.angle) * s.speed
            s.alpha -= 0.015

            if (s.alpha <= 0 || s.x > width || s.y > height) {
              shootingStars.splice(i, 1)
            }
          }
        }
      } else {
        // Sakura & Rose Romance: Falling Sakura Petals, Rose Petals, Rose Blooms & Pink Hearts
        for (const el of fallingElements) {
          if (!prefersReducedMotion) {
            el.swayOffset += el.swaySpeed
            el.x += Math.sin(el.swayOffset) * el.swayAmplitude + el.speedX
            el.y += el.speedY
            el.rotation += el.rotationSpeed
            el.flipRotation += el.flipSpeed

            // Reset when falling offscreen
            if (el.y > height + 30 || el.x > width + 30) {
              el.y = -25
              el.x = Math.random() * width - 40
            }
          }

          if (el.type === 'rose-petal') {
            drawRosePetal(ctx, el.x, el.y, el.size, el.rotation, el.flipRotation, el.color, el.alpha)
          } else if (el.type === 'heart') {
            drawPinkHeart(ctx, el.x, el.y, el.size, el.rotation, el.color, el.alpha)
          } else if (el.type === 'rose-bloom') {
            drawRoseFlower(ctx, el.x, el.y, el.size, el.rotation, el.color, el.alpha)
          } else {
            drawSakuraPetal(ctx, el.x, el.y, el.size, el.rotation, el.flipRotation, el.color, el.alpha)
          }
        }
      }

      // Interactive Trail Particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay

        if (p.alpha <= 0) {
          trailParticles.splice(i, 1)
          continue
        }

        if (p.shape === 'rose') {
          drawRoseFlower(ctx, p.x, p.y, p.radius * 2.4, 0.3, p.color, p.alpha)
        } else if (p.shape === 'heart') {
          drawPinkHeart(ctx, p.x, p.y, p.radius * 2.2, 0.1, p.color, p.alpha)
        } else if (p.shape === 'petal') {
          drawRosePetal(ctx, p.x, p.y, p.radius * 2.2, 0.4, 0, p.color, p.alpha)
        } else if (p.shape === 'star') {
          drawStarShape(ctx, p.x, p.y, 4, p.radius * 1.6, p.radius * 0.7, p.color, p.alpha)
        } else {
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.shadowBlur = 8
          ctx.shadowColor = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [theme, prefersReducedMotion, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`particle-background-canvas particle-background-canvas--${layerState}`}
      aria-hidden="true"
    />
  )
}

type ParticleLayer = {
  id: number
  theme: ThemeType
  state: 'steady' | 'entering' | 'leaving'
}

export function ParticleBackground({ theme, interactive = true }: ParticleBackgroundProps) {
  const nextLayerId = useRef(1)
  const previousTheme = useRef(theme)
  const [layers, setLayers] = useState<ParticleLayer[]>([
    { id: 0, theme, state: 'steady' },
  ])

  useEffect(() => {
    if (previousTheme.current === theme) return
    previousTheme.current = theme
    const incomingId = nextLayerId.current++

    setLayers((current) => [
      ...current.map((layer) => ({ ...layer, state: 'leaving' as const })),
      { id: incomingId, theme, state: 'entering' },
    ])

    const timer = window.setTimeout(() => {
      setLayers([{ id: incomingId, theme, state: 'steady' }])
    }, 760)

    return () => window.clearTimeout(timer)
  }, [theme])

  return (
    <div className="particle-background-stack" aria-hidden="true">
      {layers.map((layer, index) => (
        <ParticleCanvas
          key={layer.id}
          theme={layer.theme}
          layerState={layer.state}
          interactive={interactive && index === layers.length - 1}
        />
      ))}
    </div>
  )
}
