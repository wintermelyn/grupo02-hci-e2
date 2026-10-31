import { differenceInCalendarDays } from 'date-fns'
import { daysAgo, parseDate, today } from '../../lib/dates'
import type { AppState, BookId, ISODate } from '../../types'

export const WANT_PROMPT_AFTER_DAYS = 90

export interface PromptedBook {
  bookId: BookId
  /** How long the book has gone without being chosen again. */
  days: number
}

/**
 * What the D5 prompt asks about today: the book in Lo quiero that has waited the longest, once it
 * has waited more than WANT_PROMPT_AFTER_DAYS. See "Aviso periódico" in PLAN.md.
 */
export function findWantPrompt({
  library,
  lastWantPromptOn,
}: Pick<AppState, 'library' | 'lastWantPromptOn'>): PromptedBook | undefined {
  if (lastWantPromptOn === today()) return undefined

  let oldest: { bookId: BookId; since: ISODate } | undefined
  for (const { bookId, status, wantCheckedAt, addedAt } of Object.values(library)) {
    const since = wantCheckedAt ?? addedAt
    if (status === 'want' && (!oldest || since < oldest.since)) oldest = { bookId, since }
  }
  if (!oldest || oldest.since >= daysAgo(WANT_PROMPT_AFTER_DAYS)) return undefined

  return {
    bookId: oldest.bookId,
    days: differenceInCalendarDays(parseDate(today()), parseDate(oldest.since)),
  }
}
