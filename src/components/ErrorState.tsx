import { CircleAlert, RotateCcw } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps {
  title?: string
  /** What happened and what the person can do about it, in their words. */
  description?: string
  onRetry?: () => void
}

/** The block of EmptyState: what failed goes where the content would be. */
export function ErrorState({ title = 'Algo salió mal', description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-tile bg-shell p-5"
    >
      <CircleAlert aria-hidden size={24} className="shrink-0 text-danger" />
      <div className="min-w-0 flex-1 basis-48">
        <h2 className="font-serif text-lg font-semibold">{title}</h2>
        {description && <p className="text-muted">{description}</p>}
      </div>
      {onRetry && (
        <Button icon={RotateCcw} onClick={onRetry} className="shrink-0">
          Reintentar
        </Button>
      )}
    </div>
  )
}
