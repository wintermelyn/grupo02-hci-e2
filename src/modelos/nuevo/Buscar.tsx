import { ArrowRight, CircleAlert, History, RotateCcw, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { BookCover, bookPath, ErrorState, StatusTag } from '../../components'
import { cx } from '../../components/cx'
import { matchesQuery, normalizeText, useBookLookup } from '../../features/library/filters'
import { selectEntry, useStore } from '../../store'
import type { Book } from '../../types'
import { firstName } from '../datos'
import { tonoProfundo } from './color'
import { Flecha } from './Flecha'
import { Marca } from './Shell'
import { Cara } from './social'
import { useRiel } from './useRiel'

const CLAVE_RECIENTES = 'gr-e2-buscados'
const MAX_RECIENTES = 4

interface Autor {
  name: string
  libros: Book[]
}

function leerRecientes(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_RECIENTES) ?? '[]')
  } catch {
    return []
  }
}

function agrupar(libros: Book[]): Autor[] {
  const porNombre = new Map<string, Book[]>()
  for (const libro of libros) {
    const nombre = libro.authors[0]
    if (nombre) porNombre.set(nombre, [...(porNombre.get(nombre) ?? []), libro])
  }
  return [...porNombre]
    .map(([name, lista]) => ({ name, libros: lista }))
    .sort((a, b) => b.libros.length - a.libros.length || a.name.localeCompare(b.name, 'es'))
}

