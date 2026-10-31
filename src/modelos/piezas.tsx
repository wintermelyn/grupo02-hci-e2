import { Heart, Plus } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  BookCover,
  bookPath,
  Button,
  Ribbon,
  TextField,
} from '../components'
import { cx } from '../components/cx'
import { daysAgo, today } from '../lib/dates'
import { selectBook, useStore } from '../store'
import type { Book, BookId } from '../types'
import { folderNameProblem, MAX_FOLDER_NAME_LENGTH } from '../features/library/filters'
import { differenceInCalendarDays } from 'date-fns'
import { parseDate } from '../lib/dates'

const WANT_PROMPT_AFTER_DAYS = 90

/** El libro por el que pregunta el aviso, si corresponde hoy. */
export function useAviso(): { book: Book; days: number } | undefined {
  const library = useStore((state) => state.library)
  const answered = useStore((state) => state.lastWantPromptOn)
  const bookId = useMemo(() => {
    if (answered === today()) return undefined
    const limit = daysAgo(WANT_PROMPT_AFTER_DAYS)
    return Object.values(library)
      .filter(({ status }) => status === 'want')
      .map((entry) => ({ id: entry.bookId, date: entry.wantCheckedAt ?? entry.addedAt }))
      .filter(({ date }) => date < limit)
      .sort((a, b) => a.date.localeCompare(b.date))[0]
  }, [library, answered])
  const book = useStore(selectBook(bookId?.id ?? ''))
  if (!bookId || !book) return undefined
  return { book, days: differenceInCalendarDays(parseDate(today()), parseDate(bookId.date)) }
}

export function SiNo({ bookId, className }: { bookId: BookId; className?: string }) {
  const answer = useStore((state) => state.answerWantPrompt)
  return (
    <div className={cx('grid grid-cols-2 gap-2', className)}>
      <Button compact onClick={() => answer(bookId, true)}>
        Sí
      </Button>
      <Button compact onClick={() => answer(bookId, false)}>
        No
      </Button>
    </div>
  )
}

/** Mismo lenguaje que TagFilter, para cualquier conjunto de vistas de una página. */
export function BandTabs({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: { id: string; label: string; count: number }[]
  value: string
  onChange: (id: string) => void
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cx('-mx-2 flex', className)}>
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={cx(
              'relative flex min-h-14 flex-1 flex-col items-center justify-end rounded-t-card px-2 pt-3 pb-1.5 text-xs whitespace-nowrap transition-colors duration-100 md:flex-none md:px-5',
              active ? 'bg-paper font-bold text-ink' : 'font-medium text-muted hover:text-ink active:bg-sand',
            )}
          >
            {active && (
              <Ribbon className="absolute top-0 left-1/2 h-3 w-2.25 -translate-x-1/2 bg-ribbon" />
            )}
            <span className="font-serif text-base/5 font-semibold tabular-nums">{option.count}</span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function LikeButton({ id, className }: { id: string; className?: string }) {
  const liked = useStore((state) => state.likedActivityIds.includes(id))
  const toggle = useStore((state) => state.toggleLike)
  return (
    <button
      type="button"
      aria-pressed={liked}
      onClick={() => toggle(id)}
      className={cx(
        'inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 text-sm font-semibold transition-colors duration-100 hover:bg-sand active:bg-sand-deep',
        liked ? 'text-ink' : 'text-muted',
        className,
      )}
    >
      <Heart aria-hidden size={16} fill={liked ? 'currentColor' : 'none'} />
      {liked ? 'Te gusta' : 'Me gusta'}
    </button>
  )
}

/** Un libro de una estantería: portada, título y autor. */
export function ShelfBook({ book, className }: { book: Book; className?: string }) {
  const upsertBook = useStore((state) => state.upsertBook)
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/descubrir' }}
      onClick={() => upsertBook(book)}
      className={cx('block rounded-control transition-[translate] duration-100 active:translate-y-px', className)}
    >
      <BookCover book={book} />
      <span className="mt-2 line-clamp-2 font-serif text-base/5 font-semibold">{book.title}</span>
      <span className="mt-0.5 line-clamp-1 text-sm text-muted">{book.authors[0]}</span>
    </Link>
  )
}

export function Sublinea({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>
}

/** La última tarjeta del tablero: se presiona, y el nombre se escribe ahí mismo. */
export function NewFolderTile() {
  const folders = useStore((state) => state.folders)
  const createFolder = useStore((state) => state.createFolder)
  const [name, setName] = useState<string | undefined>()
  const problem =
    name === undefined || name.trim() === ''
      ? undefined
      : folderNameProblem({ id: '', name: '', createdAt: '' }, name, folders)

  function save() {
    if (!name?.trim() || problem) return
    createFolder(name.trim())
    setName(undefined)
  }

  if (name === undefined) {
    return (
      <button
        type="button"
        onClick={() => setName('')}
        className="block h-full w-full rounded-card bg-sand p-3 text-left transition-[background-color,translate] duration-100 hover:bg-sand-deep active:translate-y-px"
      >
        <span className="grid grid-cols-2 gap-1.5">
          <span className="aspect-2/3 rounded-[2px_3px_3px_2px] bg-shell" />
          <span className="aspect-2/3 rounded-[2px_3px_3px_2px] bg-shell" />
        </span>
        <span className="mt-2.5 flex items-center gap-1 font-serif text-lg font-semibold">
          <Plus aria-hidden size={18} className="shrink-0" />
          Nueva carpeta
        </span>
        <span className="block text-sm text-muted">Un libro puede estar en varias</span>
      </button>
    )
  }

  return (
    <div className="flex h-full flex-col justify-end rounded-card border border-edge bg-white p-3">
      <div className="font-serif text-lg">
        <TextField
          label="Nombre de la carpeta nueva"
          value={name}
          onChange={setName}
          onSubmit={save}
          onCancel={() => setName(undefined)}
          problem={problem}
          maxLength={MAX_FOLDER_NAME_LENGTH}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Button compact disabled={!name.trim() || Boolean(problem)} onClick={save} className="flex-1">
          Crear
        </Button>
        <Button compact variant="quiet" onClick={() => setName(undefined)} className="flex-1">
          Cancelar
        </Button>
      </div>
    </div>
  )
}
