import { Compass, Ellipsis, House, LibraryBig, Search, type LucideIcon } from 'lucide-react'
import { Link, matchPath, Outlet, useLocation } from 'react-router'
import { cx } from './cx'
import { Ribbon } from './Ribbon'
import { Toast } from './Toast'

interface Section {
  to: string
  label: string
  icon: LucideIcon
  /** Other sections reached from this one, which keep it marked as active. */
  alsoActiveOn?: readonly string[]
}

const SECTIONS: readonly Section[] = [
  { to: '/', label: 'Inicio', icon: House },
  { to: '/biblioteca', label: 'Mis libros', icon: LibraryBig },
  { to: '/descubrir', label: 'Descubrir', icon: Compass },
  { to: '/buscar', label: 'Buscar', icon: Search },
  { to: '/mas', label: 'Más', icon: Ellipsis, alsoActiveOn: ['/amigos', '/perfil'] },
]

function isSectionActive({ to, alsoActiveOn = [] }: Section, pathname: string): boolean {
  return [to, ...alsoActiveOn].some((path) => matchPath({ path, end: to === '/' }, pathname))
}

// Active is shown by weight, the ribbon and aria-current, not by colour alone.
function navItemClass(isActive: boolean, layout: string): string {
  return cx(
    'relative flex items-center transition-colors duration-100',
    layout,
    isActive ? 'font-bold text-ink' : 'font-medium text-muted hover:text-ink active:bg-shell',
  )
}

function NavItems({
  layout,
  ribbon,
  iconSize,
}: {
  layout: string
  ribbon: string
  iconSize: number
}) {
  const { pathname } = useLocation()
  return SECTIONS.map((section) => {
    const { to, label, icon: Icon } = section
    const isActive = isSectionActive(section, pathname)
    return (
      <li key={to} className="flex-1 md:flex-none">
        {/* NavLink only knows its own URL. "true" says the page belongs to the section without being it. */}
        <Link
          to={to}
          aria-current={isActive ? (matchPath(to, pathname) ? 'page' : 'true') : undefined}
          className={navItemClass(isActive, layout)}
        >
          {isActive && (
            <Ribbon className={cx('absolute left-1/2 -translate-x-1/2 bg-ribbon', ribbon)} />
          )}
          <Icon aria-hidden size={iconSize} />
          {label}
        </Link>
      </li>
    )
  })
}

export function AppShell() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 hidden bg-white shadow-[0_1px_0_var(--color-line)] md:block">
        <div className="mx-auto flex max-w-app items-center justify-between gap-6 px-4">
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold">Goodreads</span>
            <span className="text-xs text-muted">Prototipo de rediseño</span>
          </p>
          <nav aria-label="Principal">
            <ul className="flex gap-1">
              <NavItems layout="min-h-16 gap-2 px-3" ribbon="top-0 h-3.5 w-2.5" iconSize={20} />
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-app px-4 pb-36 md:pb-12">
        <Outlet />
      </main>

      <nav
        aria-label="Principal"
        data-bottom-bar
        className="fixed inset-x-0 bottom-0 z-40 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_0_var(--color-line)] md:hidden"
      >
        <ul className="flex px-1">
          <NavItems
            layout="min-h-16 flex-col justify-center gap-0.5 text-xs"
            ribbon="top-0 h-3.5 w-2.5"
            iconSize={22}
          />
        </ul>
      </nav>

      <Toast />
    </div>
  )
}
