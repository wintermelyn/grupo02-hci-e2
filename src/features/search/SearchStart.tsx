import { Link } from 'react-router'
import type { Book } from '../../types'
import { FRIENDS_PATH } from '../friends/people'
import { AuthorList } from './AuthorList'
import { FriendsShelf } from './FriendsShelf'
import { RecentSearches } from './RecentSearches'
import type { AuthorGroup } from './results'

export interface SearchStartProps {
  recent: string[]
  authors: AuthorGroup[]
  friendsBooks: Book[]
  onSearch: (term: string) => void
  onPickAuthor: (name: string) => void
  onClearRecent: () => void
}

/** Before typing: what the person can recognise, so they do not have to recall a title. */
export function SearchStart({
  recent,
  authors,
  friendsBooks,
  onSearch,
  onPickAuthor,
  onClearRecent,
}: SearchStartProps) {
  return (
    <>
      {recent.length > 0 && (
        <RecentSearches terms={recent} onPick={onSearch} onClear={onClearRecent} />
      )}
      {authors.length > 0 && (
        <AuthorList title="Autores de Mis libros" authors={authors} onPick={onPickAuthor} />
      )}
      <FriendsShelf books={friendsBooks} />
      <p className="mt-1 flex min-h-11 flex-wrap items-center gap-x-1 text-sm text-muted">
        ¿Buscas a una persona? Eso va en
        <Link
          to={FRIENDS_PATH}
          className="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-muted/50 transition-colors duration-100 hover:decoration-ink"
        >
          Amigos
        </Link>
      </p>
    </>
  )
}
