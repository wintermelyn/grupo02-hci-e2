import { Compass } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function DiscoverPage() {
  return (
    <section>
      <PageHeader title="Descubrir" />
      <EmptyState
        icon={Compass}
        title="Disponible pronto"
        description="Aquí vas a encontrar libros seleccionados para ti y listas para explorar."
      />
    </section>
  )
}
