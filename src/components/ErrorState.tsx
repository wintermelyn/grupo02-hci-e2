import { CircleAlert, RotateCcw } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps {
  title?: string
  /** What happened and what the person can do about it, in their words. */
  description?: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Algo salió mal', description, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <CircleAlert aria-hidden size={32} strokeWidth={1.5} className="text-danger" />
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      {description && <p className="max-w-prose text-muted">{description}</p>}
      {onRetry && (
        <Button icon={RotateCcw} onClick={onRetry} className="mt-2">
          Reintentar
        </Button>
      )}
    </div>
  )
}
