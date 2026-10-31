import { CalendarDays, CircleAlert } from 'lucide-react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Stars } from '../../components'
import { cx } from '../../components/cx'
import { today } from '../../lib/dates'
import { useStore } from '../../store'
import type { BookId, ISODate, LibraryEntry } from '../../types'
import { LedgerRow } from './LedgerRow'
import { readingDatesProblem } from './readingDates'

interface DateRowProps {
  label: string
  value: ISODate
  min?: ISODate
  max?: ISODate
  /** Says whether the date was saved. A rejected date goes back to the saved one. */
  onCommit: (value: ISODate) => boolean
}

// The picker button stays, invisible over the whole field, so touching anywhere opens the calendar.
// Chrome ignores :focus on the parts of a date, so nothing can replace the blue of the part being
// edited. This filter turns it into a colour close to sand and keeps that part marked.
const DATE_INPUT = cx(
  'relative min-h-11 w-full min-w-0 rounded-control bg-transparent py-2 pr-7 pl-2 font-medium',
  'transition-colors duration-100 hover:bg-ink/5',
  '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0',
  '[&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:size-full',
  '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-0',
  '[&::-webkit-calendar-picker-indicator]:opacity-0',
  '[&::-webkit-datetime-edit-day-field]:[filter:grayscale(1)_sepia(.5)]',
  '[&::-webkit-datetime-edit-month-field]:[filter:grayscale(1)_sepia(.5)]',
  '[&::-webkit-datetime-edit-year-field]:[filter:grayscale(1)_sepia(.5)]',
)

/**
 * A date that saves itself. The calendar gives a whole date, so it is saved at once. Typing goes
 * through partial dates, which would each leave a toast, so it is saved on Enter or on leaving.
 */
function DateRow({ label, value, min, max, onCommit }: DateRowProps) {
  const id = useId()
  const [draft, setDraft] = useState(value)
  const [saved, setSaved] = useState(value)
  const typing = useRef(false)

  // Deshacer changes the date from outside. Not a key: a new input would lose the focus.
  if (saved !== value) {
    setSaved(value)
    setDraft(value)
  }

  function commit(next: ISODate) {
    typing.current = false
    if (next !== value && !onCommit(next)) setDraft(value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') commit(draft)
    else if (event.key !== 'Tab') typing.current = true
  }

  return (
    <LedgerRow label={<label htmlFor={id}>{label}</label>}>
      {/* Over the left only: to the right, the 4 px of the focus outline stay inside the margin. */}
      <span className="relative mr-1 -ml-2 block">
        <input
          id={id}
          type="date"
          value={draft}
          min={min}
          max={max}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            setDraft(event.target.value)
            if (!typing.current) commit(event.target.value)
          }}
          onBlur={() => commit(draft)}
          className={DATE_INPUT}
        />
        <CalendarDays
          aria-hidden
          size={18}
          className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-muted supports-[-moz-appearance:none]:hidden"
        />
      </span>
    </LedgerRow>
  )
}

export interface ReadingDetailsProps {
  bookId: BookId
  entry: LibraryEntry
}

/**
 * The dates and rating of a reading, as rows of the record: "Leído" applies at once, so they are
 * corrected right here and each change offers Deshacer.
 */
export function ReadingDetails({ bookId, entry }: ReadingDetailsProps) {
  const finishBook = useStore((state) => state.finishBook)
  const setStartDate = useStore((state) => state.setStartDate)
  const [problem, setProblem] = useState<string>()
  const limit = today()
  const startedAt = entry.startedAt ?? entry.addedAt
  const finishedAt = entry.finishedAt ?? limit
  const rating = entry.rating

  function changeStart(next: ISODate) {
    // A start after the end takes the end with it, so the order of the two edits does not matter.
    const end = entry.status === 'read' && next > finishedAt ? next : finishedAt
    const found = readingDatesProblem(next, end)
    setProblem(found)
    if (found) return false
    if (entry.status === 'read') finishBook(bookId, { startedAt: next, finishedAt: end, rating })
    else setStartDate(bookId, next)
    return true
  }

  function changeEnd(next: ISODate) {
    const found = readingDatesProblem(startedAt, next)
    setProblem(found)
    if (found) return false
    finishBook(bookId, { startedAt, finishedAt: next, rating })
    return true
  }

  return (
    <>
      <DateRow label="Inicio" value={startedAt} max={limit} onCommit={changeStart} />
      {entry.status === 'read' && (
        <>
          <DateRow
            label="Fin"
            value={finishedAt}
            min={startedAt}
            max={limit}
            onCommit={changeEnd}
          />
          <LedgerRow label="Puntaje">
            <Stars
              value={rating}
              onChange={(value) => finishBook(bookId, { startedAt, finishedAt, rating: value })}
            />
          </LedgerRow>
        </>
      )}
      {/* Stays mounted, so screen readers announce why a date went back. */}
      <div role="status">
        {problem && (
          <p className="flex items-center gap-1.5 border-b border-line py-2 text-sm">
            <CircleAlert aria-hidden size={16} className="shrink-0 text-muted" />
            {problem} Dejamos la fecha guardada.
          </p>
        )}
      </div>
    </>
  )
}
