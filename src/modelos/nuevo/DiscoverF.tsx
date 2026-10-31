import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { cx } from '../../components/cx'
import type { Book } from '../../types'
import { tonoProfundo } from './color'
import { useListas, type ListaCargada } from './listas'
import { datosDe, EnlaceLibro, Portada, SIN_DESCRIPCION } from './PiezasLibro'
import { Marca } from './Shell'

const TODO = 'todo'

interface Pieza {
  book: Book
  lista: ListaCargada
}

/** Una de cada lista, por turnos: así ninguna queda arriba de otra en la mesa. */
function intercalar(listas: ListaCargada[]): Pieza[] {
  const piezas: Pieza[] = []
  const mayor = Math.max(...listas.map(({ items }) => items.length))
  for (let i = 0; i < mayor; i++) {
    for (const lista of listas) {
      const book = lista.items[i]
      if (book) piezas.push({ book, lista })
    }
  }
  return piezas
}

function Vista({ pieza }: { pieza: Pieza }) {
  const { book, lista } = pieza
  return (
    <aside
      aria-label="Vista previa"
      style={{ backgroundColor: tonoProfundo(book.id) }}
      className="sticky top-6 flex max-h-[calc(100dvh-3rem)] flex-col rounded-[20px] p-6 text-[#fff] transition-[background-color] duration-300"
    >
      <div key={book.id} className="flex min-h-0 flex-1 animate-tag-in flex-col overflow-hidden">
        <div className="w-[min(11rem,24vh)] shrink-0">
          <Portada book={book} />
        </div>
        <p className="mt-5 text-sm font-semibold text-[#fff]/88">{lista.title}</p>
        <h2 className="mt-1 font-serif text-[1.75rem]/[1.12] font-semibold tracking-[-0.02em] text-balance">
          {book.title}
        </h2>
        <p className="mt-1.5 text-sm text-[#fff]/88">{datosDe(book)}</p>
        {lista.why?.[book.id] && <p className="mt-1.5 text-sm font-semibold">{lista.why[book.id]}</p>}
        <p className="mt-3 line-clamp-4 text-[0.9375rem]/[1.45] text-[#fff]/88">
          {book.description ?? SIN_DESCRIPCION}
        </p>
      </div>
      <EnlaceLibro
        book={book}
        tabIndex={-1}
        aria-label={`Ver ficha de ${book.title}`}
        className="mt-5 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-[#fff] px-6 font-semibold text-[#17120f] transition-opacity duration-150 hover:opacity-90"
      >
        Ver ficha
        <ArrowRight aria-hidden size={18} />
      </EnlaceLibro>
    </aside>
  )
}

/** Una mesa de librería: todos los libros a la vista, sin rieles. Filtrar reordena la mesa. */
export function DiscoverF() {
  const listas = useListas()
  const [filtro, setFiltro] = useState(TODO)
  const piezas = useMemo(
    () => intercalar(filtro === TODO ? listas : listas.filter(({ id }) => id === filtro)),
    [listas, filtro],
  )
  const [vistaId, setVistaId] = useState<string>()
  const vista = piezas.find(({ book }) => book.id === vistaId) ?? piezas[0]

  function filtrar(id: string) {
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || quieto) {
      setFiltro(id)
      return
    }
    document.startViewTransition(() => flushSync(() => setFiltro(id)))
  }

  const total = listas.reduce((suma, { items }) => suma + items.length, 0)
  const opciones = [
    { id: TODO, tab: 'Todo', cantidad: total },
    ...listas.map(({ id, tab, items }) => ({ id, tab, cantidad: items.length })),
  ]
  const elegida = listas.find(({ id }) => id === filtro)

  return (
    <section className="px-(--gut) pt-3 lg:pt-8">
      <Marca className="mb-2" />
      <h1 className="titulo-pagina">Descubrir</h1>

      <div className="mt-4 xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8 lg:mt-5 2xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0">
          <div className="sticky top-0 z-20 -mx-(--gut) bg-paper/92 px-(--gut) py-2 backdrop-blur-xl xl:mx-0 xl:px-0">
            <div role="group" aria-label="Filtrar por lista" className="riel-sin-barra -mx-(--gut) flex gap-1.5 overflow-x-auto px-(--gut) xl:mx-0 xl:px-0">
              {opciones.map(({ id, tab, cantidad }) => {
                const activa = id === filtro
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={activa}
                    onClick={() => filtrar(id)}
                    className={cx(
                      'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 font-semibold transition-colors duration-150',
                      activa
                        ? 'border-ink bg-ink text-white'
                        : 'border-edge bg-transparent text-ink hover:bg-sand active:bg-sand-deep',
                    )}
                  >
                    {tab}
                    <span className={cx('text-sm tabular-nums', activa ? 'text-white' : 'text-muted')}>{cantidad}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {elegida && (
            <div className="mt-3">
              <h2 className="titulo-seccion">{elegida.title}</h2>
              <p className="text-sm text-muted">{elegida.note}</p>
            </div>
          )}

          <ul className="f-mesa mt-4 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5 xl:grid-cols-4 2xl:grid-cols-5 md:[&>li:nth-child(even)]:translate-y-7 md:pb-7">
            {piezas.map((pieza) => {
              const { book, lista } = pieza
              return (
                <li
                  key={book.id}
                  style={{ viewTransitionName: `mesa-${book.id}` }}
                >
                  <EnlaceLibro
                    book={book}
                    onPointerEnter={(event) => event.pointerType === 'mouse' && setVistaId(book.id)}
                    onFocus={() => setVistaId(book.id)}
                    className="block rounded-[6px]"
                  >
                    <span className="portada-viva f-imagen block">
                      <Portada book={book} />
                    </span>
                    <span className="mt-2.5 line-clamp-2 font-serif text-base/[1.25] font-semibold">
                      {book.title}
                    </span>
                    <span className="block truncate text-sm text-muted">{book.authors[0]}</span>
                    {lista.why?.[book.id] && (
                      <span className="block text-sm font-semibold text-ribbon">
                        {lista.why[book.id].replace('Porque guardas ', 'Por ')}
                      </span>
                    )}
                  </EnlaceLibro>
                </li>
              )
            })}
          </ul>
          {piezas.length === 0 && (
            <p className="mt-6 text-muted">
              Ya guardaste todos estos libros. Vuelve cuando agregues más a tu biblioteca.
            </p>
          )}
        </div>

        <div className="hidden xl:block">{vista && <Vista pieza={vista} />}</div>
      </div>
    </section>
  )
}
