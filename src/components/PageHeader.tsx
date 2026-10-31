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

export interface WordmarkProps {
  /** In two lines, for a row shared with a title and a button. */
  stacked?: boolean
  className?: string
}

/** The name of the product under lg. From lg, the sidebar says it. */
export function Wordmark({ stacked = false, className }: WordmarkProps) {
  return (
    <p
      className={cx(
        'flex shrink-0 lg:hidden',
        stacked ? 'flex-col items-end' : 'items-baseline gap-1.5',
        className,
      )}
    >
      <span
        className={cx(
          'font-serif font-semibold tracking-tight',
          stacked ? 'text-sm/tight' : 'text-base',
        )}
      >
        Goodreads
      </span>
      <span className={cx('text-xs text-muted', stacked && 'leading-tight')}>prototipo</span>
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
  /** Sits under the title, e.g. a <TagFilter/>. */
  children?: ReactNode
  /** Keeps the product name next to the title, for a short title and a compact action. */
  wordmarkBeside?: boolean
}

/** How every section starts: the title leads, with nothing behind it. */
export function PageHeader({
  title,
  subtitle,
  media,
  backTo,
  backLabel,
  action,
  children,
  wordmarkBeside = false,
}: PageHeaderProps) {
  // Next to the title it would leave no room for an action on a phone, or for a long title.
  const wordmarkAbove = Boolean(backTo || action) && !wordmarkBeside

  return (
    // flow-root: a margin at the foot of a child stays in the header instead of collapsing out of it.
    <header className={cx('flow-root pt-3 lg:pt-8', !children && 'pb-4')}>
      {wordmarkAbove && (
        <div className={cx('flex min-h-11 items-center gap-3', !backTo && 'lg:hidden')}>
          {backTo && <BackLink to={backTo} label={backLabel} />}
          <Wordmark className="ml-auto" />
        </div>
      )}
      <div className="relative flex min-h-11 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {media}
          <div className="min-w-0 flex-1">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
        {!wordmarkAbove && <Wordmark stacked={wordmarkBeside} className="ml-auto" />}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </header>
  )
}
