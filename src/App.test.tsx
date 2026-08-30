import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LoveLetterPage } from './App'
import { loveContent } from './content'

const contentWithMusic = {
  ...loveContent,
  musicUrl: 'https://example.test/tu-ngay-em-den.mp3',
}

async function finishSceneTransition(duration = 900) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(duration)
  })
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

  it('opens the envelope and moves through every chapter with interactive mini-games to the final note', async () => {
    render(<LoveLetterPage content={contentWithMusic} />)
    expect(screen.getByRole('heading', { name: loveContent.recipientName })).toBeInTheDocument()
    
    // Open letter via envelope button
    fireEvent.click(screen.getByRole('button', { name: /mở lá thư/i }))

    await finishSceneTransition(1700)

    // Chapter 0
    expect(screen.getByRole('heading', { name: loveContent.chapters[0].title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tắt nhạc nền/i })).toBeInTheDocument()

    // Chapter 1
    fireEvent.click(screen.getByRole('button', { name: /đọc tiếp/i }))
    await finishSceneTransition()
    expect(screen.getByRole('heading', { name: loveContent.chapters[1].title })).toBeInTheDocument()

    // Mini-game 1: ScratchCard
    fireEvent.click(screen.getByRole('button', { name: /đọc tiếp/i }))
    await finishSceneTransition()
    expect(screen.getByLabelText(/vuốt ngón tay/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /mở ngay/i }))
    fireEvent.click(screen.getByRole('button', { name: /đọc tiếp chương sau/i }))
    await finishSceneTransition()

    // Chapter 2
    expect(screen.getByRole('heading', { name: loveContent.chapters[2].title })).toBeInTheDocument()

    // Mini-game 2: HeartHold
    fireEvent.click(screen.getByRole('button', { name: /đọc tiếp/i }))
    await finishSceneTransition()
    expect(screen.getByText(/chạm và giữ trái tim/i)).toBeInTheDocument()
    
    const heartBtn = screen.getByRole('button', { name: /chạm và giữ để sạc đầy trái tim/i })
    fireEvent.pointerDown(heartBtn, { pointerId: 1 })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500)
    })
    fireEvent.pointerUp(heartBtn, { pointerId: 1 })

    expect(screen.getByText(/từng nhịp đập đều dành cho em/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /xem tiếp nhé/i }))
    await finishSceneTransition()

    // Chapter 3
    expect(screen.getByRole('heading', { name: loveContent.chapters[3].title })).toBeInTheDocument()

    // Chapter 4
    fireEvent.click(screen.getByRole('button', { name: /đọc tiếp/i }))
    await finishSceneTransition()
    expect(screen.getByRole('heading', { name: loveContent.chapters[4].title })).toBeInTheDocument()

    // Final card
    fireEvent.click(screen.getByRole('button', { name: /mở lời nhắn cuối/i }))
    await finishSceneTransition()
    expect(screen.getByRole('heading', { name: loveContent.finalMessage })).toBeInTheDocument()
    expect(screen.getByText(loveContent.signature)).toBeInTheDocument()
    expect(screen.getByText(/được viết bằng tất cả sự chân thành/i)).toBeInTheDocument()
  })

  it('allows reading sequentially when mini-games are disabled', async () => {
    render(<LoveLetterPage content={contentWithMusic} enableMiniGames={false} />)
    fireEvent.click(screen.getByRole('button', { name: /mở lá thư/i }))

    await finishSceneTransition(1700)

    for (let index = 0; index < loveContent.chapters.length; index += 1) {
      expect(screen.getByRole('heading', { name: loveContent.chapters[index].title })).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: index === loveContent.chapters.length - 1 ? /mở lời nhắn cuối/i : /đọc tiếp/i }))
      await finishSceneTransition()
    }

    expect(screen.getByRole('heading', { name: loveContent.finalMessage })).toBeInTheDocument()
  })

  it('keeps the letter usable when remote music cannot play', async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new Error('blocked'))
    render(<LoveLetterPage content={contentWithMusic} />)
    fireEvent.click(screen.getByRole('button', { name: /mở lá thư/i }))

    await finishSceneTransition(1700)

    expect(screen.getByRole('button', { name: /nhạc không khả dụng/i })).toBeDisabled()
    expect(screen.getByRole('heading', { name: loveContent.chapters[0].title })).toBeInTheDocument()
  })

  it('switches between Starlight and Sakura themes', async () => {
    const { container } = render(<LoveLetterPage content={contentWithMusic} />)
    const mainEl = container.querySelector('main')
    expect(mainEl).toHaveClass('love-page--starlight')

    fireEvent.click(screen.getByRole('button', { name: /hoa anh đào/i }))
    expect(mainEl).toHaveClass('love-page--sakura')

    fireEvent.click(screen.getByRole('button', { name: /ngàn sao/i }))
    expect(mainEl).toHaveClass('love-page--starlight')
  })

  it('opens a configured reply card and returns focus to the final note', async () => {
    const contentWithReply = {
      ...contentWithMusic,
      reply: {
        ...loveContent.reply!,
        formId: 'test-form-id',
      },
    }

    render(<LoveLetterPage content={contentWithReply} enableMiniGames={false} />)
    fireEvent.click(screen.getByRole('button', { name: /mở lá thư/i }))

    await finishSceneTransition(1700)

    for (let index = 0; index < loveContent.chapters.length; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: index === loveContent.chapters.length - 1 ? /mở lời nhắn cuối/i : /đọc tiếp/i }))
      await finishSceneTransition()
    }

    const replyButton = screen.getByRole('button', { name: loveContent.reply!.ctaLabel })
    fireEvent.click(replyButton)
    await finishSceneTransition()
    expect(screen.getByRole('heading', { name: loveContent.reply!.title })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /quay lại lời nhắn cuối/i }))
    await finishSceneTransition()
    expect(screen.getByRole('heading', { name: loveContent.finalMessage })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: loveContent.reply!.ctaLabel })).toHaveFocus()
  })

  it('does not show a reply action until a Formspree form ID is configured', async () => {
    const contentWithoutReply = {
      ...contentWithMusic,
      reply: {
        ...loveContent.reply!,
        formId: '',
      },
    }

    render(<LoveLetterPage content={contentWithoutReply} enableMiniGames={false} />)
    fireEvent.click(screen.getByRole('button', { name: /mở lá thư/i }))

    await finishSceneTransition(1700)

    for (let index = 0; index < loveContent.chapters.length; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: index === loveContent.chapters.length - 1 ? /mở lời nhắn cuối/i : /đọc tiếp/i }))
      await finishSceneTransition()
    }

    expect(screen.queryByRole('button', { name: loveContent.reply!.ctaLabel })).not.toBeInTheDocument()
  })
})
