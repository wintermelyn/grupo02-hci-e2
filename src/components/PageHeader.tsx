import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

export interface PageHeaderProps {
  title: string
  /** Where "Volver" goes. A fixed path, not history.back(), so it also works on a shared link. */
  backTo?: string
  backLabel?: string
  /** A single action on the right, e.g. a <Button/>. */
  action?: ReactNode
}

export function PageHeader({ title, backTo, backLabel = 'Volver', action }: PageHeaderProps) {
  return (
    <header className="mb-4 md:mb-6">
      {backTo && (
        <Link
          to={backTo}
          className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-medium text-brand"
        >
          <ChevronLeft aria-hidden size={20} />
          {backLabel}
        </Link>
      )}
      <div className="flex min-h-11 items-center justify-between gap-3">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}
