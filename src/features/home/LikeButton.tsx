import { Heart } from 'lucide-react'
import { cx } from '../../components/cx'
import { useChanged } from '../../components/useChanged'
import { useStore } from '../../store'
import { activitySentence, type FeedItem } from './feed'

export interface LikeButtonProps {
  item: FeedItem
  /** Where the word goes beside the heart: a row of Inicio only has room for it on a computer. */
  wordFrom?: 'md' | 'lg'
  className?: string
}

// The minimum width keeps the row still when the word changes.
const WITH_WORD = {
  md: 'md:min-w-26 md:justify-start md:px-3',
  lg: 'lg:min-w-26 lg:justify-start lg:px-3',
}
const WORD = { md: 'max-md:hidden', lg: 'max-lg:hidden' }

/**
 * A gesture towards a friend, so it has no counter. The toast says who it reaches. Under `wordFrom`
 * it is only the heart, one of the two approved exceptions to rule 1: its name is in aria-label, and
 * given or not shows in the shape of the heart, filled or empty.
 */
export function LikeButton({ item, wordFrom = 'md', className }: LikeButtonProps) {
  const activityId = item.activity.id
  const likedIds = useStore((state) => state.likedActivityIds)
  const toggleLike = useStore((state) => state.toggleLike)
  const liked = likedIds.includes(activityId)
  const changed = useChanged(liked)

  return (
    <button
      type="button"
      // A fixed name that says which activity it is: the state is only in aria-pressed.
      aria-label={`Me gusta: ${activitySentence(item)}`}
      aria-pressed={liked}
      onClick={() => toggleLike(activityId)}
      className={cx(
        'inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-[background-color,color,scale] duration-150 hover:bg-sand active:scale-90 active:bg-sand-deep',
        WITH_WORD[wordFrom],
        liked ? 'text-ribbon' : 'text-muted',
        className,
      )}
    >
      <Heart aria-hidden size={20} fill={liked ? 'currentColor' : 'none'} />
      {/* A new element per state, so the word that changed enters like a new tag does. */}
      <span key={String(liked)} className={cx(WORD[wordFrom], changed && 'animate-tag-in')}>
        {liked ? 'Te gusta' : 'Me gusta'}
      </span>
    </button>
  )
}
