import { useMemo } from 'react'
import { useStore } from '../../store'
import type { Book, LibraryEntry } from '../../types'
import { pinnedFirst, useBookLookup } from './filters'
import { FolderCard } from './FolderCard'
import { NewFolderCard } from './NewFolderCard'

export interface FolderBoardProps {
  entries: LibraryEntry[]
  /** Books outside every folder. They get a card too, so "Todos" shows all that it counts. */
  unfiledBooks: Book[]
  /** Where the card of the books outside every folder leads. */
  unfiledTo: string
}

export function FolderBoard({ entries, unfiledBooks, unfiledTo }: FolderBoardProps) {
  const folders = useStore((state) => state.folders)
  const bookOf = useBookLookup()

  const board = useMemo(() => {
    // A book can be in several folders, but each card should show covers of its own.
    const shown = new Set<string>()
    return pinnedFirst(folders).map((folder) => {
      const books = entries
        .filter(({ folderIds }) => folderIds.includes(folder.id))
        .flatMap(({ bookId }) => bookOf(bookId) ?? [])
      const covers = [
        ...books.filter(({ id }) => !shown.has(id)),
        ...books.filter(({ id }) => shown.has(id)),
      ].slice(0, 2)
      for (const { id } of covers) shown.add(id)
      return { folder, count: books.length, covers }
    })
  }, [folders, entries, bookOf])

  return (
    <section className="mt-5">
      <h2 className="mb-3 font-serif text-heading font-semibold">Mis carpetas</h2>
      <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {board.map(({ folder, count, covers }) => (
          <li key={folder.id}>
            <FolderCard folder={folder} count={count} covers={covers} />
          </li>
        ))}
        {unfiledBooks.length > 0 && (
          <li>
            <FolderCard
              folder={{ id: 'sin-carpeta', name: 'Sin carpeta' }}
              count={unfiledBooks.length}
              covers={unfiledBooks.slice(0, 2)}
              to={unfiledTo}
            />
          </li>
        )}
        <NewFolderCard />
      </ul>
    </section>
  )
}
