import { useEffect, useRef } from 'react'
import type { LoveChapter } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type MessageCardProps = {
  chapter: LoveChapter
  isLast: boolean
  onNext: () => void
}

export function MessageCard({ chapter, isLast, onNext }: MessageCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const frameRef = useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current
    if (!card || prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    frameRef.current = window.requestAnimationFrame(() => {
      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    })
  }

  const handleMouseLeave = () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
    }
  }

  return (
    <article
      ref={cardRef}
      className="message-card"
      key={chapter.id}
      aria-labelledby={`chapter-${chapter.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="message-card__tape" aria-hidden="true" />
      <span className="message-card__corner-heart" aria-hidden="true">♥</span>
      <span className="message-card__corner-sparkle" aria-hidden="true">✦</span>

      <p className="message-card__eyebrow">{chapter.eyebrow}</p>
      <h2 id={`chapter-${chapter.id}`}>{chapter.title}</h2>

      <div className="message-card__divider" aria-hidden="true">
        <span className="message-card__divider-line" />
        <span className="message-card__divider-icon">♥</span>
        <span className="message-card__divider-line" />
      </div>

      <p className="message-card__text">{chapter.text}</p>

      {chapter.emphasis && (
        <blockquote className="message-card__emphasis">
          <span className="message-card__quote-mark" aria-hidden="true">“</span>
          <span>{chapter.emphasis}</span>
          <span className="message-card__quote-mark" aria-hidden="true">”</span>
        </blockquote>
      )}

      <button className="next-button" type="button" onClick={onNext}>
        <span>{isLast ? 'Mở lời nhắn cuối' : 'Đọc tiếp'}</span>
        <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}
