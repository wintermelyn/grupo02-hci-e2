export interface LoadingStateProps {
  label?: string
}

const SKELETON_ROWS = [0, 1, 2]

/** The shape of a list of books, so the page does not jump when the results arrive. */
export function LoadingState({ label = 'Cargando…' }: LoadingStateProps) {
  return (
    <div role="status" className="py-2">
      <span className="sr-only">{label}</span>
      {SKELETON_ROWS.map((row) => (
        <div
          key={row}
          aria-hidden
          className="flex items-center gap-3.5 py-2.5 motion-safe:animate-pulse"
        >
          <div className="aspect-2/3 w-11 shrink-0 rounded-[2px_3px_3px_2px] bg-sand" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/5 rounded-control bg-sand" />
            <div className="h-3 w-2/5 rounded-control bg-sand" />
          </div>
        </div>
      ))}
    </div>
  )
}
