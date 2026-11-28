import {
  CircleUser,
  Compass,
  House,
  LibraryBig,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { Link, matchPath, Outlet, useLocation } from 'react-router'
import { cx } from './cx'
import { Ribbon } from './Ribbon'
import { Toast } from './Toast'
import { usePageTitle } from './usePageTitle'
import { useScrollMemory } from './useScrollMemory'

interface Section {
  to: string
  label: string
  icon: LucideIcon
  /** Under lg it is not in the bar, which keeps five sections, and ProfileLink takes its place. */
  onlyInSidebar?: boolean
}

const SECTIONS: readonly Section[] = [
  { to: '/', label: 'Inicio', icon: House },
  { to: '/biblioteca', label: 'Mis libros', icon: LibraryBig },
  { to: '/descubrir', label: 'Descubrir', icon: Compass },
  { to: '/buscar', label: 'Buscar', icon: Search },
  // In the E3 a person looked for their friends in the bar, and "Más" gave no clue of them.
  { to: '/amigos', label: 'Amigos', icon: Users },
  { to: '/perfil', label: 'Mi perfil', icon: CircleUser, onlyInSidebar: true },
]

/** Screens made of rails and big cards take all the width. The rest keep a column they can read. */
const WIDE_PATHS: readonly string[] = ['/', '/descubrir', '/buscar']

/** A section stays active on the pages under it, like a person under Amigos. */
function isSectionActive({ to }: Section, pathname: string): boolean {
  return Boolean(matchPath({ path: to, end: to === '/' }, pathname))
}

/** La actividad lives inside Inicio, so touching Inicio from there is also going back. */
function linkState(to: string, pathname: string, search: string) {
  return to === '/' && pathname === '/' && search ? { restoreScroll: true } : undefined
}

interface NavItemsProps {
  /** The classes of the item, of the link and of each of its two states. */
  item?: string
  link: string
  active: string
  idle: string
  iconSize: number
  /** What marks the active section, besides its fill, its weight and aria-current. */
  activeMark?: ReactNode
  /** The sidebar, which also has the sections that do not fit in the bar. */
  inSidebar?: boolean
}

function NavItems({ item, link, active, idle, iconSize, activeMark, inSidebar }: NavItemsProps) {
  const { pathname, search } = useLocation()
  const sections = inSidebar ? SECTIONS : SECTIONS.filter(({ onlyInSidebar }) => !onlyInSidebar)
  return sections.map((section) => {
    const { to, label, icon: Icon } = section
    const isActive = isSectionActive(section, pathname)
    return (
      <li key={to} className={item}>
        {/* NavLink only knows its own URL. "true" says the page belongs to the section without being it. */}
        <Link
          to={to}
          state={linkState(to, pathname, search)}
          aria-current={isActive ? (matchPath(to, pathname) ? 'page' : 'true') : undefined}
          className={cx(
            'relative flex transition-colors duration-100',
            link,
            isActive ? active : idle,
          )}
        >
          <Icon aria-hidden size={iconSize} strokeWidth={isActive ? 2.4 : 2} />
          {label}
          {isActive && activeMark}
        </Link>
      </li>
    )
  })
}

export function AppShell() {
  const main = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const isWide = WIDE_PATHS.some((path) => matchPath({ path, end: true }, pathname))
  useScrollMemory()
  usePageTitle(main)

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[var(--sidebar)_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line px-3 pt-6 pb-5 lg:flex">
        <Link to="/" className="flex min-h-11 items-center rounded-control px-3">
          <span className="block font-serif text-2xl font-semibold tracking-tight">Goodreads</span>
        </Link>
        <nav aria-label="Principal" className="mt-8">
          <ul className="flex flex-col gap-1">
            <NavItems
              link="min-h-11 items-center gap-3 rounded-control px-3"
              active="bg-sand font-bold text-ink"
              idle="font-medium text-muted hover:bg-shell hover:text-ink active:bg-sand"
              iconSize={20}
              activeMark={<Ribbon className="absolute top-0 right-3 h-4 w-2.5 bg-ribbon" />}
              inSidebar
            />
          </ul>
        </nav>
        <p className="mt-auto px-3 text-xs text-muted">Prototipo de rediseño, proyecto de curso</p>
      </aside>

      {/* Under lg the bar takes 65 px of the bottom, and the last row has to clear it and the toast.
          While a toast is up, Toast says how far it reaches, and the page can scroll 24 px past it. */}
      <main
        ref={main}
        className={cx(
          'w-full min-w-0 px-(--gut) pb-[max(calc(8rem+env(safe-area-inset-bottom)),calc(var(--toast-space,0px)+1.5rem))] lg:pb-[max(4rem,calc(var(--toast-space,0px)+1.5rem))]',
          !isWide && 'mx-auto max-w-app lg:mx-0',
        )}
      >
        <Outlet />
      </main>

      {/* Solid and against the edge: a floating bar moved with the browser's own bar on a real phone. */}
      <nav
        aria-label="Principal"
        data-bottom-bar
        className="fixed inset-x-0 bottom-0 z-40 border-t border-edge/60 bg-paper pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto flex max-w-md p-1">
          <NavItems
            item="min-w-0 flex-1"
            link="min-h-14 flex-col items-center justify-center gap-0.5 rounded-tab text-xs"
            active="bg-sand font-bold text-ink"
            idle="font-semibold text-muted active:bg-sand"
            iconSize={21}
          />
        </ul>
      </nav>

      <Toast />
    </div>
  )
}
