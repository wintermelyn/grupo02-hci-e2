import { BackLink, Wordmark } from '../../components'
import { LedgerRow } from './LedgerRow'

/** On a phone the cover and the title share a row, and what follows takes both columns. */
export const BOOK_COLUMNS =
  'grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 md:mt-3 md:grid-cols-[17.5rem_minmax(0,1fr)] md:items-start md:gap-x-8 lg:grid-cols-[minmax(16.5rem,4fr)_minmax(0,7fr)] lg:gap-x-12'

/** The cover follows the reading on a long page. Its foot leaves room for the ribbon. */
export const BOOK_COVER = 'pb-3 md:sticky md:top-4 md:pb-5'

/** What is read: from a tablet up, the second column. On a phone its parts are cells of the grid. */
export const BOOK_READING = 'contents md:block md:min-w-0'

/** The room of the record, in the width of both columns on a phone. */
export const BOOK_RECORD = 'col-span-2 mt-2 min-w-0 border-t border-line md:mt-5'

/** The room of the description, in the width of both columns on a phone. */
export const BOOK_ABOUT = 'col-span-2 mt-7 lg:mt-10'

export function BookTopRow({ back }: { back: { to: string; label: string } }) {
  return (
    <div className="flex items-center justify-between pt-3 lg:pt-8">
      <BackLink to={back.to} label={back.label} />
      <Wordmark />
    </div>
  )
}

/**
 * The page of a book that is still on its way, in the place of each thing it will show: the cover,
 * the title and the record, with the one row a book outside the library has, and its description.
 * The lines have the height of their text, so the record stays where it will be.
 */
export function BookSkeleton({ back }: { back: { to: string; label: string } }) {
  return (
    <article>
      <BookTopRow back={back} />
      <div role="status">
        <h1 className="sr-only">Cargando libro…</h1>
      </div>
      <div aria-hidden className={`${BOOK_COLUMNS} motion-safe:animate-pulse`}>
        <div className={BOOK_COVER}>
          <div className="aspect-2/3 w-28 rounded-[2px_3px_3px_2px] bg-sand md:w-56" />
        </div>
        <div className={BOOK_READING}>
          <div className="min-w-0">
            <div className="h-7 w-4/5 rounded-full bg-sand md:h-[2.2rem] lg:h-11" />
            <div className="mt-1 md:mt-1.5">
              <div className="flex h-5 items-center md:h-6">
                <div className="h-4 w-2/5 rounded-full bg-sand" />
              </div>
              <div className="flex h-5 items-center md:h-6">
                <div className="h-4 w-1/3 rounded-full bg-sand" />
              </div>
            </div>
          </div>
          <dl className={BOOK_RECORD}>
            <LedgerRow label={<span className="h-3 w-12 rounded-full bg-sand" />}>
              <div className="min-h-11 rounded-full bg-sand md:w-56" />
            </LedgerRow>
          </dl>
          <div className={BOOK_ABOUT}>
            <div className="h-6 w-1/2 rounded-full bg-sand" />
            <div className="mt-4 h-4 max-w-[60ch] rounded-full bg-sand" />
            <div className="mt-2 h-4 max-w-[60ch] rounded-full bg-sand" />
            <div className="mt-2 h-4 w-3/5 rounded-full bg-sand" />
          </div>
        </div>
      </div>
    </article>
  )
}
