import { Bookmark } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { BookRow, EmptyState, PageHeader, TagFilter, type TagFilterValue } from '../../components'
import { STATUS_LABELS, STATUS_ORDER } from '../../lib/status'
import { useStore } from '../../store'
import type { Book, ReadingStatus } from '../../types'
import { FolderCard } from './FolderCard'

const TAG_PARAM = 'tag'

function parseTag(value: string | null): TagFilterValue {
  return STATUS_ORDER.find((status) => status === value) ?? 'all'
}

function compareTitles(a: Book, b: Book): number {
  return a.title.localeCompare(b.title, 'es-CL')
}

function TagList({ status, books }: { status: ReadingStatus; books: Book[] }) {
  const label = STATUS_LABELS[status]
  if (books.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Aún no hay libros aquí"
        description={`Cuando un libro tenga el estado «${label}», va a aparecer en esta lista.`}
      />
    )
  }
  return (
    <section className="mt-2">
      <h2 className="sr-only">{label}</h2>
      <ul className="md:grid md:grid-cols-2 md:gap-x-8">
        {books.map((book) => (
          <li key={book.id} className="border-b border-line last:border-b-0">
            <BookRow book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = parseTag(searchParams.get(TAG_PARAM))
  const library = useStore((state) => state.library)
  const folders = useStore((state) => state.folders)
  const seedBooks = useStore((state) => state.seedBooks)
  const extraBooks = useStore((state) => state.extraBooks)

  const entries = useMemo(() => Object.values(library), [library])
  const counts = useMemo(() => {
    const byTag: Record<TagFilterValue, number> = {
      all: entries.length,
      want: 0,
      owned: 0,
      reading: 0,
      read: 0,
    }
    for (const { status } of entries) byTag[status] += 1
    return byTag
  }, [entries])

  const bookOf = useMemo(() => {
    const books = { ...seedBooks, ...extraBooks }
    return (bookId: string): Book | undefined => books[bookId]
  }, [seedBooks, extraBooks])

  const taggedBooks = useMemo(() => {
    if (tag === 'all') return []
    return entries
      .filter(({ status }) => status === tag)
      .flatMap(({ bookId }) => bookOf(bookId) ?? [])
      .sort(compareTitles)
  }, [entries, tag, bookOf])

  const board = useMemo(
    () =>
      [...folders]
        .sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false))
        .map((folder) => ({
          folder,
          books: entries
            .filter(({ folderIds }) => folderIds.includes(folder.id))
            .flatMap(({ bookId }) => bookOf(bookId) ?? []),
        })),
    [folders, entries, bookOf],
  )

  // Replaces the entry, so Back leaves Mis libros instead of undoing each filter.
  function chooseTag(value: TagFilterValue) {
    setSearchParams(value === 'all' ? {} : { [TAG_PARAM]: value }, { replace: true })
  }

  return (
    <section>
      <PageHeader
        title="Mis libros"
        subtitle={
          counts.all === 1 ? '1 libro en tu biblioteca' : `${counts.all} libros en tu biblioteca`
        }
      >
        <TagFilter value={tag} counts={counts} onChange={chooseTag} />
      </PageHeader>

      {tag === 'all' ? (
        <section className="mt-5">
          <h2 className="mb-3 font-serif text-heading font-semibold">Mis carpetas</h2>
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
            {board.map(({ folder, books }) => (
              <li key={folder.id}>
                <FolderCard folder={folder} books={books} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <TagList status={tag} books={taggedBooks} />
      )}
    </section>
  )
}
