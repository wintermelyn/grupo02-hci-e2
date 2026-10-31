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
      state={{ restoreScroll: true }}
      className="-ml-2 inline-flex min-h-11 shrink-0 items-center gap-0.5 rounded-control pr-2 pl-1 font-medium whitespace-nowrap text-ink transition-colors duration-100 hover:bg-sand active:bg-sand-deep"
    >
      <ChevronLeft aria-hidden size={20} />
      {label}
    </Link>
  )
}

/** On phones there is no top bar, so the band carries the name of the product. */
export function Wordmark() {
  return (
    <p className="ml-auto flex shrink-0 flex-col items-end md:hidden">
      <span className="font-serif text-sm/tight font-semibold">Goodreads</span>
      <span className="text-xs/tight text-muted">prototipo</span>
    </p>
  )
}

export interface PageHeaderProps {
  /** Text, or the field that replaces it while the name is being edited. */
  title: ReactNode
  /** One line of context under the title. */
  subtitle?: string
  /** Sits before the title, e.g. the <Avatar/> of a person. */
  media?: ReactNode
  /** Where "Volver" goes. A fixed path, not history.back(), so it also works on a shared link. */
  backTo?: string
  backLabel?: string
  /**
   * What acts on the page, next to the title, e.g. a <Button/>. The product name moves above it. It
   * can cover the row with `absolute inset-0`, as the search of a folder does on a phone.
   */
  action?: ReactNode
  /** Sits on the band's bottom edge, e.g. a <TagFilter/>. */
  children?: ReactNode
  /** Modelo: mantiene la marca junto al título aunque haya acción. */
  wordmarkInline?: boolean
}

/** The band every section starts with, so each page has one clear place to look first. */
export function PageHeader({
  title,
  subtitle,
  media,
  backTo,
  backLabel,
  action,
  children,
  wordmarkInline = false,
}: PageHeaderProps) {
  // Next to the title it would leave no room for an action on a phone, or for a long title.
  const wordmarkAbove = Boolean(backTo || action) && !wordmarkInline

  return (
    // flow-root: a margin at the foot of a child stays in the band instead of collapsing out of it.
    <header className={cx('full-bleed flow-root bg-shell pt-2 md:pt-4', !children && 'pb-4')}>
      {wordmarkAbove && (
        <div className="flex min-h-11 items-center justify-between gap-3">
          {backTo && <BackLink to={backTo} label={backLabel} />}
          <Wordmark />
        </div>
      )}
      <div className="relative flex min-h-11 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {media}
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-title font-semibold tracking-tight md:text-display">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
        {!wordmarkAbove && <Wordmark />}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </header>
  )
}
