export type MusicStatus = 'idle' | 'playing' | 'paused' | 'unavailable'

type MusicControlProps = {
  status: MusicStatus
  label?: string
  onToggle: () => void
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 9v6h4l5 4V5L9 9H5Z" />
      {muted ? (
        <path d="m18 9 4 4m0-4-4 4" />
      ) : (
        <path d="M17 9.5a4 4 0 0 1 0 5M19.5 7a7 7 0 0 1 0 10" />
      )}
    </svg>
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
        <SoundIcon muted={!playing} />
        <span>{unavailable ? 'không có nhạc' : playing ? 'đang phát' : 'đã tắt'}</span>
        {playing && <i className="music-control__pulse" aria-hidden="true" />}
      </button>
    </div>
  )
}

