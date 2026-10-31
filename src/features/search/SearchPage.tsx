import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function SearchPage() {
  return (
    <section>
      <PageHeader title="Buscar" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irá la búsqueda de libros y autores. La construye el rol B (Social y búsqueda)."
      />
    </section>
  )
}
