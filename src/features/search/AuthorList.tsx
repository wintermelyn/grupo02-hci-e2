import { BookCover } from '../../components'
import { cx } from '../../components/cx'
import { coverTone } from '../../lib/coverTone'
import { booksLabel } from '../library/filters'
import type { AuthorGroup } from './results'

const COVERS = 2
const FEATURED_COVERS = 3

// Each cover and where it leans, cut by the foot of the card. Under 400 px they step aside, because
// the card is 139 px wide, with a name of up to three lines and the amount of books at its feet.
// Under 360 px they shrink a little more and clear "48 libros", the longest amount of the catalog.
// Alone in its row, up to lg, the card has room to spare, and they grow to fill it.
const FIRST_COVER =
  'z-10 right-7 -bottom-12 w-17 -rotate-[7deg] max-[399px]:right-4 max-[399px]:-bottom-9 max-[399px]:w-13 max-[360px]:right-1.5 max-[360px]:w-12 group-only/tile:max-lg:right-18 group-only/tile:max-lg:-bottom-16 group-only/tile:max-lg:w-24'
const SECOND_COVER =
  '-right-3 -bottom-14 w-17 rotate-[9deg] max-[399px]:-right-5 max-[399px]:-bottom-8 max-[399px]:w-13 max-[360px]:w-12 group-only/tile:max-lg:right-1 group-only/tile:max-lg:-bottom-18 group-only/tile:max-lg:w-24'

const COVER_PLACES = [
  `${FIRST_COVER} lg:right-8 lg:-bottom-14 lg:w-20`,
  `${SECOND_COVER} lg:-bottom-16 lg:w-20`,
]

// From lg the first author takes the place of the best result, and its books fill that card.
const FEATURED_COVER_PLACES = [
  `${FIRST_COVER} lg:right-auto lg:-bottom-16 lg:left-1/2 lg:w-44 lg:-translate-x-1/2 lg:-rotate-[2deg]`,
  `${SECOND_COVER} lg:right-4 lg:-bottom-20 lg:w-36`,
  '-rotate-[9deg] max-lg:hidden lg:-bottom-20 lg:left-4 lg:w-36',
]

interface AuthorTileProps {
  author: AuthorGroup
  featured: boolean
  onPick: (name: string) => void
}

function AuthorTile({ author, featured, onPick }: AuthorTileProps) {
  const places = featured ? FEATURED_COVER_PLACES : COVER_PLACES
  const covers = author.books.slice(0, featured ? FEATURED_COVERS : COVERS)
  return (
    <button
      type="button"
      onClick={() => onPick(author.name)}
      style={{ backgroundColor: coverTone(author.books[0]) }}
      className={cx(
        'relative isolate flex h-36 w-full flex-col overflow-hidden rounded-card p-3.5 text-left text-white transition-[translate] duration-150 hover:-translate-y-0.5 active:translate-y-px lg:h-40',
        featured && 'lg:h-full lg:min-h-80 lg:p-5',
      )}
    >
      <span
        className={cx(
          'block font-serif text-lg/[1.15] font-semibold text-balance',
          featured ? 'lg:text-[2rem]/[1.1] lg:tracking-[-0.02em]' : 'lg:text-xl/[1.15]',
        )}
      >
        {author.name}
      </span>
      {/* Its line stays while the catalog arrives, so the amount shows up without moving anything. */}
      <span className={cx('mt-auto block min-h-5 text-sm text-white/88', featured && 'lg:mt-1.5')}>
        {author.count !== undefined && booksLabel(author.count)}
      </span>
      {covers.map((book, index) => (
        <span key={book.id} className={cx('absolute', places[index])}>
          <BookCover book={book} raised />
        </span>
      ))}
    </button>
  )
}

/**
 * - `grid`: the cards in rows, on their own.
 * - `lead`: from lg the first author goes beside the books, as the best result, and the others under
 *   them. The list dissolves into the grid of the results to get there.
 * - `row`: from lg, the row under the best book and the list.
 */
export type AuthorListLayout = 'grid' | 'lead' | 'row'

export interface AuthorListProps {
  title: string
  authors: AuthorGroup[]
  layout?: AuthorListLayout
  /** What separates it from the block above on a computer. Beside the books, nothing does. */
  className?: string
  onPick: (name: string) => void
}

/** Four on a phone, so the books that follow stay near, and the rows that fit in each width. */
export function AuthorList({
  title,
  authors,
  layout = 'grid',
  className = 'lg:mt-0',
  onPick,
}: AuthorListProps) {
  const lead = layout === 'lead'
  const cell = lead ? 'lg:col-span-3 lg:mt-4' : ''
  return (
    <section
      className={cx(
        'mt-7',
        className,
        lead && 'lg:contents',
        layout === 'row' && 'lg:col-span-12 lg:row-start-2 lg:mt-7',
      )}
    >
      <h2 className={cx('section-title', lead && 'lg:col-span-5')}>{title}</h2>
      <ul
        className={cx(
          'mt-3 grid grid-cols-2 gap-2.5 max-md:[&>li:nth-child(n+5)]:hidden md:grid-cols-3 md:max-xl:[&>li:nth-child(n+7)]:hidden xl:grid-cols-4',
          lead && 'lg:contents',
        )}
      >
        {authors.map((author, index) => {
          const featured = lead && index === 0
          return (
            <li
              key={author.name}
              className={cx(
                'group/tile only:max-lg:col-span-full',
                featured ? 'lg:col-span-5 lg:row-start-2 lg:mt-3' : cell,
              )}
            >
              <AuthorTile author={author} featured={featured} onPick={onPick} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
