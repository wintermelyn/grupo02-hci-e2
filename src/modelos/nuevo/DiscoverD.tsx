import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { BookCover } from '../../components'
import { cx } from '../../components/cx'
import type { Book } from '../../types'
import { tonoProfundo } from './color'
import { useListas } from './listas'
import { datosDe, EnlaceLibro, SIN_DESCRIPCION } from './PiezasLibro'
import { Marca } from './Shell'

const calma = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function Pieza({
  book,
  activa,
  onFocus,
}: {
  book: Book
  activa: boolean
  onFocus: () => void
}) {
  return (
    <li className="w-(--ancho) shrink-0 snap-center">
      <EnlaceLibro
        book={book}
        aria-label={`${book.title}, ${book.authors[0]}`}
        tabIndex={activa ? 0 : -1}
        onFocus={onFocus}
        data-activo={activa}
        className="d-pieza block rounded-[6px] outline-offset-4"
      >
        <BookCover book={book} className="sombra-portada" />
      </EnlaceLibro>
    </li>
  )
}

/** Como la vitrina de Steam: un libro al frente, sus vecinos a la vista y el color del libro de fondo. */
export function DiscoverD() {
  const listas = useListas()
  const [listaId, setListaId] = useState(listas[0].id)
  const [indice, setIndice] = useState(0)
  const rielRef = useRef<HTMLUListElement>(null)
  const lista = listas.find(({ id }) => id === listaId) ?? listas[0]
  const total = lista.items.length
  const posicion = Math.min(indice, Math.max(total - 1, 0))
  const book: Book | undefined = lista.items[posicion]

  function irA(siguiente: number, enfocar = false) {
    const riel = rielRef.current
    const destino = riel?.children[siguiente] as HTMLElement | undefined
    if (!riel || !destino) return
    riel.scrollTo({
      left: destino.offsetLeft - (riel.clientWidth - destino.offsetWidth) / 2,
      behavior: calma() ? 'auto' : 'smooth',
    })
    setIndice(siguiente)
    if (enfocar) destino.querySelector('a')?.focus({ preventScroll: true })
  }

  function alDesplazar() {
    const riel = rielRef.current
    if (!riel) return
    const centro = riel.scrollLeft + riel.clientWidth / 2
    let mejor = 0
    let distancia = Infinity
    ;[...riel.children].forEach((hijo, i) => {
      const el = hijo as HTMLElement
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centro)
      if (d < distancia) {
        distancia = d
        mejor = i
      }
    })
    setIndice(mejor)
  }

  function alTeclear(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' && posicion < total - 1) {
      event.preventDefault()
      irA(posicion + 1, true)
    }
    if (event.key === 'ArrowLeft' && posicion > 0) {
      event.preventDefault()
      irA(posicion - 1, true)
    }
  }

  // Otra lista parte en su primer libro, sin animar el regreso.
  useEffect(() => {
    rielRef.current?.scrollTo({ left: 0 })
    setIndice(0)
  }, [listaId])

  const estilo = { '--tono': book ? tonoProfundo(book.id) : 'var(--color-shell)' } as CSSProperties

  return (
    <section style={estilo} className="d-escena flow-root min-h-dvh text-[#fff] lg:min-h-dvh">
      <div className="flex min-h-dvh flex-col pt-3 pb-28 lg:pt-7 lg:pb-8">
        <header className="px-(--gut)">
          <Marca className="mb-2 [&_*]:text-[#fff]" />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <h1 className="titulo-pagina">Descubrir</h1>
            <div
              role="group"
              aria-label="Listas"
              className="riel-sin-barra -mx-(--gut) flex gap-1 overflow-x-auto px-(--gut) lg:mx-0 lg:px-0"
            >
              {listas.map(({ id, tab }) => {
                const elegida = id === lista.id
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={elegida}
                    onClick={() => setListaId(id)}
                    className={cx(
                      'min-h-11 shrink-0 rounded-full px-4 font-semibold transition-colors duration-150',
                      elegida ? 'bg-[#fff] text-[#17120f]' : 'text-[#fff] hover:bg-[#fff]/14 active:bg-[#fff]/22',
                    )}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        {book ? (
          <div className="mt-4 flex flex-1 flex-col lg:mt-2 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-4">
            <div className="relative order-2 min-w-0 px-(--gut) pt-3 lg:order-1 lg:pt-0 lg:pr-0">
              <div key={book.id} className="animate-tag-in">
                <h2 className="text-sm font-semibold text-[#fff]/88">{lista.title}</h2>
                <EnlaceLibro
                  book={book}
                  tabIndex={-1}
                  className="mt-1 flex min-h-11 items-center font-serif text-[1.75rem]/[1.12] font-semibold tracking-[-0.025em] text-balance lg:text-5xl/[1.06]"
                >
                  <span className="line-clamp-3">{book.title}</span>
                </EnlaceLibro>
                <p className="mt-2 text-sm text-[#fff]/88 lg:text-base">{datosDe(book)}</p>
                {lista.why?.[book.id] && (
                  <p className="mt-2 font-semibold">{lista.why[book.id]}</p>
                )}
                <p className="mt-2 line-clamp-3 max-w-[56ch] text-[#fff]/88 lg:mt-4 lg:line-clamp-5">
                  {book.description ?? SIN_DESCRIPCION}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 lg:justify-start">
                <EnlaceLibro
                  book={book}
                  aria-label={`Ver ficha de ${book.title}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#fff] px-6 font-semibold text-[#17120f] transition-[scale,opacity] duration-150 hover:opacity-90 active:scale-[.98]"
                >
                  Ver ficha
                  <ArrowRight aria-hidden size={18} />
                </EnlaceLibro>
                <p aria-live="polite" className="text-sm font-semibold tabular-nums text-[#fff]/88">
                  {posicion + 1} de {total}
                </p>
              </div>
            </div>

            <div
              className="relative order-1 min-w-0 lg:order-2 [--ancho:min(46vw,170px,27vh)] sm:[--ancho:min(34vw,240px)] lg:[--ancho:min(23vw,44vh,320px)]"
            >
              <ul
                ref={rielRef}
                onScroll={alDesplazar}
                onKeyDown={alTeclear}
                aria-label={`Libros de ${lista.title}`}
                className="riel-sin-barra flex snap-x snap-mandatory items-center gap-0 overflow-x-auto py-4 lg:py-8"
                style={{ paddingInline: 'calc(50% - var(--ancho) / 2)' }}
              >
                {lista.items.map((item, i) => (
                  <Pieza key={item.id} book={item} activa={i === posicion} onFocus={() => i !== posicion && irA(i)} />
                ))}
              </ul>
              <button
                type="button"
                aria-label="Libro anterior"
                tabIndex={-1}
                disabled={posicion === 0}
                onClick={() => irA(posicion - 1)}
                className="group absolute inset-y-0 left-0 hidden w-24 items-center justify-center pointer-fine:flex disabled:pointer-events-none disabled:opacity-0"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-[#17120f]/72 transition-colors duration-150 group-hover:bg-[#fff] group-hover:text-[#17120f]">
                  <ChevronLeft aria-hidden size={28} />
                </span>
              </button>
              <button
                type="button"
                aria-label="Libro siguiente"
                tabIndex={-1}
                disabled={posicion === total - 1}
                onClick={() => irA(posicion + 1)}
                className="group absolute inset-y-0 right-0 hidden w-24 items-center justify-center pointer-fine:flex disabled:pointer-events-none disabled:opacity-0"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-[#17120f]/72 transition-colors duration-150 group-hover:bg-[#fff] group-hover:text-[#17120f]">
                  <ChevronRight aria-hidden size={28} />
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="px-(--gut) pt-10">
            <h2 className="titulo-seccion">{lista.title}</h2>
            <p className="mt-2 text-[#fff]/88">
              Ya guardaste todos estos libros. Vuelve cuando agregues más a tu biblioteca.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
