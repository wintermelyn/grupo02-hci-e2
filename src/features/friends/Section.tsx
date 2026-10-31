import type { ReactNode } from 'react'

/** Right under the search of Amigos it does not add the space between two sections. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7 first:mt-1 lg:mt-10 lg:first:mt-2">
      <h2 className="section-title">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** One column on a phone and two from md. Each <li> is a row. */
export function RowList({ children }: { children: ReactNode }) {
  return <ul className="grid gap-1.5 md:grid-cols-2 md:gap-2.5">{children}</ul>
}
