import { Star } from 'lucide-react'
import { useId } from 'react'

export interface StarsProps {
  /** 1–5, or undefined for no rating. */
  value?: number
  /** Turns the display into an input. undefined clears the rating, which is optional. */
  onChange?: (value: number | undefined) => void
  /** Legend of the input. */
  label?: string
}

const MAX_RATING = 5
const RATINGS = Array.from({ length: MAX_RATING }, (_, index) => index + 1)

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return <Star aria-hidden size={size} className={filled ? 'fill-ink text-ink' : 'text-muted'} />
}

function ratingLabel(value: number | undefined): string {
  return value ? `${value} de ${MAX_RATING} estrellas` : 'Sin puntaje'
}

export function Stars({ value, onChange, label = 'Puntaje' }: StarsProps) {
  const name = useId()

  if (!onChange) {
    return (
      <span role="img" aria-label={ratingLabel(value)} className="inline-flex gap-0.5">
        {RATINGS.map((rating) => (
          <StarIcon key={rating} filled={rating <= (value ?? 0)} size={14} />
        ))}
      </span>
    )
  }

  // Native radios give arrow-key navigation and a single tab stop for free.
  return (
    <fieldset>
      <legend className="mb-1 font-medium">{label}</legend>
      {/* Each star is centred in its 44 px target, so this lines it up with the legend. */}
      <div className="-ml-2 flex flex-wrap items-center">
        {RATINGS.map((rating) => (
          <label
            key={rating}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-control active:bg-shell has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink"
          >
            <input
              type="radio"
              name={name}
              value={rating}
              checked={value === rating}
              onChange={() => onChange(rating)}
              className="sr-only"
            />
            <StarIcon filled={rating <= (value ?? 0)} size={28} />
            <span className="sr-only">{rating === 1 ? '1 estrella' : `${rating} estrellas`}</span>
          </label>
        ))}
        <span className="ml-2 text-muted" aria-hidden>
          {value ? `${value} de ${MAX_RATING}` : 'Sin puntaje'}
        </span>
        {value !== undefined && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="ml-1 min-h-11 rounded-control px-2 font-medium underline underline-offset-2 active:bg-shell"
          >
            Quitar puntaje
          </button>
        )}
      </div>
    </fieldset>
  )
}
