import { FolderPlus } from 'lucide-react'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { BookRow, Button } from '../../components'
import { selectEntry, useStore } from '../../store'
import type { Book, Folder } from '../../types'
import { pinnedFirst } from './filters'
import { FolderMenu } from './FolderMenu'

export interface BookListProps {
  /** Names the list for screen readers. */
  title: string
  /** Shows the title too, as a section of its own on a page with something else. */
  showTitle?: boolean
  books: Book[]
  /** The list is filtered by status, so its rows also say where each book is filed. */
  showFolders?: boolean
  /** The folder on screen, which every row would otherwise repeat. */
  openFolderId?: string
  /** What each row offers. By default, the menu with the folders of the book. */
  rowAction?: (book: Book) => ReactNode
}

function RowFolderMenu({ book }: { book: Book }) {
  const entry = useStore(selectEntry(book.id))
  if (!entry) return null
  return (
    <FolderMenu
      book={book}
      folderIds={entry.folderIds}
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          variant="quiet"
          compact
          icon={FolderPlus}
          aria-label={`Carpetas de «${book.title}»`}
          // What goes first in a narrow row is the icon, not the text.
          className="-mr-2.5 max-[359px]:[&>svg]:hidden"
        >
          Carpetas
        </Button>
      )}
    />
  )
}

interface ListRowProps {
  book: Book
  /** Where the row says the book is filed. Undefined leaves the line out. */
  folders?: Folder[]
  action: ReactNode
}

function ListRow({ book, folders, action }: ListRowProps) {
  const entry = useStore(selectEntry(book.id))
  const names = folders?.filter(({ id }) => entry?.folderIds.includes(id)).map(({ name }) => name)
  return <BookRow book={book} folders={names} trailing={action} />
}

export function BookList({
  title,
  showTitle = false,
  books,
  showFolders = false,
  openFolderId,
  rowAction = (book) => <RowFolderMenu book={book} />,
}: BookListProps) {
  const folders = useStore((state) => state.folders)
  const otherFolders = useMemo(
    () => pinnedFirst(folders).filter(({ id }) => id !== openFolderId),
    [folders, openFolderId],
  )

  // A row can leave the list from its own menu, and the focus would fall to the top of the page.
  // React does not fire onBlur for a focused element it removes, so the ref still says so.
  const listRef = useRef<HTMLUListElement>(null)
  const hadFocus = useRef(false)
  useEffect(() => {
    if (hadFocus.current && document.activeElement === document.body) {
      listRef.current?.focus({ preventScroll: true })
    }
  }, [books])

  return (
    <section className={showTitle ? 'mt-7 lg:mt-10' : 'mt-2'}>
      <h2 className={showTitle ? 'mb-1 section-title' : 'sr-only'}>{title}</h2>
      <ul
        ref={listRef}
        tabIndex={-1}
        onFocus={() => {
          hadFocus.current = true
        }}
        onBlur={() => {
          hadFocus.current = false
        }}
        className="outline-none md:grid md:grid-cols-2 md:gap-x-8"
      >
        {books.map((book) => (
          <li
            key={book.id}
            className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
          >
            <ListRow
              book={book}
              folders={showFolders ? otherFolders : undefined}
              action={rowAction(book)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
