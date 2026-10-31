import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { BookCover } from '../../components'
import { cx } from '../../components/cx'
import type { Book } from '../../types'
import { tonoProfundo } from './color'
import { useListas } from './listas'
import { datosDe, EnlaceLibro, SIN_DESCRIPCION } from './PiezasLibro'
import { Marca } from './Shell'
import { useRiel } from './useRiel'

const calma = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/** La lista va tres veces: se mira la del medio y las otras dos son el camino para seguir. */
const COPIAS = 3
const ASENTAR_MS = 120

/**
 * Una zona de borde de altura completa, siempre presente. Tapa la portada vecina, así que apuntar
 * a la flecha nunca cae en un libro, ni en un clic rápido ni con el carrusel en movimiento.
 */
function ZonaFlecha({
  direccion,
  onClick,
}: {
  direccion: 'atras' | 'adelante'
  onClick: () => void
}) {
  const Icono = direccion === 'atras' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={direccion === 'atras' ? 'Libro anterior' : 'Libro siguiente'}
      tabIndex={-1}
      onClick={onClick}
      className={cx(
        'group absolute inset-y-0 z-20 hidden w-20 cursor-pointer select-none items-center pointer-fine:flex lg:w-24',
        direccion === 'atras' ? 'left-0 justify-start pl-3' : 'right-0 justify-end pr-3',
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_1px_2px_rgb(30_25_21/18%),0_8px_20px_-8px_rgb(30_25_21/40%)] ring-1 ring-ink/8 transition-[background-color,color,scale] duration-150 group-hover:scale-105 group-hover:bg-ink group-hover:text-white group-active:scale-95">
        <Icono aria-hidden size={22} strokeWidth={2.25} />
      </span>
    </button>
  )
}

