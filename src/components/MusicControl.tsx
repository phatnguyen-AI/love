export type MusicStatus = 'idle' | 'playing' | 'paused' | 'unavailable'

type MusicControlProps = {
  status: MusicStatus
  label?: string
  onToggle: () => void
}

function SoundIcon({ playing }: { playing: boolean }) {
  return (
    <div className="music-icon-equalizer" aria-hidden="true">
      <span className={`music-bar music-bar--1 ${playing ? 'music-bar--playing' : ''}`} />
      <span className={`music-bar music-bar--2 ${playing ? 'music-bar--playing' : ''}`} />
      <span className={`music-bar music-bar--3 ${playing ? 'music-bar--playing' : ''}`} />
    </div>
  )
}

export function MusicControl({ status, label, onToggle }: MusicControlProps) {
  const unavailable = status === 'unavailable'
  const playing = status === 'playing'
  const accessibleLabel = unavailable
    ? 'Nhạc không khả dụng'
    : playing
      ? 'Tắt nhạc nền'
      : 'Bật nhạc nền'

  return (
    <div className="music-wrap">
      <button
        type="button"
        className={`music-control ${playing ? 'music-control--playing' : ''}`}
        onClick={onToggle}
        disabled={unavailable}
        aria-label={accessibleLabel}
        title={label ? `${accessibleLabel}: ${label}` : accessibleLabel}
      >
        <SoundIcon playing={playing} />
        <span className="music-control__text">
          {unavailable ? 'không có nhạc' : playing ? (label || 'đang phát') : 'đã tắt'}
        </span>
        {playing && <i className="music-control__pulse" aria-hidden="true" />}
      </button>
    </div>
  )
}
