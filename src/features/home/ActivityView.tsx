import { useMemo, type Ref } from 'react'
import { Button, PageHeader } from '../../components'
import { ActivityEntry } from './ActivityEntry'
import { groupByPeriod, type FeedGroup, type FeedItem } from './feed'
import { NoActivity } from './NoActivity'
import { QuietLink } from './QuietLink'
import { activityPath, useFocusNewRow } from './useActivityView'

/** One more than Inicio shows, so opening the view already brings something new. */
export const BATCH_SIZE = 6

/** The period stays beside its rows from md, so a long week always says where it is. */
function PeriodGroup({ group, from }: { group: FeedGroup; from: string }) {
  return (
    <section className="mt-5 md:grid md:grid-cols-[8rem_minmax(0,1fr)] md:gap-x-6 md:border-t md:border-line md:pt-3 lg:grid-cols-[10rem_minmax(0,1fr)]">
      <h2 className="section-title md:sticky md:top-4 md:self-start">{group.label}</h2>
      <ul className="mt-1 md:mt-0">
        {group.items.map((item) => (
          <ActivityEntry
            key={item.activity.id}
            item={item}
            from={from}
            dated={group.period !== 'today'}
          />
        ))}
      </ul>
    </section>
  )
}

function EndOfActivity() {
  return (
    <div className="mt-5 border-t border-line pt-3">
      <p className="font-serif text-lg font-semibold">Ya viste toda la actividad</p>
      <QuietLink to="/">Volver a Inicio</QuietLink>
    </div>
  )
}

export interface ActivityViewProps {
  feed: FeedItem[]
  batches: number
  onShowMore: () => void
  /** Where the focus lands when the view opens. */
  titleRef: Ref<HTMLSpanElement>
}

/** Grows by batches with a clear end, in the flow of the page: no infinite list, no inner scroll. */
export function ActivityView({ feed, batches, onShowMore, titleRef }: ActivityViewProps) {
  const visible = useMemo(() => feed.slice(0, batches * BATCH_SIZE), [feed, batches])
  const groups = useMemo(() => groupByPeriod(visible), [visible])
  const { list, focusRowAfterUpdate } = useFocusNewRow(visible.length)
  const left = feed.length - visible.length

  function showMore() {
    focusRowAfterUpdate()
    onShowMore()
  }

  return (
    <section>
      <PageHeader
        title={
          <span ref={titleRef} tabIndex={-1} className="rounded-control">
            Actividad de tus amigos
          </span>
        }
        backTo="/"
        backLabel="Inicio"
      />
      {feed.length === 0 ? (
        <NoActivity />
      ) : (
        <div ref={list}>
          {groups.map((group) => (
            <PeriodGroup key={group.period} group={group} from={activityPath(batches)} />
          ))}
          {left > 0 ? (
            <Button onClick={showMore} className="mt-5 w-full md:w-auto">
              Ver más ({left})
            </Button>
          ) : (
            <EndOfActivity />
          )}
        </div>
      )}
    </section>
  )
}
