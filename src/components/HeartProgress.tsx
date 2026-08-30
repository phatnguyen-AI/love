type HeartProgressProps = {
  total: number
  current: number
  completed?: boolean
}

export function HeartProgress({ total, current, completed = false }: HeartProgressProps) {
  const readCount = completed ? total : current + 1

  return (
    <div
      className="heart-progress"
      role="img"
      aria-label={`Đã đọc ${readCount} trên ${total} phần`}
    >
      <div className="heart-progress__track" aria-hidden="true" />
      {Array.from({ length: total }, (_, index) => {
        const isActive = index <= current || completed
        const isCurrent = index === current && !completed
        return (
          <div
            key={index}
            className={`heart-progress__item ${isActive ? 'heart-progress__item--active' : ''} ${isCurrent ? 'heart-progress__item--current' : ''}`}
            aria-hidden="true"
          >
            <span className="heart-progress__heart">♥</span>
            {isCurrent && <span className="heart-progress__glow" />}
          </div>
        )
      })}
    </div>
  )
}
