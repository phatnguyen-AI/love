import { ValidationError, useForm } from '@formspree/react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import type { LoveReplyContent } from '../content'

type ReplyCardProps = {
  content: LoveReplyContent
  onBack: () => void
}

type ReplyFields = {
  [key: string]: string
  name: string
  message: string
  _gotcha: string
}

const NAME_LIMIT = 80
const MESSAGE_LIMIT = 1500

export function ReplyCard({ content, onBack }: ReplyCardProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messageError, setMessageError] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const [state, submit] = useForm<ReplyFields>(content.formId.trim(), {
    data: {
      _subject: 'Lời nhắn hồi âm từ lá thư',
      page_url: () => window.location.href,
    },
  })

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    if (state.succeeded) successHeadingRef.current?.focus()
  }, [state.succeeded])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      setMessageError('Em hãy viết ít nhất một vài lời trước khi gửi nhé.')
      return
    }

    setMessageError('')
    await submit({
      name: name.trim(),
      message: trimmedMessage,
      _gotcha: honeypotRef.current?.value ?? '',
    })
  }

  if (state.succeeded) {
    return (
      <article className="reply-card reply-card--success" aria-labelledby="reply-success-title">
        <div className="reply-card__success-heart" aria-hidden="true">♥</div>
        <p className="reply-card__eyebrow">Lời hồi âm đã được gửi</p>
        <h2 id="reply-success-title" ref={successHeadingRef} tabIndex={-1}>
          Cảm ơn em
        </h2>
        <div className="message-card__divider" aria-hidden="true">
          <span className="message-card__divider-line" />
          <span className="message-card__divider-icon">♥</span>
          <span className="message-card__divider-line" />
        </div>
        <p className="reply-card__success-message">{content.successMessage}</p>
        <button className="next-button reply-card__back-button" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span>
          <span>Quay lại lá thư</span>
        </button>
      </article>
    )
  }

  return (
    <article className="reply-card" aria-labelledby="reply-title">
      <button className="reply-card__close" type="button" onClick={onBack} aria-label="Quay lại lời nhắn cuối">
        <span aria-hidden="true">←</span>
      </button>
      <span className="reply-card__corner-heart" aria-hidden="true">♡</span>
      <span className="reply-card__corner-sparkle" aria-hidden="true">✦</span>
      <p className="reply-card__eyebrow">Một lời nhắn dành cho anh</p>
      <h2 id="reply-title" ref={headingRef} tabIndex={-1}>{content.title}</h2>
      <p className="reply-card__prompt">{content.prompt}</p>

      <form className="reply-form" onSubmit={handleSubmit} noValidate>
        <div className="reply-form__field">
          <label htmlFor="reply-name">
            Tên của em <span>(không bắt buộc)</span>
          </label>
          <input
            id="reply-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={NAME_LIMIT}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Em có thể để trống"
            aria-invalid={Boolean(state.errors?.getFieldErrors('name').length)}
            aria-describedby="reply-name-error"
          />
          <ValidationError
            id="reply-name-error"
            field="name"
            prefix="Tên"
            errors={state.errors}
            className="reply-form__error"
            role="alert"
          />
        </div>

        <div className="reply-form__field">
          <div className="reply-form__label-row">
            <label htmlFor="reply-message">Lời em muốn nhắn</label>
            <span aria-hidden="true" className="reply-form__counter">{message.length}/{MESSAGE_LIMIT}</span>
          </div>
          <textarea
            id="reply-message"
            name="message"
            required
            rows={6}
            maxLength={MESSAGE_LIMIT}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value)
              if (messageError) setMessageError('')
            }}
            placeholder="Viết những điều em đang nghĩ..."
            aria-invalid={Boolean(messageError || state.errors?.getFieldErrors('message').length)}
            aria-describedby="reply-message-help reply-message-error"
          />
          <p id="reply-message-help" className="reply-form__help">
            Lời nhắn này sẽ được gửi riêng, không hiển thị công khai.
          </p>
          <div id="reply-message-error" aria-live="polite">
            {messageError && <p className="reply-form__error">{messageError}</p>}
            <ValidationError field="message" prefix="Lời nhắn" errors={state.errors} className="reply-form__error" role="alert" />
          </div>
        </div>

        <div className="reply-form__honeypot" aria-hidden="true">
          <label htmlFor="reply-company">Không điền trường này</label>
          <input
            ref={honeypotRef}
            id="reply-company"
            name="_gotcha"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <ValidationError errors={state.errors} className="reply-form__error reply-form__error--general" role="alert" />

        <button className="reply-form__submit" type="submit" disabled={state.submitting}>
          {state.submitting ? 'Đang gửi…' : 'Gửi lời nhắn'}
          {!state.submitting && <span aria-hidden="true">♡</span>}
        </button>
      </form>
    </article>
  )
}
