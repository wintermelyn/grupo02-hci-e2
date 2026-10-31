import { Heart } from 'lucide-react'
import { cx } from '../../components/cx'
import { useChanged } from '../../components/useChanged'
import { useStore } from '../../store'
import { activitySentence, type FeedItem } from './feed'

export interface LikeButtonProps {
  item: FeedItem
  className?: string
}

/** A gesture towards a friend, so it has no counter. The toast says who it reaches. */
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
      // The same states as a quiet button, in the size of the text next to it. The minimum width
      // keeps the row still when the word changes.
      className={cx(
        'inline-flex min-h-11 min-w-24 items-center gap-1.5 rounded-control px-2 text-sm font-semibold whitespace-nowrap transition-colors duration-100 hover:bg-shell active:bg-sand',
        liked ? 'text-ink' : 'text-muted',
        className,
      )}
    >
      <Heart aria-hidden size={16} fill={liked ? 'currentColor' : 'none'} />
      {/* A new element per state, so the word that changed enters like a new tag does. */}
      <span key={String(liked)} className={cx(changed && 'animate-tag-in')}>
        {liked ? 'Te gusta' : 'Me gusta'}
      </span>
    </button>
  )
}
