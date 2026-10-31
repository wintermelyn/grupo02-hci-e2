import { PageHeader } from '../../components'
import { ActivityPreview } from './ActivityPreview'
import { ActivityView } from './ActivityView'
import { ReadingNow } from './ReadingNow'
import { useActivityView, useActivityViewFocus, useActivityViewScroll } from './useActivityView'
import { useFeed, useReadingNow } from './useHome'

export function HomePage() {
  const reading = useReadingNow()
  const feed = useFeed()
  const { batches, showMore } = useActivityView()
  useActivityViewScroll(batches !== undefined)
  const { viewTitle, viewLink } = useActivityViewFocus(batches !== undefined)

  if (batches !== undefined) {
    return <ActivityView feed={feed} batches={batches} onShowMore={showMore} titleRef={viewTitle} />
  }

  return (
    <section>
      <PageHeader title="Inicio" />
      <div className="md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12">
        <ReadingNow reading={reading} />
        <ActivityPreview feed={feed} viewLinkRef={viewLink} />
      </div>
    </section>
  )
}
