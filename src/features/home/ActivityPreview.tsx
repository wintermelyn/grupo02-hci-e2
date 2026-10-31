import { ArrowRight } from 'lucide-react'
import type { Ref } from 'react'
import { Link } from 'react-router'
import { ActivityRow } from './ActivityRow'
import type { FeedItem } from './feed'
import { NoActivity } from './NoActivity'
import { ACTIVITY_PATH } from './useActivityView'

export const PREVIEW_LENGTH = 5

export interface ActivityPreviewProps {
  feed: FeedItem[]
  /** Where the focus returns when the view closes. */
  viewLinkRef: Ref<HTMLAnchorElement>
}

/**
 * One link and two places: beside the title on a phone, and from md the last card of the grid. The
 * list dissolves into that grid, so the link can follow the rows without a second copy of itself.
 */
export function ActivityPreview({ feed, viewLinkRef }: ActivityPreviewProps) {
  return (
    <section className="mt-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 md:grid-cols-2 md:items-stretch md:gap-2.5 lg:mt-10 2xl:grid-cols-3">
      <h2 className="section-title md:col-span-full md:mb-0.5">Tus amigos</h2>
      {feed.length === 0 ? (
        <div className="col-span-full">
          <NoActivity />
        </div>
      ) : (
        <ul className="col-span-full row-start-2 mt-3 grid gap-2 md:contents">
          {feed.slice(0, PREVIEW_LENGTH).map((item) => (
            <ActivityRow key={item.activity.id} item={item} from="/" />
          ))}
        </ul>
      )}
      {feed.length > PREVIEW_LENGTH && (
        <Link
          ref={viewLinkRef}
          to={ACTIVITY_PATH}
          className="col-start-2 row-start-1 -my-2.5 inline-flex min-h-11 items-center gap-1 rounded-control text-sm font-semibold md:col-auto md:row-auto md:my-0 md:min-h-16 md:justify-between md:gap-3 md:rounded-row md:border md:border-edge md:px-4 md:text-base md:transition-colors md:duration-150 md:hover:bg-sand md:active:bg-sand-deep"
        >
          <span>
            Ver toda la actividad{' '}
            {/* Beside the title at 320 px, the amount is what does not fit. */}
            <span className="max-[359px]:sr-only">({feed.length})</span>
          </span>
          <ArrowRight aria-hidden size={18} className="shrink-0" />
        </Link>
      )}
    </section>
  )
}
