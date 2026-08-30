import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LoveReplyContent } from '../content'
import { ReplyCard } from './ReplyCard'

const replyContent: LoveReplyContent = {
  formId: 'test-form-id',
  ctaLabel: 'Gửi anh đôi lời',
  title: 'Đến lượt em nhắn anh',
  prompt: 'Nếu em muốn, hãy để lại vài dòng ở đây.',
  successMessage: 'Lời nhắn đã được gửi rồi. Cảm ơn em vì đã hồi âm cho anh ♡',
}

describe('ReplyCard', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('rejects a message containing only whitespace', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<ReplyCard content={replyContent} onBack={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/lời em muốn nhắn/i), { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: /gửi lời nhắn/i }))

    expect(screen.getByText(/viết ít nhất một vài lời/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits the trimmed reply and shows a success card', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ next: '/thanks' }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const onBack = vi.fn()
    const { container } = render(<ReplyCard content={replyContent} onBack={onBack} />)

    fireEvent.change(screen.getByLabelText(/tên của em/i), { target: { value: '  An  ' } })
    fireEvent.change(screen.getByLabelText(/lời em muốn nhắn/i), { target: { value: '  Em đã đọc hết rồi.  ' } })
    fireEvent.click(screen.getByRole('button', { name: /gửi lời nhắn/i }))

    await waitFor(() => expect(screen.getByRole('heading', { name: /cảm ơn em/i })).toBeInTheDocument())
    expect(container.querySelector('input[name="_gotcha"]')).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const request = fetchMock.mock.calls[0][1] as RequestInit
    expect(fetchMock.mock.calls[0][0]).toBe('https://formspree.io/f/test-form-id')
    expect(JSON.parse(request.body as string)).toMatchObject({
      name: 'An',
      message: 'Em đã đọc hết rồi.',
      _gotcha: '',
      _subject: 'Lời nhắn hồi âm từ lá thư',
      page_url: window.location.href,
    })

    fireEvent.click(screen.getByRole('button', { name: /quay lại lá thư/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('preserves the reply when Formspree returns an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ errors: [{ message: 'Không thể gửi lúc này.' }] }),
    }))
    render(<ReplyCard content={replyContent} onBack={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/lời em muốn nhắn/i), { target: { value: 'Một lời vẫn cần được giữ lại' } })
    fireEvent.click(screen.getByRole('button', { name: /gửi lời nhắn/i }))

    expect(await screen.findByText('Không thể gửi lúc này.')).toBeInTheDocument()
    expect(screen.getByLabelText(/lời em muốn nhắn/i)).toHaveValue('Một lời vẫn cần được giữ lại')
    expect(screen.getByRole('button', { name: /gửi lời nhắn/i })).toBeEnabled()
  })

  it('disables submission while the request is pending', async () => {
    let resolveResponse!: (value: { next: string }) => void
    const responseBody = new Promise<{ next: string }>((resolve) => {
      resolveResponse = resolve
    })
    const fetchMock = vi.fn().mockResolvedValue({ json: () => responseBody })
    vi.stubGlobal('fetch', fetchMock)
    render(<ReplyCard content={replyContent} onBack={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/lời em muốn nhắn/i), { target: { value: 'Anh chờ em nhé' } })
    fireEvent.click(screen.getByRole('button', { name: /gửi lời nhắn/i }))

    const pendingButton = await screen.findByRole('button', { name: /đang gửi/i })
    expect(pendingButton).toBeDisabled()
    fireEvent.click(pendingButton)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await act(async () => resolveResponse({ next: '/thanks' }))
    expect(await screen.findByRole('heading', { name: /cảm ơn em/i })).toBeInTheDocument()
  })
})
