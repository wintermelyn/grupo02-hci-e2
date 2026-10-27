import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function PersonPage() {
  return (
    <section>
      <PageHeader title="Persona" backTo="/amigos" backLabel="Amigos" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irá qué lee esta persona y los libros que tienen en común. La construye el rol B (Social y búsqueda)."
      />
    </section>
  )
}
