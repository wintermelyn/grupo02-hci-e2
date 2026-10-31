import { Heart } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { BookCover, bookPath } from '../../components'
import { cx } from '../../components/cx'
import { useBookLookup } from '../../features/library/filters'
import { useStore } from '../../store'
import type { Activity, Book, User } from '../../types'
import { ago, firstName, VERB } from '../datos'

export interface Evento {
  activity: Activity
  user: User
  book: Book
}

/**
 * La actividad de los amigos, de lo más nuevo a lo antiguo. `?actividad=35` repite la real hasta ese
 * número, solo para probar cómo se porta una lista larga: en la demo normal no se usa.
 */
export function useActividad(): Evento[] {
  const activities = useStore((state) => state.activities)
  const friendships = useStore((state) => state.friendships)
  const users = useStore((state) => state.users)
  const bookOf = useBookLookup()
  const [params] = useSearchParams()
  const prueba = Number(params.get('actividad')) || 0

  return useMemo(() => {
    const amigos = new Set(friendships.filter((f) => f.status === 'friends').map((f) => f.userId))
    const reales = activities.flatMap((activity) => {
      const user = users.find(({ id }) => id === activity.userId)
      const book = bookOf(activity.bookId)
      return user && book && amigos.has(user.id) ? [{ activity, user, book }] : []
    })
    if (prueba <= reales.length || reales.length === 0) return reales
    return Array.from({ length: prueba }, (_, i) => {
      const base = reales[i % reales.length]
      const vuelta = Math.floor(i / reales.length)
      const fecha = new Date(`${base.activity.date}T12:00:00`)
      fecha.setDate(fecha.getDate() - vuelta * 14)
      const date = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
      return { ...base, activity: { ...base.activity, id: `${base.activity.id}-${vuelta}`, date } }
    })
  }, [activities, friendships, users, bookOf, prueba])
}

const corto = (date: string) => ago(date).replace('Hace ', '').replace(' días', ' d')

export function Cara({ user, className }: { user: User; className?: string }) {
  const iniciales = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join('')
  return (
    <span
      aria-hidden
      style={{ backgroundColor: user.avatarColor, color: '#fff', boxShadow: '0 0 0 1px var(--color-line)' }}
      className={cx(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-full font-sans text-[0.625rem] font-bold',
        className,
      )}
    >
      {iniciales}
    </span>
  )
}

/**
 * Sin contador ni lista de nombres (decisión aprobada): la actividad de un amigo tiene un solo
 * destinatario, y un número aquí sería inventado. Al darlo, el aviso dice quién lo recibe.
 */
export function MeGusta({ evento, conTexto = false }: { evento: Evento; conTexto?: boolean }) {
  const { activity, user, book } = evento
  const idReal = activity.id.replace(/-\d+$/, '')
  const dado = useStore((state) => state.likedActivityIds.includes(idReal))
  const alternar = useStore((state) => state.toggleLike)
  const showToast = useStore((state) => state.showToast)
  const undoSnapshot = useStore((state) => state.undoSnapshot)
  const nombre = firstName(user.name)

  function alTocar() {
    alternar(idReal)
    // Igual que en las solicitudes de amistad: un aviso nuevo no le quita a nadie su Deshacer.
    if (!dado && !undoSnapshot) showToast(`${nombre} verá que te gustó`)
  }

  return (
    <button
      type="button"
      aria-pressed={dado}
      aria-label={`Me gusta: ${nombre} ${VERB[activity.kind]} ${book.title}`}
      onClick={alTocar}
      className={cx(
        'inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-[background-color,color,scale] duration-150 hover:bg-sand active:scale-90',
        conTexto && 'px-3',
        dado ? 'text-ribbon' : 'text-muted',
      )}
    >
      <Heart aria-hidden size={20} fill={dado ? 'currentColor' : 'none'} />
      {conTexto && (dado ? 'Te gusta' : 'Me gusta')}
    </button>
  )
}

/**
 * Una fila compacta de actividad. Inicio muestra cinco, sin caja con scroll propio. Toda la fila
 * abre el libro: un título de una línea no alcanza los 44 px, y el corazón va encima del enlace.
 */
export function FilaEvento({ evento }: { evento: Evento }) {
  const { activity, user, book } = evento
  const upsertBook = useStore((state) => state.upsertBook)
  return (
    <div className="relative flex h-full items-center gap-3 rounded-[14px] bg-shell py-1.5 pr-1 pl-2 transition-colors duration-100 hover:bg-sand lg:py-2">
      <div aria-hidden className="w-10 shrink-0 lg:w-12">
        <BookCover book={book} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <Cara user={user} className="max-[359px]:hidden" />
          <span className="truncate">
            <span className="font-semibold text-ink">{firstName(user.name)}</span>{' '}
            {VERB[activity.kind]} · {corto(activity.date)}
          </span>
        </p>
        <Link
          to={bookPath(book.id)}
          state={{ from: '/' }}
          viewTransition
          onClick={() => upsertBook(book)}
          className="mt-0.5 line-clamp-1 rounded-[14px] font-serif text-[1.0625rem]/snug font-semibold after:absolute after:inset-0 after:rounded-[14px]"
        >
          {book.title}
        </Link>
        <p className="hidden truncate text-sm text-muted lg:block">{book.authors[0]}</p>
      </div>
      <div className="relative z-10">
        <MeGusta evento={evento} />
      </div>
    </div>
  )
}
