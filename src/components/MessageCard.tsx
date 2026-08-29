import type { LoveChapter } from '../content'

type MessageCardProps = {
  chapter: LoveChapter
  isLast: boolean
  onNext: () => void
}

export function MessageCard({ chapter, isLast, onNext }: MessageCardProps) {
  return (
    <article className="message-card" key={chapter.id} aria-labelledby={`chapter-${chapter.id}`}>
      <span className="message-card__tape" aria-hidden="true" />
      <span className="message-card__corner-heart" aria-hidden="true">♥</span>
      <p className="message-card__eyebrow">{chapter.eyebrow}</p>
      <h2 id={`chapter-${chapter.id}`}>{chapter.title}</h2>
      <div className="message-card__divider" aria-hidden="true">
        <span />♥<span />
      </div>
      <p className="message-card__text">{chapter.text}</p>
      {chapter.emphasis && <p className="message-card__emphasis">“{chapter.emphasis}”</p>}
      <button className="next-button" type="button" onClick={onNext}>
        <span>{isLast ? 'Mở lời nhắn cuối' : 'Đọc tiếp'}</span>
        <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}

