import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function LibraryPage() {
  return (
    <section>
      <PageHeader title="Mis libros" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán tus carpetas y los filtros por estado. La construye el rol A (Biblioteca)."
      />
    </section>
  )
}
