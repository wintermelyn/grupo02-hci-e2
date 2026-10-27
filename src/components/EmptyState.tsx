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
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 px-4 py-10 text-center">
      <Icon aria-hidden size={40} className="text-gray-600" />
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="max-w-prose text-gray-700">{description}</p>}
      {action}
    </div>
  )
}
