import { useEffect, useRef, useState } from 'react'
import { AmbientEffects } from './components/AmbientEffects'
import { EnvelopeIntro } from './components/EnvelopeIntro'
import { HeartProgress } from './components/HeartProgress'
import { MessageCard } from './components/MessageCard'
import { MusicControl, type MusicStatus } from './components/MusicControl'
import { loveContent, type LovePageContent } from './content'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import './styles.css'

type PagePhase = 'sealed' | 'opening' | 'reading' | 'completed'

type LoveLetterPageProps = {
  content?: LovePageContent
}

export function LoveLetterPage({ content = loveContent }: LoveLetterPageProps) {
  const [phase, setPhase] = useState<PagePhase>('sealed')
  const [chapterIndex, setChapterIndex] = useState(0)
  const [musicStatus, setMusicStatus] = useState<MusicStatus>('idle')
  const audioRef = useRef<HTMLAudioElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isPastIntro = phase === 'reading' || phase === 'completed'

  useEffect(() => {
    if (phase !== 'opening') return
    const timer = window.setTimeout(
      () => setPhase('reading'),
      prefersReducedMotion ? 30 : 1050,
    )
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

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

  async function playMusic() {
    if (!content.musicUrl || !audioRef.current) {
      setMusicStatus('unavailable')
      return
    }

    try {
      audioRef.current.volume = 0.32
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
    if (chapterIndex < content.chapters.length - 1) {
      setChapterIndex((current) => current + 1)
      return
    }
    setPhase('completed')
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

  return (
    <main className={`love-page love-page--${phase}`}>
      <a className="skip-link" href="#love-content">Đi đến nội dung lá thư</a>
      <AmbientEffects celebrate={phase === 'completed'} />

      {content.musicUrl && (
        <audio
          ref={audioRef}
          src={content.musicUrl}
          loop
          preload="none"
          onError={() => setMusicStatus('unavailable')}
        />
      )}

      {phase !== 'sealed' && (
        <MusicControl status={musicStatus} label={content.musicLabel} onToggle={toggleMusic} />
      )}

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
          <section className="letter-scene" aria-live="polite">
            <header className="letter-scene__header">
              <p>Gửi {content.recipientName}</p>
              <HeartProgress
                total={content.chapters.length}
                current={chapterIndex}
                completed={phase === 'completed'}
              />
            </header>

            {phase === 'reading' ? (
              <MessageCard
                chapter={content.chapters[chapterIndex]}
                isLast={chapterIndex === content.chapters.length - 1}
                onNext={readNext}
              />
            ) : (
              <article className="final-card" aria-labelledby="final-message">
                <div className="final-card__halo" aria-hidden="true"><span>♥</span></div>
                <p className="final-card__eyebrow">Điều anh muốn nói nhất</p>
                <h2 id="final-message">{content.finalMessage}</h2>
                <span className="final-card__flourish" aria-hidden="true">♡</span>
                <p>{content.finalNote}</p>
                <p className="final-card__signature">{content.signature}</p>
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
