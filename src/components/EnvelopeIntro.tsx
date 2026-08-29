type EnvelopeIntroProps = {
  recipientName: string
  senderName: string
  intro: string
  opening: boolean
  onOpen: () => void
}

export function EnvelopeIntro({ recipientName, senderName, intro, opening, onOpen }: EnvelopeIntroProps) {
  return (
    <section className="intro-scene" aria-labelledby="intro-title">
      <p className="eyebrow">Một điều nhỏ dành riêng cho</p>
      <h1 id="intro-title">{recipientName}</h1>
      <p className="intro-copy">{intro}</p>

      <button
        className={`envelope-button ${opening ? 'envelope-button--opening' : ''}`}
        type="button"
        onClick={onOpen}
        disabled={opening}
        aria-label={`Mở lá thư của ${senderName} gửi ${recipientName}`}
      >
        <span className="envelope" aria-hidden="true">
          <span className="envelope__letter">
            <span className="envelope__line envelope__line--short" />
            <span className="envelope__line" />
            <span className="envelope__tiny-heart">♥</span>
          </span>
          <span className="envelope__back" />
          <span className="envelope__flap" />
          <span className="envelope__pocket envelope__pocket--left" />
          <span className="envelope__pocket envelope__pocket--right" />
          <span className="envelope__seal">♥</span>
        </span>
      </button>

      <p className="tap-hint" aria-hidden="true">
        <span>chạm để mở thư</span>
        <span className="tap-hint__arrow">↓</span>
      </p>
    </section>
  )
}

