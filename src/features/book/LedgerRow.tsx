import type { ReactNode } from 'react'

export interface LedgerRowProps {
  label: ReactNode
  children: ReactNode
}

/**
 * One line of the book's record, inside a <dl>: what it is on the left and its value, editable right
 * there, on the right. The label column fits 'Carpetas' and leaves the five stars 44 px each at 320 px.
 */
export function LedgerRow({ label, children }: LedgerRowProps) {
  return (
    <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-x-3 border-b border-line py-1 md:grid-cols-[5rem_minmax(0,1fr)]">
      {/* As tall as a control, so the label stays on the first line of a value that wraps. */}
      <dt className="flex min-h-11 items-center self-start text-sm text-muted">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}
