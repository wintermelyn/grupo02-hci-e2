import { Link } from 'react-router'
import { BookCover, folderPath, Ribbon } from '../../components'
import type { Book, Folder } from '../../types'
import { booksLabel } from './filters'

export interface FolderCardProps {
  folder: Pick<Folder, 'id' | 'name' | 'pinned'>
  /** How many books the folder has. */
  count: number
  /** The two books on the card. */
  covers: Book[]
  /** Where the card leads, when it is not a folder of its own. */
  to?: string
}

const COVER_SLOTS = [0, 1]

export function FolderCard({ folder, count, covers, to }: FolderCardProps) {
  return (
    <Link
      to={to ?? folderPath(folder.id)}
      className="relative block rounded-card border border-line bg-white p-3 transition-[border-color,translate] duration-100 hover:border-edge active:translate-y-px"
    >
      {folder.pinned && (
        <Ribbon className="absolute -top-px right-2.5 z-10 h-6.5 w-2.25 bg-ribbon" />
      )}
      <span className="grid grid-cols-2 gap-1.5">
        {COVER_SLOTS.map((slot) =>
          covers[slot] ? (
            <BookCover key={covers[slot].id} book={covers[slot]} />
          ) : (
            <span key={slot} className="aspect-2/3 rounded-[2px_3px_3px_2px] bg-sand" />
          ),
        )}
      </span>
      <span className="mt-2.5 block font-serif text-lg font-semibold">{folder.name}</span>
      <span className="block text-sm text-muted">
        {booksLabel(count)}
        {folder.pinned && ' · fija'}
      </span>
    </Link>
  )
}
