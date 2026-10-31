import { Book, BookOpen, Bookmark, CircleCheck, type LucideIcon } from 'lucide-react'
import type { ReadingStatus } from '../types'

/** Text colour of a status; always paired with its icon and label, never used alone. */
export const STATUS_TEXT: Record<ReadingStatus, string> = {
  want: 'text-want',
  owned: 'text-owned',
  reading: 'text-reading',
  read: 'text-read',
}

/** The ribbon under a cover, in the colour of the book's status. */
export const STATUS_RIBBON: Record<ReadingStatus, string> = {
  want: 'bg-want',
  owned: 'bg-owned',
  reading: 'bg-reading',
  read: 'bg-read',
}

export const STATUS_ICONS: Record<ReadingStatus, LucideIcon> = {
  want: Bookmark,
  owned: Book,
  reading: BookOpen,
  read: CircleCheck,
}
