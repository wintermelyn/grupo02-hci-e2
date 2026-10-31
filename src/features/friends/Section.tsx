import type { ReactNode } from 'react'

/** Rows bring their own 10 px above, so the title ends up 12 px from its first row. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-0.5 section-title">{title}</h2>
      {children}
    </section>
  )
}

/** The same columns as the lists in Mis libros. Each <li> draws its own line. */
export function RowList({ children }: { children: ReactNode }) {
  return <ul className="md:grid md:grid-cols-2 md:gap-x-8">{children}</ul>
}
