import { CalendarDays, CircleAlert, Pencil } from 'lucide-react'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { BottomSheet, Button, Stars } from '../../components'
import { cx } from '../../components/cx'
import { formatDate, today } from '../../lib/dates'
import { useStore } from '../../store'
import type { BookId, ISODate, LibraryEntry } from '../../types'
import { readingDatesProblem } from './readingDates'

interface DateFieldProps {
  label: string
  value: ISODate
  onChange: (value: ISODate) => void
  min?: ISODate
  max?: ISODate
}

// The browser paints its picker and the focused part of the date with its own colours. The picker
// button stays, invisible over the whole field, so touching anywhere on it opens the calendar.
const DATE_INPUT = cx(
  'relative min-h-11 w-full min-w-0 rounded-control border border-muted bg-white py-2 pr-9 pl-3',
  '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0',
  '[&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:size-full',
  '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-0',
  '[&::-webkit-calendar-picker-indicator]:opacity-0',
  '[&::-webkit-datetime-edit-day-field:focus]:bg-sand [&::-webkit-datetime-edit-day-field:focus]:text-ink',
  '[&::-webkit-datetime-edit-month-field:focus]:bg-sand [&::-webkit-datetime-edit-month-field:focus]:text-ink',
  '[&::-webkit-datetime-edit-year-field:focus]:bg-sand [&::-webkit-datetime-edit-year-field:focus]:text-ink',
)

function DateField({ label, value, onChange, min, max }: DateFieldProps) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block font-medium">{label}</span>
      <span className="relative block">
        <input
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          className={DATE_INPUT}
        />
        <CalendarDays
          aria-hidden
          size={18}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
        />
      </span>
    </label>
  )
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <dt className="text-muted">{term}</dt>
      <dd className="flex items-center gap-1.5">{children}</dd>
    </div>
  )
}

export interface ReadingDetailsProps {
  bookId: BookId
  entry: LibraryEntry
}

/** Dates and rating of a book in Leído. "Leído" applies at once, so they are edited here after. */
export function ReadingDetails({ bookId, entry }: ReadingDetailsProps) {
  const finishBook = useStore((state) => state.finishBook)
  const [open, setOpen] = useState(false)
  const [startedAt, setStartedAt] = useState('')
  const [finishedAt, setFinishedAt] = useState('')
  const [rating, setRating] = useState<number>()
  const formId = useId()
  const problem = readingDatesProblem(startedAt, finishedAt)
  const limit = today()

  function edit() {
    setStartedAt(entry.startedAt ?? '')
    setFinishedAt(entry.finishedAt ?? '')
    setRating(entry.rating)
    setOpen(true)
  }

  function save(event: FormEvent) {
    event.preventDefault()
    if (problem) return
    finishBook(bookId, { startedAt, finishedAt, rating })
    setOpen(false)
  }

  return (
    <section className="mt-5 md:max-w-[34rem]">
      <h2 className="text-sm font-semibold text-muted">Tu lectura</h2>
      <dl className="mt-1 space-y-0.5">
        {entry.startedAt && <Detail term="Inicio">{formatDate(entry.startedAt)}</Detail>}
        {entry.finishedAt && <Detail term="Fin">{formatDate(entry.finishedAt)}</Detail>}
        <Detail term="Puntaje">
          <Stars value={entry.rating} />
          {entry.rating === undefined && (
            <span aria-hidden className="text-muted">
              Sin puntaje
            </span>
          )}
        </Detail>
      </dl>
      <Button icon={Pencil} onClick={edit} className="mt-2">
        Editar lectura
      </Button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Editar lectura"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" form={formId} variant="primary" disabled={Boolean(problem)}>
              Guardar
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={save} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {/* No min here: moving a reading forward starts with this date, then the end follows. */}
            <DateField label="Inicio" value={startedAt} onChange={setStartedAt} max={limit} />
            <DateField
              label="Fin"
              value={finishedAt}
              onChange={setFinishedAt}
              min={startedAt}
              max={limit}
            />
          </div>
          {/* Stays mounted, so screen readers announce why Guardar is off. */}
          <div role="status">
            {problem && (
              <p className="flex items-center gap-1.5 text-sm">
                <CircleAlert aria-hidden size={16} className="shrink-0 text-muted" />
                {problem}
              </p>
            )}
          </div>
          <Stars value={rating} onChange={setRating} />
        </form>
      </BottomSheet>
    </section>
  )
}
