import { useCallback, useEffect, useRef, useState } from 'react'
import { AmbientEffects } from './components/AmbientEffects'
import { EnvelopeIntro } from './components/EnvelopeIntro'
import { HeartFireworks } from './components/HeartFireworks'
import { HeartHoldInteraction } from './components/HeartHoldInteraction'
import { HeartProgress } from './components/HeartProgress'
import { MessageCard } from './components/MessageCard'
import { MusicControl, type MusicStatus } from './components/MusicControl'
import { ParticleBackground, type ThemeType } from './components/ParticleBackground'
import { ReplyCard } from './components/ReplyCard'
import { ScratchCard } from './components/ScratchCard'
import { ThemeSelector } from './components/ThemeSelector'
import { loveContent, type LovePageContent } from './content'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import './styles.css'

export type PagePhase = 'sealed' | 'opening' | 'reading' | 'mini-game-scratch' | 'mini-game-hold' | 'completed' | 'replying'

type SceneMotion = 'idle' | 'leaving' | 'entering'
type SceneDirection = 'forward' | 'backward'

type LoveLetterPageProps = {
  content?: LovePageContent
  enableMiniGames?: boolean
}

export function LoveLetterPage({ content = loveContent, enableMiniGames = true }: LoveLetterPageProps) {
  const [phase, setPhase] = useState<PagePhase>('sealed')
  const [chapterIndex, setChapterIndex] = useState(0)
  const [theme, setTheme] = useState<ThemeType>('starlight')
  const [musicStatus, setMusicStatus] = useState<MusicStatus>('idle')
  const [sceneMotion, setSceneMotion] = useState<SceneMotion>('idle')
  const [sceneDirection, setSceneDirection] = useState<SceneDirection>('forward')
  const audioRef = useRef<HTMLAudioElement>(null)
  const replyButtonRef = useRef<HTMLButtonElement>(null)
  const returningFromReplyRef = useRef(false)
  const sceneMotionRef = useRef<SceneMotion>('idle')
  const transitionTimerRef = useRef<number | null>(null)
  const enterTimerRef = useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const isPastIntro =
    phase === 'reading' ||
    phase === 'mini-game-scratch' ||
    phase === 'mini-game-hold' ||
    phase === 'completed' ||
    phase === 'replying'

  const isCelebrating = phase === 'completed' || phase === 'replying'
  const replyEnabled = Boolean(content.reply?.formId.trim())
  const sceneKey = phase === 'reading' ? `chapter-${chapterIndex}` : phase

  const finishEntering = useCallback(() => {
    sceneMotionRef.current = 'idle'
    setSceneMotion('idle')
  }, [])

  const enterScene = useCallback((update: () => void) => {
    if (prefersReducedMotion) {
      update()
      finishEntering()
      return
    }

    sceneMotionRef.current = 'entering'
    setSceneMotion('entering')
    update()
    enterTimerRef.current = window.setTimeout(finishEntering, 560)
  }, [finishEntering, prefersReducedMotion])

  const transitionScene = useCallback((update: () => void, direction: SceneDirection = 'forward') => {
    if (sceneMotionRef.current !== 'idle') return
    setSceneDirection(direction)

    if (prefersReducedMotion) {
      update()
      return
    }

    sceneMotionRef.current = 'leaving'
    setSceneMotion('leaving')
    transitionTimerRef.current = window.setTimeout(() => enterScene(update), 260)
  }, [enterScene, prefersReducedMotion])

  useEffect(() => {
    if (phase !== 'opening') return
    const timer = window.setTimeout(
      () => enterScene(() => setPhase('reading')),
      prefersReducedMotion ? 30 : 1050,
    )
    return () => window.clearTimeout(timer)
  }, [enterScene, phase, prefersReducedMotion])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current)
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
        setMusicStatus('paused')
      }
    }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden)
  }, [])

  useEffect(() => {
    if (phase !== 'completed' || sceneMotion !== 'idle' || !returningFromReplyRef.current) return
    returningFromReplyRef.current = false
    replyButtonRef.current?.focus()
  }, [phase, sceneMotion])

  async function playMusic() {
    if (!content.musicUrl || !audioRef.current) {
      setMusicStatus('unavailable')
      return
    }

    try {
      audioRef.current.volume = 0.35
      await audioRef.current.play()
      setMusicStatus('playing')
    } catch {
      setMusicStatus('unavailable')
    }
  }

  function openLetter() {
    if (phase !== 'sealed') return
    setPhase('opening')
    void playMusic()
  }

  function readNext() {
    // Optional mini-interactions between chapters
    if (enableMiniGames && chapterIndex === 1 && phase === 'reading') {
      transitionScene(() => setPhase('mini-game-scratch'))
      return
    }

    if (enableMiniGames && chapterIndex === 2 && phase === 'reading') {
      transitionScene(() => setPhase('mini-game-hold'))
      return
    }

    if (chapterIndex < content.chapters.length - 1) {
      transitionScene(() => setChapterIndex((current) => current + 1))
      return
    }
    transitionScene(() => setPhase('completed'))
  }

  function handleScratchComplete() {
    transitionScene(() => {
      setChapterIndex(2)
      setPhase('reading')
    })
  }

  function handleHoldComplete() {
    transitionScene(() => {
      setChapterIndex(3)
      setPhase('reading')
    })
  }

  function toggleMusic() {
    const audio = audioRef.current
    if (!audio || musicStatus === 'unavailable') return

    if (musicStatus === 'playing') {
      audio.pause()
      setMusicStatus('paused')
      return
    }
    void playMusic()
  }

  function openReply() {
    if (!replyEnabled) return
    transitionScene(() => setPhase('replying'))
  }

  function closeReply() {
    returningFromReplyRef.current = true
    transitionScene(() => setPhase('completed'), 'backward')
  }

  return (
    <main className={`love-page love-page--${theme} love-page--${phase}`}>
      <a className="skip-link" href="#love-content">Đi đến nội dung lá thư</a>

      {/* Dynamic Starlight or Sakura Canvas Particle Background */}
      <ParticleBackground theme={theme} interactive={true} />

      {/* Ambient glowing orbs & floating hearts/petals */}
      <AmbientEffects celebrate={isCelebrating} theme={theme} />

      {/* Heart fireworks for the finale */}
      <HeartFireworks active={isCelebrating} />

      {content.musicUrl && (
        <audio
          ref={audioRef}
          src={content.musicUrl}
          loop
          preload="none"
          onError={() => setMusicStatus('unavailable')}
        />
      )}

      {/* Top action bar: Music & Theme Selector */}
      <div className="top-action-bar">
        {phase !== 'sealed' && (
          <MusicControl status={musicStatus} label={content.musicLabel} onToggle={toggleMusic} />
        )}
        <ThemeSelector currentTheme={theme} onSelectTheme={setTheme} />
      </div>

      <div className="page-frame" id="love-content">
        {!isPastIntro ? (
          <EnvelopeIntro
            recipientName={content.recipientName}
            senderName={content.senderName}
            intro={content.intro}
            opening={phase === 'opening'}
            onOpen={openLetter}
          />
        ) : (
          <section
            key={sceneKey}
            className={`letter-scene scene-stage scene-stage--${sceneMotion} scene-stage--${sceneDirection}`}
            aria-live="polite"
            aria-busy={sceneMotion !== 'idle'}
          >
            <header className="letter-scene__header">
              <p className="letter-scene__recipient-tag">
                <span>Gửi</span> <strong>{content.recipientName}</strong>
              </p>
              <HeartProgress
                total={content.chapters.length}
                current={chapterIndex}
                completed={isCelebrating}
              />
            </header>

            {phase === 'reading' ? (
              <MessageCard
                chapter={content.chapters[chapterIndex]}
                isLast={chapterIndex === content.chapters.length - 1}
                onNext={readNext}
              />
            ) : phase === 'mini-game-scratch' ? (
              <ScratchCard
                prompt="Vuốt ngón tay để xua tan sương mờ"
                secretText="Với anh, em đẹp nhất khi được sống đúng là mình, bình yên và không phải gồng lên vì bất kỳ ai."
                onComplete={handleScratchComplete}
              />
            ) : phase === 'mini-game-hold' ? (
              <HeartHoldInteraction
                prompt="Chạm và giữ trái tim"
                subprompt="để lắng nghe và kết nối từng nhịp đập chân thành…"
                onComplete={handleHoldComplete}
              />
            ) : phase === 'replying' && content.reply ? (
              <ReplyCard content={content.reply} onBack={closeReply} />
            ) : (
              <article className="final-card" aria-labelledby="final-message">
                <div className="final-card__halo" aria-hidden="true">
                  <span>♥</span>
                  <span className="final-card__halo-ring" />
                  <span className="final-card__halo-ring final-card__halo-ring--outer" />
                </div>
                <p className="final-card__eyebrow">Điều anh muốn nói nhất</p>
                <h2 id="final-message">{content.finalMessage}</h2>
                <div className="message-card__divider" aria-hidden="true">
                  <span className="message-card__divider-line" />
                  <span className="message-card__divider-icon">♥</span>
                  <span className="message-card__divider-line" />
                </div>
                <p className="final-card__note">{content.finalNote}</p>
                <p className="final-card__signature">{content.signature}</p>
                {replyEnabled && (
                  <button
                    ref={replyButtonRef}
                    className="final-card__reply-button"
                    type="button"
                    onClick={openReply}
                  >
                    <span>{content.reply?.ctaLabel}</span>
                    <span aria-hidden="true">♡</span>
                  </button>
                )}
                <p className="final-card__made-with">
                  được viết bằng tất cả sự chân thành <span aria-hidden="true">♡</span>
                </p>
              </article>
            )}
          </section>
        )}
      </div>

      {!isPastIntro && (
        <p className="footer-note">được viết bằng tất cả sự chân thành <span aria-hidden="true">♡</span></p>
      )}
    </main>
  )
}

export default LoveLetterPage
