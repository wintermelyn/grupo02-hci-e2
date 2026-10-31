import { ChevronRight, CircleUser, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { PageHeader } from '../../components'

interface MoreLink {
  to: string
  label: string
  icon: LucideIcon
}

const LINKS: readonly MoreLink[] = [
  { to: '/amigos', label: 'Amigos', icon: Users },
  { to: '/perfil', label: 'Mi perfil', icon: CircleUser },
]

export function MorePage() {
  return (
    <section>
      <PageHeader title="Más" />
      <ul className="mt-3 md:max-w-lg">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="border-b border-line last:border-b-0">
            <Link
              to={to}
              className="-mx-2 flex min-h-14 items-center gap-3 rounded-control px-2 font-semibold transition-colors duration-100 hover:bg-shell active:bg-sand"
            >
              <Icon aria-hidden size={22} className="shrink-0 text-muted" />
              <span className="min-w-0 flex-1">{label}</span>
              <ChevronRight aria-hidden size={20} className="shrink-0 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted">
        Este Goodreads es un prototipo de rediseño para un curso universitario.
      </p>
    </section>
  )
}
