import { useState, type FormEvent } from 'react'

import { Button } from '@/components/common'

export interface ChatComposerProps {
  /** 추천 질문 칩. 누르면 그 문구가 바로 전송됩니다. */
  suggestions: string[]
  onSend: (text: string) => void
  /** 답변을 기다리는 동안 true. 칩과 입력창을 잠급니다. */
  disabled?: boolean
}

/** 추천 질문 칩 + 입력창 + [전송] 버튼입니다. */
export function ChatComposer({ suggestions, onSend, disabled = false }: ChatComposerProps) {
  const [text, setText] = useState('')

  const send = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    send(text)
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-2">
        {suggestions.map((question) => (
          <li key={question}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => send(question)}
              className="rounded-full bg-brand-subtle px-3 py-1.5 text-caption font-medium text-text-brand transition-colors hover:bg-brand-primary hover:text-text-inverse disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-subtle disabled:hover:text-text-brand"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 rounded-lg border border-border-default bg-bg-surface py-3 pr-3 pl-4"
      >
        <input
          type="text"
          value={text}
          maxLength={500}
          disabled={disabled}
          onChange={(event) => setText(event.target.value)}
          placeholder={
            disabled
              ? '답변을 기다리는 중이에요...'
              : '매출, 고정비, 정산, 지원금 무엇이든 물어보세요'
          }
          aria-label="질문 입력"
          className="min-w-0 flex-1 bg-transparent text-body-m text-text-primary placeholder:text-text-tertiary focus:outline-none disabled:cursor-not-allowed"
        />
        <Button type="submit" disabled={disabled || !text.trim()}>
          전송
        </Button>
      </form>
    </div>
  )
}
