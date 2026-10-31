import { useId, useMemo } from 'react'
import { BookCover, Button } from '../../components'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { selectBook, useStore } from '../../store'
import { findWantPrompt } from './findWantPrompt'

export interface WantPromptProps {
  /** The row is gone after an answer, so whoever shows it decides where the focus goes. */
  onAnswered: () => void
}

/**
 * The D5 prompt: one old book of Lo quiero at a time, above the list and without blocking it. It
 * stays until it is answered, so a task does not lose it by leaving the section. Sí and No are the
 * same button, because neither answer is the expected one.
 */
export function WantPrompt({ onAnswered }: WantPromptProps) {
  const library = useStore((state) => state.library)
  const lastWantPromptOn = useStore((state) => state.lastWantPromptOn)
  const answerWantPrompt = useStore((state) => state.answerWantPrompt)
  const prompt = useMemo(
    () => findWantPrompt({ library, lastWantPromptOn }),
    [library, lastWantPromptOn],
  )
  const book = useStore(selectBook(prompt?.bookId ?? ''))
  const questionId = useId()

  if (!prompt || !book) return null

  function answer(keep: boolean) {
    // The list moves up as the row leaves, and the second tap would open whatever lands below it.
    ignoreSecondClick()
    answerWantPrompt(book!.id, keep)
    onAnswered()
  }

  return (
    <section aria-labelledby={questionId} className="mt-4 border-b border-line pb-3">
      <div className="flex items-center gap-3.5">
        <div className="w-14 shrink-0">
          <BookCover book={book} />
        </div>
        <div className="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-6">
          <div className="min-w-0">
            <h2 id={questionId} className="font-serif text-lg/snug font-semibold">
              ¿Sigues queriendo leer este libro?
            </h2>
            <p className="line-clamp-2 text-sm wrap-break-word text-muted">
              {book.title} · {prompt.days} días en tu lista
            </p>
          </div>
          <div
            role="group"
            aria-label={`¿Sigues queriendo leer ${book.title}?`}
            className="mt-2 grid max-w-52 grid-cols-2 gap-2 md:mt-0 md:w-52 md:shrink-0"
          >
            <Button compact onClick={() => answer(true)}>
              Sí
            </Button>
            <Button compact onClick={() => answer(false)}>
              No
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
