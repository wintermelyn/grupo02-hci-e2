import { cx } from '../../components/cx'
import { AUTHOR_GRID } from './AuthorList'
import { BOOK_GRID, GRID_BESIDE_LEAD, RESULTS_GRID } from './SearchResults'

const AUTHORS = [0, 1, 2, 3]
const BOOKS = [0, 1, 2, 3, 4]

/** As tall as `section-title`. It has no words: from lg the same place can be either of two titles. */
function TitleLine({ className }: { className?: string }) {
  return (
    <div className={cx('flex h-[1.8rem] items-center lg:h-[2.1rem]', className)}>
      <div className="h-5 w-28 rounded-full bg-sand" />
    </div>
  )
}

/**
 * The results that are still on their way, the first time the catalog downloads: the line of the
 * amount, one row of authors and the books. From lg it has the two columns that both kinds of best
 * result share, so the first author takes the large card and the books stand beside it.
 */
export function SearchSkeleton() {
  return (
    <>
      <div role="status" className="mt-3 flex h-5 items-center">
        <span className="sr-only">Buscando…</span>
        <div aria-hidden className="h-3 w-32 rounded-full bg-sand motion-safe:animate-pulse" />
      </div>
      <div aria-hidden className={cx(RESULTS_GRID, 'motion-safe:animate-pulse')}>
        <div className="mt-7 lg:contents">
          <TitleLine className="lg:col-span-5" />
          <ul
            className={cx(
              AUTHOR_GRID,
              'max-md:[&>li:nth-child(n+3)]:hidden md:max-lg:[&>li:nth-child(n+4)]:hidden lg:contents',
            )}
          >
            {AUTHORS.map((author) => (
              <li
                key={author}
                className="group first:lg:col-span-5 first:lg:row-start-2 first:lg:mt-3 not-first:lg:col-span-3 not-first:lg:mt-4"
              >
                <div className="h-36 rounded-card bg-sand lg:h-40 lg:group-first:h-full lg:group-first:min-h-80" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-7 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:pl-6">
          <TitleLine />
          <ul className={cx(BOOK_GRID, GRID_BESIDE_LEAD)}>
            {BOOKS.map((book) => (
              <li key={book} className="flex items-center gap-3.5 py-2">
                <div className="aspect-2/3 w-11 shrink-0 rounded-[2px_3px_3px_2px] bg-sand" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/5 rounded-full bg-sand" />
                  <div className="h-3 w-2/5 rounded-full bg-sand" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
