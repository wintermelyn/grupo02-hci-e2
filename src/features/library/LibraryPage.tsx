import { Bookmark } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { EmptyState, PageHeader, TagFilter, type TagFilterValue } from '../../components'
import { STATUS_LABELS } from '../../lib/status'
import { useStore } from '../../store'
import type { Book, ReadingStatus } from '../../types'
import { BookList } from './BookList'
import {
  booksLabel,
  compareTitles,
  countByTag,
  parseTag,
  pinnedFirst,
  TAG_PARAM,
  useBookLookup,
} from './filters'
import { FolderCard } from './FolderCard'

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
  return <BookList title={label} books={books} />
}

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = parseTag(searchParams.get(TAG_PARAM))
  const library = useStore((state) => state.library)
  const folders = useStore((state) => state.folders)
  const bookOf = useBookLookup()

  const entries = useMemo(() => Object.values(library), [library])
  const counts = useMemo(() => countByTag(entries), [entries])

  const taggedBooks = useMemo(() => {
    if (tag === 'all') return []
    return entries
      .filter(({ status }) => status === tag)
      .flatMap(({ bookId }) => bookOf(bookId) ?? [])
      .sort(compareTitles)
  }, [entries, tag, bookOf])

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

  // Replaces the entry, so Back leaves Mis libros instead of undoing each filter.
  function chooseTag(value: TagFilterValue) {
    setSearchParams(value === 'all' ? {} : { [TAG_PARAM]: value }, { replace: true })
  }

  return (
    <section>
      <PageHeader title="Mis libros" subtitle={`${booksLabel(counts.all)} en tu biblioteca`}>
        <TagFilter value={tag} counts={counts} onChange={chooseTag} />
      </PageHeader>

      {tag === 'all' ? (
        <section className="mt-5">
          <h2 className="mb-3 font-serif text-heading font-semibold">Mis carpetas</h2>
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
            {board.map(({ folder, count, covers }) => (
              <li key={folder.id}>
                <FolderCard folder={folder} count={count} covers={covers} />
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
