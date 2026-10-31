import { AuthorList } from './AuthorList'
import { FriendsShelf } from './FriendsShelf'
import { RecentSearches } from './RecentSearches'
import type { AuthorGroup } from './results'
import type { FriendsBook } from './useSearchStart'

export interface SearchStartProps {
  recent: string[]
  authors: AuthorGroup[]
  friendsBooks: FriendsBook[]
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
    </>
  )
}
