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
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border-2 border-danger/30 bg-white px-4 py-10 text-center"
    >
      <CircleAlert aria-hidden size={40} className="text-danger" />
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="max-w-prose text-gray-700">{description}</p>}
      {onRetry && (
        <Button icon={RotateCcw} onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
