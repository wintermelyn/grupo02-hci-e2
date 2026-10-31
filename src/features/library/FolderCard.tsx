import { Link } from 'react-router'
import { BookCover, folderPath, Ribbon } from '../../components'
import type { Book, Folder } from '../../types'

export interface FolderCardProps {
  folder: Folder
  /** Every book in the folder; the card shows the first two. */
  books: Book[]
}

const COVER_SLOTS = [0, 1]

function booksLabel(count: number): string {
  return count === 1 ? '1 libro' : `${count} libros`
}

export function FolderCard({ folder, books }: FolderCardProps) {
  return (
    <Link
      to={folderPath(folder.id)}
      className="relative block rounded-card bg-white p-3 shadow-card transition-[background-color,box-shadow,translate] duration-100 hover:bg-shell active:translate-y-px active:shadow-none"
    >
      {folder.pinned && <Ribbon className="absolute top-0 right-2.5 h-6.5 w-2.25 bg-ribbon" />}
      <span className="grid grid-cols-2 gap-1.5">
        {COVER_SLOTS.map((slot) =>
          books[slot] ? (
            <BookCover key={books[slot].id} book={books[slot]} />
          ) : (
            <span key={slot} className="aspect-2/3 rounded-[2px_3px_3px_2px] bg-shell" />
          ),
        )}
      </span>
      <span className="mt-2.5 block font-serif text-lg font-semibold">{folder.name}</span>
      <span className="block text-sm text-muted">
        {booksLabel(books.length)}
        {folder.pinned && ' · fija'}
      </span>
    </Link>
  )
}
