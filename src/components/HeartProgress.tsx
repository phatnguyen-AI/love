type HeartProgressProps = {
  total: number
  current: number
  completed?: boolean
}

export function HeartProgress({ total, current, completed = false }: HeartProgressProps) {
  const readCount = completed ? total : current + 1

  return (
    <div className="heart-progress" role="img" aria-label={`Đã đọc ${readCount} trên ${total} phần`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={index <= current || completed ? 'heart-progress__heart heart-progress__heart--active' : 'heart-progress__heart'}
          aria-hidden="true"
        >
          ♥
        </span>
      ))}
    </div>
  )
}

