import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LoveLetterPage } from './App'
import { loveContent } from './content'

const contentWithMusic = {
  ...loveContent,
  musicUrl: 'https://example.test/tu-ngay-em-den.mp3',
}

describe('LoveLetterPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('opens the envelope and moves through every chapter to the final note', async () => {
    render(<LoveLetterPage content={contentWithMusic} />)
    expect(screen.getByRole('heading', { name: loveContent.recipientName })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /mở lá thư/i }))

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(screen.getByRole('heading', { name: loveContent.chapters[0].title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tắt nhạc nền/i })).toBeInTheDocument()

    for (let index = 1; index < loveContent.chapters.length; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: /đọc tiếp/i }))
      expect(screen.getByRole('heading', { name: loveContent.chapters[index].title })).toBeInTheDocument()
    }

    fireEvent.click(screen.getByRole('button', { name: /mở lời nhắn cuối/i }))
    expect(screen.getByRole('heading', { name: loveContent.finalMessage })).toBeInTheDocument()
    expect(screen.getByText(loveContent.signature)).toBeInTheDocument()
    expect(screen.getByText(/được viết bằng tất cả sự chân thành/i)).toBeInTheDocument()
  })

  it('keeps the letter usable when remote music cannot play', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('blocked'))
    render(<LoveLetterPage content={contentWithMusic} />)
    fireEvent.click(screen.getByRole('button', { name: /mở lá thư/i }))

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(screen.getByRole('button', { name: /nhạc không khả dụng/i })).toBeDisabled()
    expect(screen.getByRole('heading', { name: loveContent.chapters[0].title })).toBeInTheDocument()
  })
})
