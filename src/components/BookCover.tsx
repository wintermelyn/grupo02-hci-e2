import { useState } from 'react'
import type { Book, ReadingStatus } from '../types'
import { cx } from './cx'
import { Ribbon } from './Ribbon'
import { STATUS_RIBBON } from './statusStyles'
import { useChanged } from './useChanged'

/** `fill` takes the width of its container, for grids that change columns. */
export type BookCoverSize = 'xs' | 'sm' | 'fill' | 'lg'

export interface BookCoverProps {
  book: Pick<Book, 'id' | 'title' | 'coverUrl'>
  size?: BookCoverSize
  /** Shows the ribbon of this status coming out from under the cover. */
  status?: ReadingStatus
  /** The longer shadow of a cover that sits on a colour or stands alone in a rail. */
  raised?: boolean
  className?: string
}

const SIZE_CLASSES: Record<BookCoverSize, string> = {
  xs: 'w-11 text-xs',
  sm: 'w-14 text-sm md:w-16',
  fill: 'w-full text-xl',
  lg: 'w-28 text-2xl md:w-56 md:text-3xl',
}

const RIBBON_CLASSES: Record<BookCoverSize, string> = {
  xs: '-bottom-1 right-1.5 h-3 w-1.5',
  sm: '-bottom-1.5 right-2 h-4 w-1.75',
  fill: '-bottom-2 right-3 h-6 w-2.5',
  lg: '-bottom-3 right-4 h-6 w-2.5 md:-bottom-5 md:right-6 md:h-9 md:w-3.25',
}

// Dark enough for white initials at 4.5:1 or more.
const PLACEHOLDER_COLOURS = ['#1e1915', '#2f4a78', '#6b3a63', '#85490f', '#5f564d', '#7a2334']

function placeholderColour(id: string): string {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PLACEHOLDER_COLOURS[hash % PLACEHOLDER_COLOURS.length]
}

function initials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toLocaleUpperCase('es-CL')
}

const BOX_RATIO = 2 / 3

// The hinge of a printed cover, which also separates pale covers from a pale background.
const HINGE =
  'after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-0.5 after:bg-ink/15'

/**
 * Decorative: every screen shows the title next to the cover, so screen readers skip it.
 * Falls back to the placeholder when there is no image or it fails to load.
 *
 * `lg` keeps the whole cover: it takes its real shape inside a fixed 2:3 box, so nothing around it
 * jumps when the image loads, and sits on the box's bottom edge, where the ribbon comes out.
 */
export function BookCover({
  book,
  size = 'fill',
  status,
  raised = false,
  className,
}: BookCoverProps) {
  const [failedUrl, setFailedUrl] = useState<string>()
  const statusChanged = useChanged(status)
  const [ratio, setRatio] = useState<number>()
  const showImage = book.coverUrl !== undefined && book.coverUrl !== failedUrl
  const wholeCover = size === 'lg' && showImage && ratio !== undefined

  return (
    <span
      className={cx('relative isolate block shrink-0', SIZE_CLASSES[size], className)}
      aria-hidden
    >
      <span className="flex aspect-2/3 items-end justify-center">
        <span
          className={cx(
            'relative block aspect-2/3 w-full overflow-hidden rounded-[2px_3px_3px_2px]',
            raised ? 'shadow-cover' : size === 'lg' ? 'shadow-book-lg' : 'shadow-book',
            HINGE,
          )}
          style={
            wholeCover
              ? { aspectRatio: ratio, width: `${Math.min(ratio / BOX_RATIO, 1) * 100}%` }
              : undefined
          }
        >
          {showImage ? (
            <img
              src={book.coverUrl}
              alt=""
              loading={size === 'lg' ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={({ currentTarget }) => {
                if (size === 'lg')
                  setRatio(currentTarget.naturalWidth / currentTarget.naturalHeight)
              }}
              onError={() => setFailedUrl(book.coverUrl)}
              className="block size-full bg-sand object-cover"
            />
          ) : (
            <span
              className="flex size-full items-center justify-center font-serif font-semibold text-white"
              style={{ backgroundColor: placeholderColour(book.id) }}
            >
              {initials(book.title)}
            </span>
          )}
        </span>
      </span>
      {status && (
        <Ribbon
          // A new ribbon for each status, so the one that changed comes down from under the cover.
          key={status}
          className={cx(
            'absolute -z-10',
            RIBBON_CLASSES[size],
            STATUS_RIBBON[status],
            statusChanged && 'animate-ribbon-in',
          )}
        />
      )}
    </span>
  )
}
