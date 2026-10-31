import type { ReactNode } from 'react'
import { Link } from 'react-router'

/**
 * The states of a quiet compact button, on a link because it changes the view. Its text stays on the
 * margin of the column, so the fill sticks out only under the cursor.
 */
export function QuietLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="mt-1 -ml-2.5 inline-flex min-h-11 items-center rounded-control px-2.5 font-semibold text-ink transition-colors duration-100 hover:bg-shell active:bg-sand"
    >
      {children}
    </Link>
  )
}