/** La vitrina de D sobre el papel de E, y sin fin: después del último libro sigue el primero. */
export function DiscoverG() {
  const listas = useListas()
  const [listaId, setListaId] = useState(listas[0].id)
  const lista = listas.find(({ id }) => id === listaId) ?? listas[0]
  const total = lista.items.length
  const infinito = total > 1
  const copias = infinito ? COPIAS : 1
  const inicial = infinito ? total : 0

  const { ref: rielRef, rielProps } = useRiel<HTMLUListElement>()
  // Dónde va el carrusel, contando las tres copias. El libro real es ese número módulo el total.
  const [cruda, setCruda] = useState(inicial)
  const crudaRef = useRef(inicial)
  const programado = useRef(false)
  const tocando = useRef(false)
  const reloj = useRef<ReturnType<typeof setTimeout>>(undefined)

  const posicion = total ? ((cruda % total) + total) % total : 0
  const book: Book | undefined = lista.items[posicion]

  const paso = () => rielRef.current?.children[0]?.getBoundingClientRect().width ?? 0

  const fijar = useCallback((valor: number) => {
    crudaRef.current = valor
    setCruda(valor)
  }, [])

  /** Mueve el carrusel una vuelta entera sin que se note: las portadas de ambos lados son iguales. */
  function saltar(vueltas: number) {
    const riel = rielRef.current
    if (!riel || !vueltas) return
    const conFoco = riel.contains(document.activeElement)
    riel.style.scrollSnapType = 'none'
    riel.scrollLeft += vueltas * total * paso()
    crudaRef.current += vueltas * total
    if (conFoco) {
      riel.children[crudaRef.current]?.querySelector('a')?.focus({ preventScroll: true })
    }
  }

  function asentar() {
    const riel = rielRef.current
    const ancho = paso()
    if (!riel || !ancho || tocando.current || riel.classList.contains('arrastrando')) return
    const actual = Math.round(riel.scrollLeft / ancho)
    crudaRef.current = actual
    programado.current = false
    if (infinito) saltar(actual >= 2 * total ? -1 : actual < total ? 1 : 0)
    setCruda(crudaRef.current)
    requestAnimationFrame(() => {
      if (!programado.current) riel.style.scrollSnapType = ''
    })
  }

  function esperarQuietud() {
    clearTimeout(reloj.current)
    reloj.current = setTimeout(asentar, ASENTAR_MS)
  }

  function avanzar(direccion: 1 | -1, enfocar = false) {
    const riel = rielRef.current
    const ancho = paso()
    if (!riel || !ancho || !infinito) return
    const destino = crudaRef.current + direccion
    // En clics seguidos, la vuelta se da antes de avanzar: siempre queda camino por delante.
    if (destino >= 2 * total) saltar(-1)
    else if (destino < total) saltar(1)
    const siguiente = crudaRef.current + direccion
    programado.current = true
    fijar(siguiente)
    riel.scrollTo({ left: siguiente * ancho, behavior: calma() ? 'auto' : 'smooth' })
    if (enfocar) {
      riel.children[siguiente]?.querySelector('a')?.focus({ preventScroll: true })
    }
    esperarQuietud()
  }

  function alDesplazar() {
    rielProps.onScroll()
    const riel = rielRef.current
    const ancho = paso()
    if (!riel || !ancho) return
    if (!programado.current) {
      const actual = Math.round(riel.scrollLeft / ancho)
      if (actual !== crudaRef.current) fijar(actual)
    }
    esperarQuietud()
  }

  function alTeclear(event: KeyboardEvent) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    avanzar(event.key === 'ArrowRight' ? 1 : -1, true)
  }

  // Otra lista parte en su primer libro, sin animar. La imagen se decodifica de una vez: al dar la
  // vuelta aparece otra copia, y no puede quedar un cuadro en blanco.
  useLayoutEffect(() => {
    const riel = rielRef.current
    fijar(inicial)
    programado.current = false
    if (!riel) return
    riel.style.scrollSnapType = 'none'
    riel.scrollLeft = inicial * paso()
    riel.querySelectorAll('img').forEach((imagen) => {
      imagen.decoding = 'sync'
      imagen.loading = 'eager'
    })
    requestAnimationFrame(() => {
      riel.style.scrollSnapType = ''
    })
  }, [listaId, total, inicial, fijar, rielRef])

  useEffect(() => {
    const riel = rielRef.current
    if (!riel) return
    const realinear = new ResizeObserver(() => {
      riel.style.scrollSnapType = 'none'
      riel.scrollLeft = crudaRef.current * paso()
      requestAnimationFrame(() => {
        riel.style.scrollSnapType = ''
      })
    })
    realinear.observe(riel)
    return () => {
      realinear.disconnect()
      clearTimeout(reloj.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rielRef])

  const estilo = { '--tono': book ? tonoProfundo(book.id) : 'var(--color-sand)' } as CSSProperties
  const piezas = Array.from({ length: copias }, (_, copia) =>
    lista.items.map((item, i) => ({ item, cruda: copia * total + i })),
  ).flat()

  return (
    <section style={estilo} className="px-(--gut) pt-2 lg:pt-7">
      <header className="flex flex-wrap items-center gap-x-8 gap-y-2 lg:gap-y-3">
        <div className="flex w-full items-center justify-between gap-3 lg:w-auto">
          <h1 className="titulo-pagina">Descubrir</h1>
          <Marca />
        </div>
        {/* Sin scroll: las cuatro listas caben siempre, con la misma letra y el mismo tratamiento. */}
        <div
          role="group"
          aria-label="Listas"
          className="flex w-full gap-0.5 rounded-full bg-sand p-1 lg:w-auto lg:gap-1"
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
                  'min-h-11 flex-auto rounded-full px-1 text-sm font-semibold transition-colors duration-150 sm:px-3 lg:px-5 lg:text-base',
                  elegida ? 'bg-ink text-white' : 'text-ink hover:bg-sand-deep active:bg-sand-dark',
                )}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </header>

      {book ? (
        <div className="mt-2.5 lg:mt-6 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-x-10">
          <div className="min-w-0 lg:col-start-2 lg:row-start-1">
            <div className="g-escena relative overflow-hidden rounded-[24px] [--ancho:max(5rem,min(46vw,calc((100dvh-27.75rem)/1.5)))] sm:[--ancho:min(30vw,calc((100dvh-27rem)/1.5))] lg:[--ancho:min(23vw,44vh,21rem)]">
              <ul
                ref={rielRef}
                {...rielProps}
                onScroll={alDesplazar}
                onKeyDown={alTeclear}
                onTouchStart={() => (tocando.current = true)}
                onTouchEnd={() => {
                  tocando.current = false
                  esperarQuietud()
                }}
                onTouchCancel={() => {
                  tocando.current = false
                  esperarQuietud()
                }}
                aria-label={`Libros de ${lista.title}`}
                className="riel-sin-barra flex snap-x snap-mandatory items-center overflow-x-auto py-3 sm:py-5 lg:cursor-grab lg:py-7"
                style={{ paddingInline: 'calc(50% - var(--ancho) / 2)' }}
              >
                {piezas.map(({ item, cruda: lugar }) => {
                  const frente = lugar === cruda
                  return (
                    <li
                      key={lugar}
                      aria-hidden={!frente || undefined}
                      className="w-(--ancho) shrink-0 snap-center snap-always"
                    >
                      <EnlaceLibro
                        book={item}
                        aria-label={`${item.title}, ${item.authors[0]}`}
                        tabIndex={frente ? 0 : -1}
                        data-activo={frente}
                        className="g-pieza block rounded-[6px] outline-offset-4"
                      >
                        <BookCover book={item} className="sombra-portada" />
                      </EnlaceLibro>
                    </li>
                  )
                })}
              </ul>
              {infinito && (
                <>
                  <ZonaFlecha direccion="atras" onClick={() => avanzar(-1)} />
                  <ZonaFlecha direccion="adelante" onClick={() => avanzar(1)} />
                </>
              )}
            </div>
          </div>

          <div className="mt-2 min-w-0 sm:mt-4 lg:col-start-1 lg:row-start-1 lg:mt-0">
            <h2 className="text-sm font-semibold text-muted lg:text-base">
              {lista.title}
              <span className="hidden font-normal sm:inline"> · {lista.note}</span>
            </h2>
            <div key={book.id} className="animate-tag-in">
              <EnlaceLibro
                book={book}
                tabIndex={-1}
                className="mt-0.5 flex min-h-[3.25rem] items-start font-serif text-[1.375rem]/[1.15] font-semibold tracking-[-0.02em] text-balance sm:min-h-11 sm:text-[1.75rem]/[1.12] lg:mt-2 lg:text-[2.75rem]/[1.06]"
              >
                <span className="line-clamp-2 lg:line-clamp-3">{book.title}</span>
              </EnlaceLibro>
              <p className="mt-1 truncate text-sm text-muted lg:mt-3 lg:text-base">{datosDe(book)}</p>
              {lista.why?.[book.id] && (
                <p className="text-sm font-semibold text-ribbon lg:mt-1 lg:text-base">
                  {lista.why[book.id]}
                </p>
              )}
              <p className="mt-1 line-clamp-2 min-h-[2.75rem] max-w-[60ch] text-[0.9375rem]/[1.45] text-muted sm:line-clamp-3 sm:min-h-0 lg:mt-3 lg:line-clamp-7 lg:text-base/relaxed">
                {book.description ?? SIN_DESCRIPCION}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 lg:mt-5 lg:justify-start">
              <EnlaceLibro
                book={book}
                aria-label={`Ver ficha de ${book.title}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white transition-[scale,opacity] duration-150 hover:opacity-90 active:scale-[.98] lg:min-h-12 lg:px-6"
              >
                Ver ficha
                <ArrowRight aria-hidden size={18} />
              </EnlaceLibro>
              <p aria-live="polite" className="text-sm font-semibold text-muted tabular-nums">
                {posicion + 1} de {total}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="titulo-seccion">{lista.title}</h2>
          <p className="mt-2 text-muted">
            Ya guardaste todos estos libros. Vuelve cuando agregues más a tu biblioteca.
          </p>
        </div>
      )}
    </section>
  )
}
