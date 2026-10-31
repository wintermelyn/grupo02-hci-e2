import { Inbox, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  /** What to do next, e.g. a <Button/> that leads to adding content. */
  action?: ReactNode
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-8 text-center md:py-12">
      <Icon aria-hidden size={32} strokeWidth={1.5} className="text-muted" />
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      {description && <p className="max-w-prose text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
