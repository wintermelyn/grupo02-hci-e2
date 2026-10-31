import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function DiscoverPage() {
  return (
    <section>
      <PageHeader title="Descubrir" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán «Seleccionados para ti» y las listas prehechas. La construye el rol B (Social y búsqueda)."
      />
    </section>
  )
}
