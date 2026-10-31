import { useMemo, useState } from 'react'
import { BookCover, bookPath, BookRow, PageHeader } from '../components'
import { useBookLookup } from '../features/library/filters'
import { useStore } from '../store'
import type { Book } from '../types'
import { LISTAS, type Lista } from './datos'
import { MODELO } from './modelo'
import { BandTabs, Sublinea } from './piezas'
import { Carrusel } from './Carrusel'
import { Link } from 'react-router'

function useListas() {
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  return useMemo(
    () =>
      LISTAS.map((lista) => ({
        ...lista,
        items: lista.books
          .filter((id) => lista.id !== 'para-ti' || !library[id])
          .flatMap((id) => bookOf(id) ?? []),
      })),
    [library, bookOf],
  )
}

type Cargada = Lista & { items: Book[] }

function LedgerBook({ book, lista }: { book: Book; lista: Cargada }) {
  const upsertBook = useStore((state) => state.upsertBook)
  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        to={bookPath(book.id)}
        state={{ from: '/descubrir' }}
        onClick={() => upsertBook(book)}
        className="-mx-2 flex items-center gap-3 rounded-control px-2 py-2 transition-colors duration-100 active:bg-shell"
      >
        <div className="w-10 shrink-0">
          <BookCover book={book} />
        </div>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 font-serif text-base/5 font-semibold">{book.title}</span>
          <span className="line-clamp-1 text-sm text-muted">
            {lista.why?.[book.id]?.replace('Porque guardas ', '') ?? book.authors[0]}
          </span>
        </span>
        {book.year && <span className="shrink-0 text-sm text-muted tabular-nums">{book.year}</span>}
      </Link>
    </li>
  )
}

export function DiscoverPage() {
  const listas = useListas()
  const [tab, setTab] = useState(listas[0].id)

  if (MODELO === 'a') {
    const lista = listas.find(({ id }) => id === tab) ?? listas[0]
    return (
      <section>
        <PageHeader title="Descubrir">
          <BandTabs
            label="Listas"
            value={tab}
            onChange={setTab}
            options={listas.map(({ id, tab: label, items }) => ({ id, label, count: items.length }))}
          />
        </PageHeader>
        <section className="mt-5">
          <h2 className="font-serif text-heading font-semibold">{lista.title}</h2>
          <Sublinea>{lista.note}</Sublinea>
          <ul className="mt-1 md:grid md:grid-cols-2 md:gap-x-8">
            {lista.items.map((book) => (
              <li
                key={book.id}
                className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
              >
                <BookRow book={book} />
              </li>
            ))}
          </ul>
        </section>
      </section>
    )
  }

  if (MODELO === 'b') {
    return (
      <section>
        <PageHeader title="Descubrir" />
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-10">
          {listas.map((lista) => (
            <Carrusel key={lista.id} lista={lista} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <PageHeader title="Descubrir" />
      <div className="md:grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
        {listas.map((lista) => (
          <section key={lista.id} className="mt-5">
            <h2 className="font-serif text-lg/snug font-semibold">{lista.title}</h2>
            <Sublinea>{lista.note}</Sublinea>
            <ul className="mt-1">
              {lista.items.map((book) => (
                <LedgerBook key={book.id} book={book} lista={lista} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
