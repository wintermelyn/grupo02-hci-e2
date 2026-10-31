import { Inbox, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  /** What to do next, e.g. a <Button/> that leads to adding content. */
  action?: ReactNode
}

/** A block in the same place the content would be, so the page keeps its shape. */
export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-tile bg-shell p-5">
      <Icon aria-hidden size={24} className="shrink-0 text-muted" />
      <div className="min-w-0 flex-1 basis-48">
        <h2 className="font-serif text-lg font-semibold">{title}</h2>
        {description && <p className="wrap-anywhere text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
