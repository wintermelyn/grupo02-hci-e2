import { useId, useMemo, type MouseEvent } from 'react'
import { BookCover, Button } from '../../components'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { placesLeft } from '../../lib/leaveLibrary'
import { STATUS_LABELS } from '../../lib/status'
import { selectBook, selectEntry, useStore } from '../../store'
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
  const folders = useStore((state) => state.folders)
  const answerWantPrompt = useStore((state) => state.answerWantPrompt)
  const focusToast = useStore((state) => state.focusToast)
  const prompt = useMemo(
    () => findWantPrompt({ library, lastWantPromptOn }),
    [library, lastWantPromptOn],
  )
  const book = useStore(selectBook(prompt?.bookId ?? ''))
  const entry = useStore(selectEntry(prompt?.bookId ?? ''))
  const questionId = useId()
  const costId = useId()

  if (!prompt || !book || !entry) return null

  function answer(keep: boolean, { detail }: MouseEvent) {
    // The list moves up as the row leaves, and the second tap would open whatever lands below it.
    ignoreSecondClick()
    answerWantPrompt(book!.id, keep)
    onAnswered()
    // Enter and Space send a click with no clicks counted. By keyboard, Deshacer is too far away.
    if (detail === 0) focusToast()
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
              {book.title} · {prompt.days} días en {STATUS_LABELS.want}
            </p>
            <p id={costId} className="text-sm wrap-break-word text-muted">
              Si dices No, sale de {placesLeft(entry.folderIds, folders)}
            </p>
          </div>
          <div
            role="group"
            aria-label={`¿Sigues queriendo leer ${book.title}?`}
            className="mt-2 grid max-w-52 grid-cols-2 gap-2 md:mt-0 md:w-52 md:shrink-0"
          >
            <Button compact onClick={(event) => answer(true, event)}>
              Sí
            </Button>
            <Button compact aria-describedby={costId} onClick={(event) => answer(false, event)}>
              No
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
