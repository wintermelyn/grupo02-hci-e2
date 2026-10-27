import { useState } from 'react'
import type { Book } from '../types'
import { cx } from './cx'

export type BookCoverSize = 'sm' | 'md' | 'lg'

export interface BookCoverProps {
  book: Pick<Book, 'id' | 'title' | 'coverUrl'>
  size?: BookCoverSize
  className?: string
}

const SIZE_CLASSES: Record<BookCoverSize, string> = {
  sm: 'w-12 text-sm',
  md: 'w-24 text-xl',
  lg: 'w-40 text-3xl',
}

// Dark enough for white initials at 4.5:1 or more.
const PLACEHOLDER_COLOURS = [
  '#7c4a2d',
  '#1e3a8a',
  '#065f46',
  '#7c2d12',
  '#581c87',
  '#831843',
  '#134e4a',
  '#3f3f46',
]

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

/**
 * Decorative: every screen shows the title next to the cover, so screen readers skip it.
 * Falls back to the placeholder when there is no image or it fails to load.
 */
export function BookCover({ book, size = 'md', className }: BookCoverProps) {
  const [failedUrl, setFailedUrl] = useState<string>()
  const showImage = book.coverUrl !== undefined && book.coverUrl !== failedUrl
  const frame = cx(
    'aspect-[2/3] shrink-0 overflow-hidden rounded-md shadow-sm',
    SIZE_CLASSES[size],
    className,
  )

  if (showImage) {
    return (
      <img
        src={book.coverUrl}
        alt=""
        loading="lazy"
        onError={() => setFailedUrl(book.coverUrl)}
        className={cx(frame, 'bg-gray-200 object-cover')}
      />
    )
  }

  return (
    <div
      aria-hidden
      className={cx(frame, 'flex items-center justify-center font-bold text-white')}
      style={{ backgroundColor: placeholderColour(book.id) }}
    >
      {initials(book.title)}
    </div>
  )
}
