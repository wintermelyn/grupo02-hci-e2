import { useMemo } from 'react'
import { BookRow } from '../../components'
import { selectEntry, useStore } from '../../store'
import type { Book, Folder } from '../../types'
import { pinnedFirst } from './filters'

export interface BookListProps {
  /** Names the list for screen readers. */
  title: string
  books: Book[]
  /** The list is filtered by status: rows say where each book is filed, not what the filter says. */
  showFolders?: boolean
  /** The folder on screen, which every row would otherwise repeat. */
  openFolderId?: string
}

function FiledBookRow({ book, folders }: { book: Book; folders: Folder[] }) {
  const entry = useStore(selectEntry(book.id))
  const names = folders.filter(({ id }) => entry?.folderIds.includes(id)).map(({ name }) => name)
  return <BookRow book={book} folders={names} />
}

export function BookList({ title, books, showFolders = false, openFolderId }: BookListProps) {
  const folders = useStore((state) => state.folders)
  const otherFolders = useMemo(
    () => pinnedFirst(folders).filter(({ id }) => id !== openFolderId),
    [folders, openFolderId],
  )

  return (
    <section className="mt-2">
      <h2 className="sr-only">{title}</h2>
      <ul className="md:grid md:grid-cols-2 md:gap-x-8">
        {books.map((book) => (
          <li
            key={book.id}
            className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
          >
            {showFolders ? (
              <FiledBookRow book={book} folders={otherFolders} />
            ) : (
              <BookRow book={book} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
