import { Book, BookOpen, Bookmark, CircleCheck, type LucideIcon } from 'lucide-react'
import type { ReadingStatus } from '../types'

/** Filled style for a status; always paired with its text label, never used alone. */
export const STATUS_FILL: Record<ReadingStatus, string> = {
  want: 'border-want bg-want text-white',
  owned: 'border-owned bg-owned text-white',
  reading: 'border-reading bg-reading text-white',
  read: 'border-read bg-read text-white',
}

export const STATUS_ICONS: Record<ReadingStatus, LucideIcon> = {
  want: Bookmark,
  owned: Book,
  reading: BookOpen,
  read: CircleCheck,
}