function distancia(a: string, b: string): number {
  let fila = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const nueva = [i]
    for (let j = 1; j <= b.length; j++) {
      nueva[j] = Math.min(fila[j] + 1, nueva[j - 1] + 1, fila[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    fila = nueva
  }
  return fila[b.length]
}

/** "stephen kng" encuentra a Stephen King: compara con cada autor y título del catálogo. */
function sugerencia(texto: string, libros: Book[]): string | undefined {
  const buscado = normalizeText(texto)
  const candidatos = [...new Set(libros.flatMap(({ title, authors }) => [title, ...authors]))]
  let mejor: string | undefined
  let menor = Math.max(2, Math.floor(buscado.length / 3)) + 1
  for (const candidato of candidatos) {
    const nombre = normalizeText(candidato)
    const opciones = [nombre, ...nombre.split(/\s+/)]
    const d = Math.min(...opciones.map((opcion) => distancia(buscado, opcion)))
    if (d < menor) {
      menor = d
      mejor = candidato
    }
  }
  return mejor
}

function Resaltado({ texto, busca }: { texto: string; busca: string }) {
  const limpio = normalizeText(busca)
  const base = texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  const inicio = limpio ? base.indexOf(limpio) : -1
  if (inicio < 0 || base.length !== texto.length) return <>{texto}</>
  return (
    <>
      {texto.slice(0, inicio)}
      <mark className="rounded-[3px] bg-sand-deep text-inherit">{texto.slice(inicio, inicio + limpio.length)}</mark>
      {texto.slice(inicio + limpio.length)}
    </>
  )
}

function FilaLibro({ book, busca, onAbrir }: { book: Book; busca: string; onAbrir: () => void }) {
  const entry = useStore(selectEntry(book.id))
  const upsertBook = useStore((state) => state.upsertBook)
  return (
    <li>
      <Link
        to={bookPath(book.id)}
        state={{ from: `/buscar?q=${encodeURIComponent(busca)}` }}
        viewTransition
        data-resultado
        onClick={() => {
          upsertBook(book)
          onAbrir()
        }}
        className="flex items-center gap-3.5 rounded-[12px] p-2 transition-colors duration-100 hover:bg-shell active:bg-sand"
      >
        <span className="w-11 shrink-0">
          <BookCover book={book} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 font-serif text-[1.0625rem]/snug font-semibold">
            <Resaltado texto={book.title} busca={busca} />
          </span>
          <span className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
            {entry && <StatusTag status={entry.status} size="sm" />}
            <span>
              <Resaltado texto={book.authors[0] ?? ''} busca={busca} />
            </span>
          </span>
        </span>
      </Link>
    </li>
  )
}

function TarjetaAutor({ autor, onElegir, grande = false }: { autor: Autor; onElegir: () => void; grande?: boolean }) {
  const [primero, segundo] = autor.libros
  const cantidad = autor.libros.length
  return (
    <button
      type="button"
      data-resultado
      onClick={onElegir}
      style={{ backgroundColor: tonoProfundo(primero.id) }}
      className={cx(
        'relative isolate flex w-full flex-col overflow-hidden rounded-[16px] p-3.5 text-left text-[#fff] transition-[translate] duration-150 hover:-translate-y-0.5 active:translate-y-px',
        grande ? 'h-full min-h-56 p-5' : 'h-36 lg:h-40',
      )}
    >
      <span className={cx('block font-serif font-semibold text-balance', grande ? 'text-[2rem]/[1.1] tracking-[-0.02em]' : 'text-lg/[1.15] lg:text-xl/[1.15]')}>
        {autor.name}
      </span>
      <span className="mt-auto block text-sm text-[#fff]/88">
        {cantidad} {cantidad === 1 ? 'libro' : 'libros'}
      </span>
      {segundo && (
        <span className={cx('absolute rotate-[9deg]', grande ? 'right-3 -bottom-24 w-32' : '-right-3 -bottom-14 w-[4.25rem] lg:-bottom-16 lg:w-20')}>
          <BookCover book={segundo} />
        </span>
      )}
      <span className={cx('absolute -rotate-[7deg]', grande ? 'right-24 -bottom-20 w-36' : 'right-7 -bottom-12 w-[4.25rem] lg:right-8 lg:-bottom-14 lg:w-20')}>
        <BookCover book={primero} className="sombra-portada" />
      </span>
    </button>
  )
}

function Tarjetas({ titulo, autores, onElegir }: { titulo: string; autores: Autor[]; onElegir: (nombre: string) => void }) {
  return (
    <section className="mt-7 px-(--gut)">
      <h2 className="titulo-seccion">{titulo}</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-4">
        {autores.map((autor) => (
          <li key={autor.name}>
            <TarjetaAutor autor={autor} onElegir={() => onElegir(autor.name)} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function RielAmigos({ libros }: { libros: { book: Book; quien: ReactNode; nombre: string }[] }) {
  const { ref, puedeAtras, puedeAdelante, avanzar, rielProps } = useRiel<HTMLUListElement>()
  return (
    <section className="group/estante mt-8">
      <h2 className="titulo-seccion px-(--gut)">Lo que leen tus amigos</h2>
      <div className="relative">
        <ul ref={ref} {...rielProps} className="riel-sin-barra mt-3 flex snap-x scroll-pl-(--gut) gap-3.5 overflow-x-auto px-(--gut) pt-1.5 pb-3 lg:cursor-grab lg:gap-4">
          {libros.map(({ book, quien, nombre }) => (
            <li key={book.id} className="w-28 shrink-0 snap-start lg:w-36">
              <Link to={bookPath(book.id)} state={{ from: '/buscar' }} viewTransition className="block rounded-[6px]">
                <span className="portada-viva block">
                  <BookCover book={book} className="sombra-portada" />
                </span>
                <span className="mt-2 line-clamp-2 font-serif text-[0.9375rem]/[1.2] font-semibold">{book.title}</span>
                <span className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  {quien}
                  <span className="truncate">{nombre}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Flecha direccion="atras" etiqueta="Ver libros anteriores" onClick={() => avanzar(-1)} visible={puedeAtras} className="top-20 left-3" />
        <Flecha direccion="adelante" etiqueta="Ver más libros" onClick={() => avanzar(1)} visible={puedeAdelante} className="top-20 right-4" />
      </div>
    </section>
  )
}

function Esqueleto() {
  return (
    <ul role="status" aria-label="Buscando" className="mt-4 grid animate-pulse gap-3 px-(--gut) md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-3.5">
          <span className="block h-[4.125rem] w-11 rounded-[3px] bg-sand" />
          <span className="flex-1">
            <span className="block h-4 w-3/4 rounded-[4px] bg-sand" />
            <span className="mt-2 block h-3 w-1/2 rounded-[4px] bg-sand" />
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Buscar() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const forzado = params.get('estado')
  const seedBooks = useStore((state) => state.seedBooks)
  const library = useStore((state) => state.library)
  const activities = useStore((state) => state.activities)
  const users = useStore((state) => state.users)
  const bookOf = useBookLookup()
  const navigate = useNavigate()
  const [asentado, setAsentado] = useState(query)
  const [recientes, setRecientes] = useState(leerRecientes)
  const campoRef = useRef<HTMLInputElement>(null)
  const zonaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAsentado(query), 220)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (matchMedia('(min-width: 1024px)').matches) campoRef.current?.focus()
    function atajo(event: globalThis.KeyboardEvent) {
      const escribiendo = (event.target as HTMLElement).matches('input, textarea')
      if (event.key === '/' && !escribiendo) {
        event.preventDefault()
        campoRef.current?.focus()
      }
    }
    addEventListener('keydown', atajo)
    return () => removeEventListener('keydown', atajo)
  }, [])

  const catalogo = useMemo(() => Object.values(seedBooks), [seedBooks])
  const texto = query.trim()
  const buscado = normalizeText(asentado)

  const libros = useMemo(() => {
    if (!buscado) return []
    const puntaje = (book: Book) => {
      const titulo = normalizeText(book.title)
      const base = titulo === buscado ? 0 : titulo.startsWith(buscado) ? 1 : titulo.includes(buscado) ? 2 : 3
      return base * 2 + (library[book.id] ? 0 : 1)
    }
    return catalogo
      .filter((book) => matchesQuery(book, asentado.trim()))
      .sort((a, b) => puntaje(a) - puntaje(b))
  }, [buscado, asentado, catalogo, library])

  const autores = useMemo(() => {
    if (!buscado) return []
    return agrupar(catalogo).filter(({ name }) =>
      normalizeText(name)
        .split(/\s+/)
        .some((palabra) => palabra.startsWith(buscado)) || normalizeText(name).startsWith(buscado),
    )
  }, [buscado, catalogo])

  const autorExacto = autores.find(({ name }) => normalizeText(name) === buscado)
  const misAutores = useMemo(
    () => agrupar(Object.keys(library).flatMap((id) => bookOf(id) ?? [])).slice(0, 8),
    [library, bookOf],
  )
  const leenAmigos = useMemo(() => {
    const vistos = new Set<string>()
    return activities.flatMap((activity) => {
      const book = bookOf(activity.bookId)
      const user = users.find(({ id }) => id === activity.userId)
      if (!book || !user || vistos.has(book.id)) return []
      vistos.add(book.id)
      return [{ book, quien: <Cara user={user} className="size-5 text-[0.5625rem]" />, nombre: firstName(user.name) }]
    })
  }, [activities, users, bookOf])

  const setQuery = (valor: string) => setParams(valor ? { q: valor } : {}, { replace: true })

  function recordar(termino: string) {
    const siguiente = [termino, ...recientes.filter((item) => item !== termino)].slice(0, MAX_RECIENTES)
    setRecientes(siguiente)
    try {
      localStorage.setItem(CLAVE_RECIENTES, JSON.stringify(siguiente))
    } catch {
      // Sin almacenamiento, las búsquedas recientes solo duran esta visita.
    }
  }

  function olvidar() {
    setRecientes([])
    try {
      localStorage.removeItem(CLAVE_RECIENTES)
    } catch {
      // Nada que borrar.
    }
  }

  function elegirAutor(nombre: string) {
    recordar(nombre)
    setQuery(nombre)
    setAsentado(nombre)
    zonaRef.current?.scrollIntoView({ block: 'start' })
  }

  const cargando = forzado === 'carga' || (texto !== '' && asentado !== query)
  const mejorAutor = !autorExacto && autores.length > 0 && (libros.length === 0 || normalizeText(libros[0].title).indexOf(buscado) !== 0) ? autores[0] : undefined
  const mejorLibro = !mejorAutor ? libros[0] : undefined
  const enLista = mejorLibro ? libros.slice(1, 6) : libros.slice(0, 5)
  const resto = libros.slice(mejorLibro ? 6 : 5)
  const propios = libros.filter(({ id }) => library[id]).length

  function mover(desde: HTMLElement | null, paso: 1 | -1) {
    const resultados = [...(zonaRef.current?.querySelectorAll<HTMLElement>('[data-resultado]') ?? [])]
    const actual = desde ? resultados.indexOf(desde) : -1
    const siguiente = resultados[actual + paso]
    if (siguiente) siguiente.focus()
    else if (paso === -1) campoRef.current?.focus()
  }

  function alTeclearCampo(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      mover(null, 1)
    }
    if (event.key === 'Escape') setQuery('')
    if (event.key === 'Enter' && mejorLibro) {
      recordar(texto)
      navigate(bookPath(mejorLibro.id), { state: { from: `/buscar?q=${encodeURIComponent(texto)}` } })
    }
    if (event.key === 'Enter' && mejorAutor) elegirAutor(mejorAutor.name)
  }

  function alTeclearZona(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      mover(document.activeElement as HTMLElement, event.key === 'ArrowDown' ? 1 : -1)
    }
  }

  const sugerida = !cargando && texto && libros.length === 0 && autores.length === 0 ? sugerencia(texto, catalogo) : undefined

  return (
    <section className="pt-3 lg:pt-8">
      <div className="px-(--gut)">
        <Marca className="mb-2" />
        <h1 className="titulo-pagina">Buscar</h1>
      </div>

      <div className="sticky top-0 z-30 mt-3 bg-paper/92 px-(--gut) py-2 backdrop-blur-xl lg:mt-4">
        <label className="flex min-h-14 items-center gap-3 rounded-full border border-edge bg-white pr-1.5 pl-5 transition-[border-color,box-shadow] duration-150 has-[input:focus]:border-ink has-[input:focus]:shadow-[0_0_0_1px_var(--color-ink)]">
          <Search aria-hidden size={22} className="shrink-0 text-muted" />
          <input
            ref={campoRef}
            type="search"
            aria-label="Buscar libros y autores"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={alTeclearCampo}
            placeholder="Título o autor"
            autoComplete="off"
            enterKeyHint="search"
            className="min-h-12 w-full min-w-0 appearance-none bg-transparent text-lg outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                campoRef.current?.focus()
              }}
              className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 font-semibold transition-colors duration-100 hover:bg-sand active:bg-sand-deep"
            >
              <X aria-hidden size={18} />
              Borrar
            </button>
          )}
        </label>
      </div>

      {forzado === 'local' && (
        <p role="status" className="mx-(--gut) mt-3 flex items-center gap-2 rounded-[14px] bg-shell py-1 pr-1 pl-3 text-sm">
          <CircleAlert aria-hidden size={18} className="shrink-0 text-muted" />
          <span className="min-w-0 flex-1">No pudimos conectar. Te mostramos los libros que ya están en la app.</span>
          <button type="button" className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 font-semibold hover:bg-sand">
            <RotateCcw aria-hidden size={16} />
            Reintentar
          </button>
        </p>
      )}

      <div ref={zonaRef} onKeyDown={alTeclearZona} className="scroll-mt-20">
        {forzado === 'error' ? (
          <div className="px-(--gut)">
            <ErrorState
              title="No pudimos buscar"
              description="Revisa tu conexión e inténtalo de nuevo. Tus libros siguen en Mis libros."
              onRetry={() => setParams({ q: query }, { replace: true })}
            />
          </div>
        ) : cargando ? (
          <Esqueleto />
        ) : !texto ? (
          <>
            {recientes.length > 0 && (
              <section className="mt-4 px-(--gut)">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="titulo-seccion">Búsquedas recientes</h2>
                  <button type="button" onClick={olvidar} className="inline-flex min-h-11 items-center rounded-full px-3 font-semibold hover:bg-sand">
                    Borrar
                  </button>
                </div>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {recientes.map((termino) => (
                    <li key={termino}>
                      <button
                        type="button"
                        onClick={() => setQuery(termino)}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-edge px-4 font-semibold transition-colors duration-150 hover:bg-sand"
                      >
                        <History aria-hidden size={16} className="text-muted" />
                        {termino}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <Tarjetas titulo="Autores de tu biblioteca" autores={misAutores} onElegir={elegirAutor} />
            <RielAmigos libros={leenAmigos} />
          </>
        ) : libros.length === 0 && autores.length === 0 ? (
          <>
            <div role="status" className="mt-6 px-(--gut)">
              <p className="font-serif text-2xl font-semibold tracking-tight text-balance">No encontramos «{texto}»</p>
              {sugerida ? (
                <p className="mt-2 flex flex-wrap items-center gap-x-1 text-muted">
                  ¿Quisiste decir{' '}
                  <button
                    type="button"
                    data-resultado
                    onClick={() => elegirAutor(sugerida)}
                    className="inline-flex min-h-11 items-center font-semibold text-ink underline underline-offset-4"
                  >
                    {sugerida}
                  </button>
                  ?
                </p>
              ) : (
                <p className="mt-2 text-muted">Revisa cómo se escribe o prueba solo con el apellido del autor.</p>
              )}
            </div>
            <Tarjetas titulo="Autores de tu biblioteca" autores={misAutores.slice(0, 4)} onElegir={elegirAutor} />
          </>
        ) : autorExacto ? (
          <div className="mt-3 px-(--gut)">
            <p role="status" className="text-sm text-muted">
              {autorExacto.libros.length} {autorExacto.libros.length === 1 ? 'libro' : 'libros'} de este autor
              {propios > 0 ? `, ${propios} en tu biblioteca` : ''}
            </p>
            <h2 className="titulo-seccion mt-1">{autorExacto.name}</h2>
            <ul className="mt-2 grid gap-x-6 md:grid-cols-2 xl:grid-cols-3">
              {autorExacto.libros.map((book) => (
                <FilaLibro key={book.id} book={book} busca="" onAbrir={() => recordar(texto)} />
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-3">
            <p role="status" className="px-(--gut) text-sm text-muted">
              {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
              {propios > 0 ? `, ${propios} en tu biblioteca` : ''}
            </p>
            <div className="mt-3 grid gap-x-8 gap-y-5 px-(--gut) lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <section className="flex flex-col">
                <h2 className="titulo-seccion">Mejor resultado</h2>
                <div className="mt-3 flex-1">
                  {mejorAutor ? (
                    <TarjetaAutor grande autor={mejorAutor} onElegir={() => elegirAutor(mejorAutor.name)} />
                  ) : mejorLibro ? (
                    <MejorLibro book={mejorLibro} onAbrir={() => recordar(texto)} />
                  ) : null}
                </div>
              </section>
              {enLista.length > 0 && (
                <section>
                  <h2 className="titulo-seccion">Libros</h2>
                  <ul className="mt-1.5 -mx-2">
                    {enLista.map((book) => (
                      <FilaLibro key={book.id} book={book} busca={asentado.trim()} onAbrir={() => recordar(texto)} />
                    ))}
                  </ul>
                </section>
              )}
            </div>
            {autores.length > (mejorAutor ? 1 : 0) && (
              <Tarjetas titulo="Autores" autores={mejorAutor ? autores.slice(1) : autores} onElegir={elegirAutor} />
            )}
            {resto.length > 0 && (
              <section className="mt-7 px-(--gut)">
                <h2 className="titulo-seccion">Más libros</h2>
                <ul className="mt-1.5 -mx-2 grid gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                  {resto.map((book) => (
                    <FilaLibro key={book.id} book={book} busca={asentado.trim()} onAbrir={() => recordar(texto)} />
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function MejorLibro({ book, onAbrir }: { book: Book; onAbrir: () => void }) {
  const entry = useStore(selectEntry(book.id))
  const upsertBook = useStore((state) => state.upsertBook)
  return (
    <Link
      to={bookPath(book.id)}
      state={{ from: '/buscar' }}
      viewTransition
      data-resultado
      onClick={() => {
        upsertBook(book)
        onAbrir()
      }}
      style={{ backgroundColor: tonoProfundo(book.id) }}
      className="group flex h-full min-h-56 gap-4 rounded-[16px] p-4 text-[#fff] lg:gap-5 lg:p-5"
    >
      <span className="portada-viva block w-28 shrink-0 lg:w-36">
        <BookCover book={book} className="sombra-portada" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-4 font-serif text-2xl/[1.12] font-semibold tracking-[-0.015em] text-balance lg:text-[1.75rem]/[1.12]">
          {book.title}
        </span>
        <span className="mt-1.5 text-sm text-[#fff]/88">{book.authors[0]}</span>
        {entry && (
          <span className="mt-2 inline-flex w-fit items-center rounded-full bg-[#fff] px-2.5 py-1 text-[#17120f]">
            <StatusTag status={entry.status} size="sm" />
          </span>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold">
          Ver ficha
          <ArrowRight aria-hidden size={16} />
        </span>
      </span>
    </Link>
  )
}
