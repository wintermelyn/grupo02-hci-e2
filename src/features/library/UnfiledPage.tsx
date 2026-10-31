import { FolderCheck } from 'lucide-react'
import { useMemo } from 'react'
import { EmptyState, PageHeader, TagFilter, type TagFilterValue } from '../../components'
import { STATUS_LABELS } from '../../lib/status'
import { useStore } from '../../store'
import { BandSearch } from './BandSearch'
import { BookList } from './BookList'
import {
  booksLabel,
  countByTag,
  LIBRARY_PATH,
  TAG_PARAM,
  UNFILED_NAME,
  useFilteredBooks,
} from './filters'
import { NoBooks } from './NoBooks'
import { useListFilters } from './useListFilters'

/**
 * The books outside every folder. On the board it looks like one more folder, so it is the same
 * page: only what acts on a real folder is missing.
 */
export function UnfiledPage() {
  const { tag, typed, query, search, setParams } = useListFilters()
  const library = useStore((state) => state.library)
  const entries = useMemo(
    () => Object.values(library).filter(({ folderIds }) => folderIds.length === 0),
    [library],
  )
  const counts = useMemo(() => countByTag(entries), [entries])
  const books = useFilteredBooks(entries, tag, query)
  const label = tag === 'all' ? undefined : STATUS_LABELS[tag]

  function chooseTag(value: TagFilterValue) {
    setParams({ [TAG_PARAM]: value === 'all' ? '' : value })
  }

  return (
    <section>
      <PageHeader
        title={UNFILED_NAME}
        subtitle="Libros fuera de tus carpetas"
        backTo={LIBRARY_PATH}
        backLabel="Mis libros"
        action={
          counts.all > 0 && (
            <BandSearch
              label={`Buscar en «${UNFILED_NAME}»`}
              placeholder={`Buscar en ${UNFILED_NAME}`}
              value={typed}
              onChange={search}
            />
          )
        }
      >
        <TagFilter value={tag} counts={counts} onChange={chooseTag} />
      </PageHeader>

      {counts.all === 0 ? (
        <EmptyState
          icon={FolderCheck}
          title="Todos tus libros tienen carpeta"
          description="Aquí aparecen los libros que no están en ninguna."
        />
      ) : (
        <>
          {/* The list changes while typing, which a screen reader would not otherwise hear. */}
          <p role="status" className="sr-only">
            {query && booksLabel(books.length)}
          </p>
          {books.length > 0 ? (
            <BookList title={label ?? 'Libros'} books={books} />
          ) : (
            <NoBooks
              name={UNFILED_NAME}
              label={label}
              query={query}
              total={counts.all}
              onShowAll={() => chooseTag('all')}
            />
          )}
        </>
      )}
    </section>
  )
}
