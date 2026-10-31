import { Compass, Ellipsis, House, LibraryBig, Search, type LucideIcon } from 'lucide-react'
import { Link, matchPath, Outlet, useLocation } from 'react-router'
import { Ribbon, Toast } from '../../components'
import { cx } from '../../components/cx'
import { useScrollMemory } from '../../components/useScrollMemory'

const SECCIONES: { to: string; label: string; icon: LucideIcon; tambien?: string[] }[] = [
  { to: '/', label: 'Inicio', icon: House, tambien: ['/actividad'] },
  { to: '/biblioteca', label: 'Mis libros', icon: LibraryBig },
  { to: '/descubrir', label: 'Descubrir', icon: Compass },
  { to: '/buscar', label: 'Buscar', icon: Search },
  { to: '/mas', label: 'Más', icon: Ellipsis, tambien: ['/amigos', '/perfil'] },
]

const activa = (to: string, tambien: string[] = [], pathname: string) =>
  [to, ...tambien].some((path) => matchPath({ path, end: to === '/' }, pathname))

/** Las pantallas nuevas usan todo el ancho; las heredadas conservan su columna. */
const ANCHAS = ['/', '/descubrir', '/buscar', '/actividad']

/** Actividad vive dentro de Inicio: tocar Inicio desde ahí también es volver a donde estabas. */
const estadoDe = (to: string, pathname: string) =>
  to === '/' && pathname === '/actividad' ? { restoreScroll: true } : undefined

export function Marca({ className }: { className?: string }) {
  return (
    <p className={cx('flex items-baseline gap-1.5 lg:hidden', className)}>
      <span className="font-serif text-base font-semibold tracking-tight">Goodreads</span>
      <span className="text-xs text-muted">prototipo</span>
    </p>
  )
}

export function Shell() {
  useScrollMemory()
  const { pathname } = useLocation()
  const ancha = ANCHAS.some((ruta) => matchPath({ path: ruta, end: true }, pathname))

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line px-3 pt-6 pb-5 lg:flex">
        <Link to="/" className="flex min-h-11 items-center rounded-control px-3">
          <span className="block font-serif text-2xl font-semibold tracking-tight">Goodreads</span>
        </Link>
        <nav aria-label="Principal" className="mt-8">
          <ul className="flex flex-col gap-1">
            {SECCIONES.map(({ to, label, icon: Icono, tambien }) => {
              const es = activa(to, tambien, pathname)
              return (
                <li key={to}>
                  <Link
                    to={to}
                    state={estadoDe(to, pathname)}
                    aria-current={es ? 'page' : undefined}
                    className={cx(
                      'relative flex min-h-11 items-center gap-3 rounded-[10px] px-3 transition-colors duration-100',
                      es
                        ? 'bg-sand font-bold text-ink'
                        : 'font-medium text-muted hover:bg-shell hover:text-ink active:bg-sand',
                    )}
                  >
                    <Icono aria-hidden size={20} strokeWidth={es ? 2.4 : 2} />
                    {label}
                    {es && <Ribbon className="absolute top-0 right-3 h-4 w-2.5 bg-ribbon" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <p className="mt-auto px-3 text-xs text-muted">Prototipo de rediseño, proyecto de curso</p>
      </aside>

      <main
        className={cx(
          'min-w-0 pb-32 lg:pb-16',
          !ancha && 'mx-auto w-full max-w-app px-(--gut) lg:mx-0',
        )}
      >
        <Outlet />
      </main>

      <nav
        aria-label="Principal"
        className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-[26px] border border-line bg-paper/92 shadow-float backdrop-blur-xl backdrop-saturate-150 lg:hidden"
      >
        <ul className="flex p-1">
          {SECCIONES.map(({ to, label, icon: Icono, tambien }) => {
            const es = activa(to, tambien, pathname)
            return (
              <li key={to} className="min-w-0 flex-1">
                <Link
                  to={to}
                  state={estadoDe(to, pathname)}
                  aria-current={es ? 'page' : undefined}
                  className={cx(
                    'relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[22px] text-xs transition-colors duration-100',
                    es ? 'bg-sand font-bold text-ink' : 'font-semibold text-muted active:bg-sand',
                  )}
                >
                  <Icono aria-hidden size={21} strokeWidth={es ? 2.4 : 2} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Toast />
    </div>
  )
}
