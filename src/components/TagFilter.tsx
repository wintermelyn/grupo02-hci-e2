import { STATUS_LABELS, STATUS_ORDER } from '../lib/status'
import type { ReadingStatus } from '../types'
import { cx } from './cx'
import { Ribbon } from './Ribbon'

export type TagFilterValue = ReadingStatus | 'all'

export interface TagFilterProps {
  value: TagFilterValue
  counts: Record<TagFilterValue, number>
  onChange: (value: TagFilterValue) => void
}

const OPTIONS: readonly { value: TagFilterValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  ...STATUS_ORDER.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]

function booksLabel(count: number): string {
  return count === 1 ? '1 libro' : `${count} libros`
}

/**
 * The tag buttons (D3), which also say how many books each one has. The active one opens into the
 * page below it, so it reads as a tab, with the ribbon hanging over it.
 */
export function TagFilter({ value, counts, onChange }: TagFilterProps) {
  return (
    <div role="group" aria-label="Filtrar por estado" className="-mx-2 grid grid-cols-5">
      {OPTIONS.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={`${option.label}: ${booksLabel(counts[option.value])}`}
            onClick={() => onChange(option.value)}
            className={cx(
              'relative flex min-h-16 flex-col items-center justify-end rounded-t-card pt-3 pb-2.5 text-xs whitespace-nowrap',
              'transition-colors duration-100',
              active
                ? 'bg-paper font-bold text-ink'
                : 'font-medium text-muted hover:text-ink active:bg-sand',
            )}
          >
            {active && (
              <Ribbon className="absolute top-0 left-1/2 h-3 w-2.25 -translate-x-1/2 bg-ribbon" />
            )}
            <span className="font-serif text-xl font-semibold tabular-nums">
              {counts[option.value]}
            </span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
