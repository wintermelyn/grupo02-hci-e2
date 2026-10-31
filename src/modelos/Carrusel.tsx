import { ChevronRight } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { BookCover, bookPath, Button, Ribbon } from '../components'
import { cx } from '../components/cx'
import { useStore } from '../store'
import type { Book } from '../types'
import type { Lista } from './datos'

type Cargada = Lista & { items: Book[] }

const SLIDE_GAP = 24

function Slide({ book, why, hidden }: { book: Book; why?: string; hidden: boolean }) {
  const upsertBook = useStore((state) => state.upsertBook)
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/descubrir' }}
      onClick={() => upsertBook(book)}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      className="flex w-full shrink-0 snap-center gap-3.5 rounded-control md:gap-5"
    >
      <span className="w-28 shrink-0 md:w-36">
        <BookCover book={book} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-2 font-serif text-lg/snug font-semibold md:text-heading">
          {book.title}
        </span>
        <span className="text-sm text-muted">
          {book.authors[0]}
          {book.year ? ` · ${book.year}` : ''}
        </span>
        {why && <span className="mt-1 text-sm font-semibold">{why}</span>}
        <span className="mt-1.5 line-clamp-3 text-sm text-muted md:line-clamp-4">
          {book.description ?? 'Aún no tenemos descripción de este libro.'}
        </span>
        <span className="mt-auto flex items-center gap-0.5 pt-1 text-sm font-semibold">
          Ver ficha
          <ChevronRight aria-hidden size={16} />
        </span>
      </span>
    </Link>
  )
}

/** Un libro destacado por vez, con sus portadas abajo. Sin avance automático: lo mueve la persona. */
export function Carrusel({ lista }: { lista: Cargada }) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const count = lista.items.length

  function goTo(next: number) {
    const track = trackRef.current
    if (!track) return
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: next * (track.clientWidth + SLIDE_GAP),
      behavior: calm ? 'auto' : 'smooth',
    })
    setIndex(next)
  }

  function onScroll() {
    const track = trackRef.current
    if (track) setIndex(Math.round(track.scrollLeft / (track.clientWidth + SLIDE_GAP)))
  }

  return (
    <section aria-labelledby={titleId} className="mt-6 min-w-0 first:mt-5 lg:mt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={titleId} className="font-serif text-heading font-semibold">
          {lista.title}
        </h2>
        <span className="shrink-0 text-sm text-muted tabular-nums">
          {index + 1} de {count}
        </span>
      </div>
      <p className="text-sm text-muted">{lista.note}</p>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="mt-3 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 [scrollbar-width:none]"
      >
        {lista.items.map((book, position) => (
          <Slide
            key={book.id}
            book={book}
            why={lista.why?.[book.id]}
            hidden={position !== index}
          />
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between gap-3">
        <ul className="flex gap-1.5">
          {lista.items.map((book, position) => {
            const active = position === index
            return (
              <li key={book.id}>
                <button
                  type="button"
                  aria-label={book.title}
                  aria-current={active || undefined}
                  onClick={() => goTo(position)}
                  className="relative block w-10 pt-1 transition-[translate] duration-100 active:translate-y-px"
                >
                  {active && (
                    <Ribbon className="absolute top-0 left-1/2 z-10 h-3 w-2.25 -translate-x-1/2 bg-ribbon" />
                  )}
                  <span
                    className={cx(
                      'block rounded-[3px] outline-offset-1',
                      active && 'outline-2 outline-ink',
                    )}
                  >
                    <BookCover book={book} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="hidden shrink-0 gap-1 md:flex">
          <Button compact disabled={index === 0} onClick={() => goTo(index - 1)}>
            Anterior
          </Button>
          <Button compact disabled={index === count - 1} onClick={() => goTo(index + 1)}>
            Siguiente
          </Button>
        </div>
      </div>
    </section>
  )
}
