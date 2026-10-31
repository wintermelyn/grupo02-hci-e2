import { Wordmark } from '../../components'
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
    <section className="pt-3 lg:pt-8">
      {/* "Leyendo ahora" is what shows, but the page is Inicio: that is its name and its tab. */}
      <h1 className="sr-only">Inicio</h1>
      <Wordmark className="mb-2" />
      <ReadingNow reading={reading} feed={feed} />
      <ActivityPreview feed={feed} viewLinkRef={viewLink} />
    </section>
  )
}
