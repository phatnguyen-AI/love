import type { ThemeType } from './ParticleBackground'

interface ThemeSelectorProps {
  currentTheme: ThemeType
  onSelectTheme: (theme: ThemeType) => void
}

const THEMES: { id: ThemeType; label: string }[] = [
  { id: 'starlight', label: 'Ngàn Sao' },
  { id: 'sakura', label: 'Hoa Anh Đào' },
]

function ThemeIcon({ theme }: { theme: ThemeType }) {
  if (theme === 'starlight') {
    return (
      <svg viewBox="0 0 24 24" role="presentation">
        <path d="M12 2.8l1.25 5.1L18 5.5l-2.7 4.5 5.2.25-4.8 2.1 3.95 3.4-5.05-1.2.7 5.15L12 15.65 8.7 19.7l.7-5.15-5.05 1.2 3.95-3.4-4.8-2.1L8.7 10 6 5.5l4.75 2.4L12 2.8z" />
        <circle cx="19.1" cy="4.2" r="1.1" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M12 11.6C7.2 9.4 7.8 4.1 12 3c4.2 1.1 4.8 6.4 0 8.6z" />
      <path d="M12.4 12c2.2-4.8 7.4-3.9 8.3.4-1.3 4.1-6.6 4.4-8.3-.4z" />
      <path d="M11.7 12.3c4.7 2.1 3.8 7.4-.5 8.3-4.1-1.4-4.4-6.6.5-8.3z" />
      <path d="M11.4 11.9C9.3 16.6 4 15.8 3.1 11.5 4.4 7.4 9.7 7.1 11.4 11.9z" />
      <circle cx="12" cy="12" r="2.1" />
    </svg>
  )
}

export function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  return (
    <div className="theme-selector-wrap" role="region" aria-label="Lựa chọn chủ đề hiển thị">
      <div className="theme-selector">
        {THEMES.map((t) => {
          const isActive = currentTheme === t.id
          return (
            <button
              key={t.id}
              type="button"
              className={`theme-selector__btn ${isActive ? 'theme-selector__btn--active' : ''}`}
              onClick={() => onSelectTheme(t.id)}
              aria-pressed={isActive}
              aria-label={`Chủ đề ${t.label}`}
              title={`Đổi sang chủ đề ${t.label}`}
            >
              <span className="theme-selector__icon" aria-hidden="true"><ThemeIcon theme={t.id} /></span>
              <span className="theme-selector__label">{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
