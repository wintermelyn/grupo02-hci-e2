import { BackLink, Wordmark } from '../../components'
import { LedgerRow } from './LedgerRow'

export const BOOK_COLUMNS =
  'md:mt-3 md:grid md:grid-cols-[17.5rem_minmax(0,1fr)] md:items-start md:gap-x-8 lg:grid-cols-[minmax(16.5rem,4fr)_minmax(0,7fr)] lg:gap-x-12'

/** The scene follows the reading on a long page. Its foot leaves room for the ribbon. */
export const BOOK_SCENE =
  'flex justify-center rounded-stage pt-4 pb-6 md:sticky md:top-4 md:px-6 md:pt-10 md:pb-14'

export function BookTopRow({ back }: { back: { to: string; label: string } }) {
  return (
    <div className="flex items-center justify-between pt-3 lg:pt-8">
      <BackLink to={back.to} label={back.label} />
      <Wordmark />
    </div>
  )
}

/**
 * The page of a book that is still on its way, in the place of each thing it will show: the scene,
 * the title and the record, with the one row a book outside the library has, and its description.
 */
export function BookSkeleton({ back }: { back: { to: string; label: string } }) {
  return (
    <article>
      <BookTopRow back={back} />
      <div role="status">
        <h1 className="sr-only">Cargando libro…</h1>
      </div>
      <div aria-hidden className={`${BOOK_COLUMNS} motion-safe:animate-pulse`}>
        <div className={`${BOOK_SCENE} bg-shell`}>
          <div className="aspect-2/3 w-28 rounded-[2px_3px_3px_2px] bg-sand md:w-56" />
        </div>
        <div className="min-w-0">
          <div className="mt-3 md:mt-0">
            <div className="h-8 w-4/5 rounded-full bg-sand lg:h-10" />
            <div className="mt-3 h-4 w-2/5 rounded-full bg-sand" />
            <div className="mt-2 h-4 w-1/3 rounded-full bg-sand" />
          </div>
          <dl className="mt-3 border-t border-line md:mt-5">
            <LedgerRow label={<span className="h-3 w-12 rounded-full bg-sand" />}>
              <div className="min-h-11 rounded-full bg-sand md:w-56" />
            </LedgerRow>
          </dl>
          <div className="mt-7 lg:mt-10">
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
