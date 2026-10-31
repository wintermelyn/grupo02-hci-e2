import { LibraryBig } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function LibraryPage() {
  return (
    <section>
      <PageHeader title="Mis libros" />
      <EmptyState
        icon={LibraryBig}
        title="Disponible pronto"
        description="Aquí vas a ver tus carpetas y tus libros por estado."
      />
    </section>
  )
}
