import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { BookCover, Button, InlineConfirm } from '../../components'
import { cx } from '../../components/cx'
import { ignoreSecondClick } from '../../components/ignoreSecondClick'
import { placesLeft } from '../../lib/leaveLibrary'
import { STATUS_LABELS } from '../../lib/status'
import { selectBook, selectEntry, useStore } from '../../store'
import type { BookId } from '../../types'
import { findWantPrompt } from './findWantPrompt'

export interface WantPromptProps {
  /** The row is gone after an answer, so whoever shows it decides where the focus goes. */
  onAnswered: () => void
}

/**
 * The D5 prompt: one old book of Lo quiero at a time, above the list and without blocking it. It
 * stays until it is answered, so a task does not lose it by leaving the section. Sí keeps the book
 * and No takes it out of Mis libros and its folders, so they do not look alike: No says what it
 * does, weighs less, and asks in the row before taking the book out. Deshacer still follows.
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
  const promptId = prompt?.bookId
  const answeredId = useRef<BookId>(undefined)
  const rowRef = useRef<HTMLElement>(null)
  const questionRef = useRef<HTMLHeadingElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef(false)
  // Tied to the book, so a question left open never shows up for the next one.
  const [confirmingId, setConfirmingId] = useState<BookId>()
  const confirming = Boolean(promptId) && confirmingId === promptId

  // Only Deshacer brings back the book that was just answered. The row comes in above the list and
  // above where the person is, so the question goes to them instead of the page leaving it behind.
  useLayoutEffect(() => {
    if (!promptId || promptId !== answeredId.current) return
    answeredId.current = undefined
    questionRef.current?.focus({ preventScroll: true })
    rowRef.current?.scrollIntoView?.({ block: 'nearest' })
  }, [promptId])

  // No only exists again once the confirmation is gone.
  useEffect(() => {
    if (confirming || !returnFocus.current) return
    returnFocus.current = false
    noRef.current?.focus()
  }, [confirming])

  if (!prompt || !book || !entry) return null

  function cancel() {
    returnFocus.current = true
    setConfirmingId(undefined)
  }

  function answer(keep: boolean, { detail }: MouseEvent) {
    // The list moves up as the row leaves, and the second tap would open whatever lands below it.
    ignoreSecondClick()
    answeredId.current = book!.id
    setConfirmingId(undefined)
    answerWantPrompt(book!.id, keep)
    onAnswered()
    // Enter and Space send a click with no clicks counted. By keyboard, Deshacer is too far away.
    if (detail === 0) focusToast()
  }

  return (
    // The margins keep the whole row clear of the bottom bar and of the toast of Deshacer.
    <section
      ref={rowRef}
      aria-labelledby={confirming ? undefined : questionId}
      aria-label={confirming ? '¿Sigues queriendo leer este libro?' : undefined}
      className={cx(
        'mt-4 scroll-mt-4 scroll-mb-36 lg:scroll-mb-20',
        // The confirmation draws its own box, so the row's line would sit loose under it.
        !confirming && 'border-b border-line pb-3',
      )}
    >
      {confirming ? (
        <InlineConfirm
          title={`¿Quitar «${book.title}» de Mis libros?`}
          confirmLabel="Quitar de Mis libros"
          onConfirm={(event) => answer(false, event)}
          onCancel={cancel}
        >
          Sale de {placesLeft(entry.folderIds, folders)}.
        </InlineConfirm>
      ) : (
        <div className="flex items-center gap-3.5">
          <div className="w-14 shrink-0">
            <BookCover book={book} />
          </div>
          <div className="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-6">
            <div className="min-w-0">
              <h2
                ref={questionRef}
                id={questionId}
                tabIndex={-1}
                className="font-serif text-lg/snug font-semibold"
              >
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
              className="mt-2 flex gap-2 md:mt-0 md:shrink-0"
            >
              {/* Sí is drawn by its edge and No by its words alone, as an action of the row. */}
              <Button compact onClick={(event) => answer(true, event)} className="min-w-20">
                Sí
              </Button>
              <Button
                ref={noRef}
                variant="quiet"
                compact
                aria-describedby={costId}
                onClick={() => setConfirmingId(book.id)}
              >
                No, quitarlo
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
