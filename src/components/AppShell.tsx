import { House, LibraryBig, Search, UserRound, Users, type LucideIcon } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { cx } from './cx'
import { Toast } from './Toast'

interface Section {
  to: string
  label: string
  icon: LucideIcon
}

const SECTIONS: readonly Section[] = [
  { to: '/', label: 'Inicio', icon: House },
  { to: '/biblioteca', label: 'Mis libros', icon: LibraryBig },
  { to: '/amigos', label: 'Amigos', icon: Users },
  { to: '/buscar', label: 'Buscar', icon: Search },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
]

// Active is shown by weight, a filled pill and aria-current="page" (set by NavLink), not by colour alone.
function navItemClass(isActive: boolean, layout: string): string {
  return cx(
    'flex items-center rounded-lg',
    layout,
    isActive ? 'bg-brand/10 font-bold text-brand' : 'font-medium text-gray-700',
  )
}

function NavItems({ layout, iconSize }: { layout: string; iconSize: number }) {
  return SECTIONS.map(({ to, label, icon: Icon }) => (
    <li key={to} className="flex-1 md:flex-none">
      <NavLink
        to={to}
        end={to === '/'}
        className={({ isActive }) => navItemClass(isActive, layout)}
      >
        <Icon aria-hidden size={iconSize} />
        {label}
      </NavLink>
    </li>
  ))
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
