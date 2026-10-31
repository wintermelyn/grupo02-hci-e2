import { ArrowRight, BookOpen, UserPlus } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { BookCover, bookPath } from '../../components'
import { cx } from '../../components/cx'
import { useBookLookup } from '../../features/library/filters'
import { useStore } from '../../store'
import type { Book, LibraryEntry } from '../../types'
import { daysSince, firstName, VERB } from '../datos'
import { tonoProfundo } from './color'
import { Marca } from './Shell'
import { Cara, FilaEvento, useActividad, type Evento } from './social'

/** Decisión aprobada: Inicio muestra siempre las 5 últimas; el resto vive en su vista aparte. */
const EN_INICIO = 5

// Al volver de una ficha o de Actividad, el riel de lecturas queda donde estaba.
let rielGuardado = 0

function TarjetaLectura({
  book,
  entry,
  sola,
  amigo,
}: {
  book: Book
  entry: LibraryEntry
  sola: boolean
  amigo?: Evento
}) {
  const dias = entry.startedAt ? daysSince(entry.startedAt) : 0
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/' }}
      viewTransition
      style={{ backgroundColor: tonoProfundo(book.id) } as CSSProperties}
      className={cx(
        'group flex h-full gap-4 rounded-[20px] p-4 text-[#fff] transition-[translate] duration-200 active:translate-y-px lg:gap-5 lg:p-5',
        sola && 'lg:max-w-xl',
      )}
    >
      <span className="portada-viva block w-[6.5rem] shrink-0 lg:w-32">
        <BookCover book={book} status="reading" className="sombra-portada" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-3 font-serif text-[1.5rem]/[1.12] font-semibold tracking-[-0.02em] text-balance lg:text-[2rem]/[1.1]">
          {book.title}
        </span>
        <span className="mt-1.5 line-clamp-1 text-sm text-[#fff]/88 lg:text-base">{book.authors[0]}</span>
        <span className="mt-auto pt-3 text-sm">
          {amigo && (
            <span className="mb-1 flex items-center gap-1.5 text-[#fff]/88">
              <Cara user={amigo.user} className="size-5 text-[0.5625rem]" />
              <span className="min-w-0 truncate">
                {firstName(amigo.user.name)} {VERB[amigo.activity.kind]}
              </span>
            </span>
          )}
          <span className="block font-semibold">
            {dias === 0 ? 'Lo empezaste hoy' : `Llevas ${dias} ${dias === 1 ? 'día' : 'días'}`}
            {book.pages ? (
              <span className="hidden font-normal text-[#fff]/88 lg:inline"> · {book.pages} páginas</span>
            ) : null}
          </span>
        </span>
      </span>
    </Link>
  )
}

export function Inicio() {
  const library = useStore((state) => state.library)
  const bookOf = useBookLookup()
  const eventos = useActividad()
  const leyendo = useMemo(
    () =>
      Object.values(library)
        .filter(({ status }) => status === 'reading')
        .flatMap((entry) => {
          const book = bookOf(entry.bookId)
          return book ? [{ book, entry }] : []
        })
        .sort((a, b) => (b.entry.startedAt ?? '').localeCompare(a.entry.startedAt ?? '')),
    [library, bookOf],
  )
  const resumen = eventos.slice(0, EN_INICIO)
  const rielRef = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    if (rielRef.current) rielRef.current.scrollLeft = rielGuardado
  }, [])
  const columnas = leyendo.length >= 3 ? 'lg:grid-cols-3' : leyendo.length === 2 ? 'lg:grid-cols-2' : ''

  return (
    <section className="pt-3 lg:pt-8">
      <h1 className="sr-only">Inicio</h1>
      <Marca className="mb-2 px-(--gut)" />

      <section aria-labelledby="leyendo">
        <h2 id="leyendo" className="titulo-pagina px-(--gut)">
          Leyendo ahora
        </h2>
        {leyendo.length > 0 ? (
          <ul
            ref={rielRef}
            onScroll={(event) => (rielGuardado = event.currentTarget.scrollLeft)}
            className={cx(
              'riel-sin-barra riel-foco mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-(--gut) lg:grid lg:snap-none lg:gap-4 lg:overflow-visible',
              columnas,
            )}
          >
            {leyendo.map(({ book, entry }) => (
              <li
                key={book.id}
                className={cx(
                  'shrink-0 snap-start lg:w-auto',
                  leyendo.length === 1 ? 'w-full' : 'w-[84%] md:w-[24rem]',
                )}
              >
                <TarjetaLectura
                  book={book}
                  entry={entry}
                  sola={leyendo.length === 1}
                  amigo={eventos.find((evento) => evento.book.id === book.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-(--gut) mt-4 flex items-center gap-4 rounded-[20px] bg-shell p-5">
            <BookOpen aria-hidden className="shrink-0 text-muted" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">No estás leyendo ningún libro</p>
              <p className="text-sm text-muted">Cuando marques uno como Leyendo, va a aparecer aquí.</p>
            </div>
            <Link to="/biblioteca" className="font-semibold underline underline-offset-4">
              Ir a Mis libros
            </Link>
          </div>
        )}
      </section>

      <section aria-labelledby="amigos" className="mt-7 lg:mt-10">
        <div className="flex items-end justify-between gap-3 px-(--gut)">
          <h2 id="amigos" className="titulo-seccion">
            Tus amigos
          </h2>
          {eventos.length > EN_INICIO && (
            <Link
              to="/actividad"
              className="-my-2.5 inline-flex min-h-11 shrink-0 items-center gap-1 rounded-control text-sm font-semibold transition-[gap] duration-150 hover:gap-2 md:hidden"
            >
              Ver toda la actividad
              <ArrowRight aria-hidden size={16} />
            </Link>
          )}
        </div>
        {eventos.length > 0 ? (
          <ul className="mt-3 grid gap-1.5 px-(--gut) md:grid-cols-2 md:gap-2.5 xl:grid-cols-3">
            {resumen.map((evento) => (
              <li key={evento.activity.id} className="min-w-0">
                <FilaEvento evento={evento} />
              </li>
            ))}
            {eventos.length > EN_INICIO && (
              <li className="hidden md:block">
                <Link
                  to="/actividad"
                  className="flex h-full min-h-16 items-center justify-between gap-3 rounded-[14px] border border-edge px-4 font-semibold transition-colors duration-150 hover:bg-sand active:bg-sand-deep"
                >
                  Ver toda la actividad
                  <ArrowRight aria-hidden size={18} />
                </Link>
              </li>
            )}
          </ul>
        ) : (
          <div className="mx-(--gut) mt-3 flex items-center gap-4 rounded-[20px] bg-shell p-5">
            <UserPlus aria-hidden className="shrink-0 text-muted" />
            <p className="min-w-0 flex-1 text-muted">
              Cuando agregues amigos, aquí vas a ver qué están leyendo.
            </p>
            <Link to="/amigos" className="font-semibold underline underline-offset-4">
              Buscar amigos
            </Link>
          </div>
        )}
      </section>
    </section>
  )
}
