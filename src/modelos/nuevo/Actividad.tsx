import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { BackLink, BookCover, bookPath, Stars } from '../../components'
import { useStore } from '../../store'
import { ago, daysSince, firstName, VERB } from '../datos'
import { Marca } from './Shell'
import { Cara, MeGusta, useActividad, type Evento } from './social'

const TANDA = 6

function periodoDe(date: string): string {
  const dias = daysSince(date)
  if (dias <= 0) return 'Hoy'
  if (dias <= 7) return 'Esta semana'
  return 'Antes'
}

function Fila({ evento }: { evento: Evento }) {
  const { activity, user, book } = evento
  const upsertBook = useStore((state) => state.upsertBook)
  return (
    <li className="flex gap-3.5 border-b border-line py-3 last:border-b-0">
      <Link
        to={bookPath(book.id)}
        state={{ from: '/actividad' }}
        onClick={() => upsertBook(book)}
        tabIndex={-1}
        aria-hidden
        className="w-14 shrink-0"
      >
        <BookCover book={book} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to={`/amigos/${user.id}`}
          className="-my-2 flex min-h-11 w-fit max-w-full items-center gap-1.5 text-sm text-muted"
        >
          <Cara user={user} />
          <span className="truncate">
            <span className="font-semibold text-ink">{firstName(user.name)}</span>{' '}
            {VERB[activity.kind]}
          </span>
        </Link>
        <Link
          to={bookPath(book.id)}
          state={{ from: '/actividad' }}
          onClick={() => upsertBook(book)}
          className="flex min-h-11 items-center"
        >
          <span className="line-clamp-2 font-serif text-lg/snug font-semibold">{book.title}</span>
        </Link>
        <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted">
          {activity.rating ? <Stars value={activity.rating} /> : <span>{book.authors[0]}</span>}
          <span aria-hidden>·</span>
          <span>{ago(activity.date)}</span>
        </p>
      </div>
      <div className="shrink-0 self-center">
        <MeGusta evento={evento} conTexto />
      </div>
    </li>
  )
}

/** Toda la actividad, por períodos y por tandas: la lista tiene un final claro. */
export function Actividad() {
  const eventos = useActividad()
  const [visibles, setVisibles] = useState(TANDA)
  const finalRef = useRef<HTMLParagraphElement>(null)
  const mostrados = eventos.slice(0, visibles)
  const periodos = useMemo(() => {
    const grupos = new Map<string, Evento[]>()
    for (const evento of mostrados) {
      const periodo = periodoDe(evento.activity.date)
      grupos.set(periodo, [...(grupos.get(periodo) ?? []), evento])
    }
    return [...grupos]
  }, [mostrados])

  function verMas() {
    const siguiente = visibles + TANDA
    setVisibles(siguiente)
    // El botón desaparece con la última tanda: el foco pasa al aviso del final, y no se pierde.
    if (siguiente >= eventos.length) setTimeout(() => finalRef.current?.focus())
  }

  return (
    <section className="px-(--gut) pt-3 lg:pt-8">
      <Marca className="mb-1" />
      <BackLink to="/" label="Inicio" />
      <h1 className="titulo-pagina mt-1">Actividad de tus amigos</h1>

      <div className="max-w-3xl">
        {periodos.map(([periodo, lista]) => (
          <section key={periodo} className="mt-6">
            <h2 className="titulo-seccion">{periodo}</h2>
            <ul className="mt-1">
              {lista.map((evento) => (
                <Fila key={evento.activity.id} evento={evento} />
              ))}
            </ul>
          </section>
        ))}
        {eventos.length > visibles ? (
          <button
            type="button"
            onClick={verMas}
            className="mt-5 min-h-12 w-full rounded-full border border-edge font-semibold transition-colors duration-150 hover:bg-sand active:bg-sand-deep"
          >
            Ver más
          </button>
        ) : (
          <p ref={finalRef} tabIndex={-1} className="mt-6 border-t border-line pt-5 text-center text-muted">
            Llegaste al final. No hay más actividad.
          </p>
        )}
      </div>
    </section>
  )
}
