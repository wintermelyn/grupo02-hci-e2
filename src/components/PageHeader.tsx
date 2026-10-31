import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cx } from './cx'

export interface BackLinkProps {
  to: string
  label?: string
}

export function BackLink({ to, label = 'Volver' }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="-ml-2 inline-flex min-h-11 items-center gap-0.5 rounded-control pr-2 pl-1 font-medium text-muted hover:text-ink active:bg-sand"
    >
      <ChevronLeft aria-hidden size={20} />
      {label}
    </Link>
  )
}

export interface PageHeaderProps {
  title: string
  /** One line of context under the title. */
  subtitle?: string
  /** Where "Volver" goes. A fixed path, not history.back(), so it also works on a shared link. */
  backTo?: string
  backLabel?: string
  /** A single action on the right, e.g. a <Button/>. */
  action?: ReactNode
  /** Sits on the band's bottom edge, e.g. a <TagFilter/>. */
  children?: ReactNode
}

/** The band every section starts with, so each page has one clear place to look first. */
export function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel,
  action,
  children,
}: PageHeaderProps) {
  return (
    <header className={cx('full-bleed bg-shell pt-4 md:pt-8', !children && 'pb-5')}>
      {backTo && <BackLink to={backTo} label={backLabel} />}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-display font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </header>
  )
}
