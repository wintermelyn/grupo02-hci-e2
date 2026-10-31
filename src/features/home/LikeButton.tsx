import { Heart } from 'lucide-react'
import { cx } from '../../components/cx'
import { useChanged } from '../../components/useChanged'
import { useStore } from '../../store'
import { activitySentence, type FeedItem } from './feed'

export interface LikeButtonProps {
  item: FeedItem
  className?: string
}

/**
 * A gesture towards a friend, so it has no counter. The toast says who it reaches. On a phone it is
 * only the heart, one of the two approved exceptions to rule 1: its name is in aria-label, and given
 * or not shows in the shape of the heart, filled or empty.
 */
export function LikeButton({ item, className }: LikeButtonProps) {
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
      // The minimum width keeps the row still when the word changes.
      className={cx(
        'inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-[background-color,color,scale] duration-150 hover:bg-sand active:scale-90 active:bg-sand-deep md:min-w-26 md:justify-start md:px-3',
        liked ? 'text-ribbon' : 'text-muted',
        className,
      )}
    >
      <Heart aria-hidden size={20} fill={liked ? 'currentColor' : 'none'} />
      {/* A new element per state, so the word that changed enters like a new tag does. */}
      <span key={String(liked)} className={cx('max-md:hidden', changed && 'animate-tag-in')}>
        {liked ? 'Te gusta' : 'Me gusta'}
      </span>
    </button>
  )
}
