import { WaxSeal } from './WaxSeal'

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
      <div className="intro-scene__badge" aria-hidden="true">
        <span>✦</span> Một điều nhỏ dành riêng cho em <span>✦</span>
      </div>
      <h1 id="intro-title" className="intro-scene__title">{recipientName}</h1>
      <p className="intro-copy">{intro}</p>

      <div className={`envelope-container ${opening ? 'envelope-container--opening' : ''}`}>
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
              <span className="envelope__letter-glow" />
            </span>
            <span className="envelope__back" />
            <span className="envelope__flap" />
            <span className="envelope__pocket envelope__pocket--left" />
            <span className="envelope__pocket envelope__pocket--right" />
            <span className="envelope__pocket-trim" />
          </span>
        </button>

        {/* Interactive Wax Seal overlay */}
        <div className="envelope__seal-anchor">
          <WaxSeal onBreak={onOpen} disabled={opening} />
        </div>
      </div>

      <p className="tap-hint" aria-hidden="true">
        <span>chạm vào con dấu hoặc phong bì để mở</span>
        <span className="tap-hint__arrow">↓</span>
      </p>
    </section>
  )
}
