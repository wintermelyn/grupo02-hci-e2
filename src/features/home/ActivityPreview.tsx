import type { Ref } from 'react'
import { ActivityRow } from './ActivityRow'
import type { FeedItem } from './feed'
import { NoActivity } from './NoActivity'
import { QuietLink } from './QuietLink'
import { ACTIVITY_PATH } from './useActivityView'

export const PREVIEW_LENGTH = 5

export interface ActivityPreviewProps {
  feed: FeedItem[]
  /** Where the focus returns when the view closes. */
  viewLinkRef: Ref<HTMLAnchorElement>
}

export function ActivityPreview({ feed, viewLinkRef }: ActivityPreviewProps) {
  return (
    <section className="mt-6 md:mt-5">
      <h2 className="font-serif text-heading font-semibold">Actividad de tus amigos</h2>
      {feed.length === 0 ? (
        <div className="mt-3">
          <NoActivity />
        </div>
      ) : (
        <ul className="mt-1">
          {feed.slice(0, PREVIEW_LENGTH).map((item) => (
            <ActivityRow key={item.activity.id} item={item} from="/" />
          ))}
        </ul>
      )}
      {feed.length > PREVIEW_LENGTH && (
        <QuietLink ref={viewLinkRef} to={ACTIVITY_PATH}>
          Ver toda la actividad ({feed.length})
        </QuietLink>
      )}
    </section>
  )
}
