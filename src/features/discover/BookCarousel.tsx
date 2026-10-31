import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ComponentProps, MouseEvent } from 'react'
import { Link } from 'react-router'
import { BookCover, bookPath } from '../../components'
import { cx } from '../../components/cx'
import { selectEntry, useStore } from '../../store'
import type { Book } from '../../types'
import type { useCarousel } from './useCarousel'

const COVER_WIDTH =
  '[--cover:max(5rem,min(46vw,calc((100dvh-28rem)/1.5)))] sm:[--cover:min(30vw,calc((100dvh-29rem)/1.5))] lg:[--cover:min(23vw,44vh,21rem)]'

interface EdgeProps {
  direction: 'back' | 'forward'
  onClick: () => void
}

/**
 * A strip the height of the scene, always there: it covers the neighbour, so aiming at the arrow
 * never lands on a book, not even in a quick click or with the carousel moving. On touch it is out of
 * sight and out of the way of the finger, but a screen reader keeps it: there it is the way forward.
 */
function CarouselEdge({ direction, onClick }: EdgeProps) {
  const Icon = direction === 'back' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={direction === 'back' ? 'Libro anterior' : 'Libro siguiente'}
      tabIndex={-1}
      onClick={onClick}
      className={cx(
        'group pointer-events-none absolute inset-y-0 z-20 flex w-20 items-center opacity-0 select-none pointer-fine:pointer-events-auto pointer-fine:cursor-pointer pointer-fine:opacity-100 lg:w-24',
        direction === 'back' ? 'left-0 justify-start pl-3' : 'right-0 justify-end pr-3',
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-white text-ink shadow-float transition-[background-color,color,scale] duration-150 group-hover:scale-105 group-hover:bg-ink group-hover:text-white group-active:scale-95">
        <Icon aria-hidden size={22} strokeWidth={2.25} />
      </span>
    </button>
  )
}

interface CarouselBookProps {
  book: Book
  atFront: boolean
  from: string
  /** A side cover does not open: it comes to the centre. */
  onBringForward: () => void
}

function CarouselBook({ book, atFront, from, onBringForward }: CarouselBookProps) {
  const entry = useStore(selectEntry(book.id))

  function onClick(event: MouseEvent) {
    if (atFront) return
    event.preventDefault()
    onBringForward()
  }

  return (
    <li
      aria-hidden={!atFront || undefined}
      className="w-(--cover) shrink-0 snap-center snap-always"
    >
      <Link
        to={bookPath(book.id)}
        state={{ from }}
        viewTransition
        aria-label={`${book.title}, ${book.authors[0]}`}
        tabIndex={atFront ? 0 : -1}
        data-active={atFront}
        onClick={onClick}
        className="carousel-item block rounded-[6px] outline-offset-4"
      >
        <BookCover book={book} status={entry?.status} raised />
      </Link>
    </li>
  )
}

export interface BookCarouselProps {
  label: string
  books: Book[]
  /** The tone of the book in front, which tints the scene behind the covers. */
  tone: string
  /** The URL a book page goes back to. */
  fromOf: (book: Book) => string
  carousel: ReturnType<typeof useCarousel>
}

export function BookCarousel({ label, books, tone, fromOf, carousel }: BookCarouselProps) {
  const { ref, place, places, endless, move, railProps } = carousel
  return (
    <div
      style={{ '--tone': tone } as ComponentProps<'div'>['style']}
      className={cx('tone-scene relative overflow-hidden rounded-stage', COVER_WIDTH)}
    >
      <ul
        ref={ref}
        {...railProps}
        aria-label={label}
        className="rail flex snap-x snap-mandatory items-center overflow-x-auto py-3 sm:py-5 lg:cursor-grab lg:py-7"
        style={{ paddingInline: 'calc(50% - var(--cover) / 2)' }}
      >
        {places.map(({ bookIndex, place: bookPlace }) => (
          <CarouselBook
            key={bookPlace}
            book={books[bookIndex]}
            atFront={bookPlace === place}
            from={fromOf(books[bookIndex])}
            onBringForward={() => move(bookPlace - place)}
          />
        ))}
      </ul>
      {endless && (
        <>
          <CarouselEdge direction="back" onClick={() => move(-1)} />
          <CarouselEdge direction="forward" onClick={() => move(1)} />
        </>
      )}
    </div>
  )
}
