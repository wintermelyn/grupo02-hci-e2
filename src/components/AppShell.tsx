import { Compass, Ellipsis, House, LibraryBig, Search, type LucideIcon } from 'lucide-react'
import { Link, matchPath, Outlet, useLocation } from 'react-router'
import { cx } from './cx'
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

// Active is shown by weight, a filled pill and aria-current, not by colour alone.
function navItemClass(isActive: boolean, layout: string): string {
  return cx(
    'flex items-center rounded-lg',
    layout,
    isActive ? 'bg-brand/10 font-bold text-brand' : 'font-medium text-gray-700',
  )
}

function NavItems({ layout, iconSize }: { layout: string; iconSize: number }) {
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
      <header className="sticky top-0 z-40 hidden border-b border-gray-200 bg-white md:block">
        <div className="mx-auto flex max-w-app items-center justify-between gap-6 px-4 py-2">
          <span className="text-lg font-bold text-brand">Goodreads E2</span>
          <nav aria-label="Principal">
            <ul className="flex gap-1">
              <NavItems layout="min-h-11 gap-2 px-3" iconSize={20} />
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-app px-4 pt-4 pb-36 md:pt-8 md:pb-12">
        <Outlet />
      </main>

      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="flex px-1 py-1">
          <NavItems layout="min-h-14 flex-col justify-center gap-0.5 text-xs" iconSize={22} />
        </ul>
      </nav>

      <Toast />
    </div>
  )
}
