import { LoaderCircle } from 'lucide-react'

export interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Cargando…' }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-10 text-gray-700">
      <LoaderCircle aria-hidden size={24} className="motion-safe:animate-spin" />
      {label}
    </div>
  )
}
