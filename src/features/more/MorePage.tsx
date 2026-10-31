import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function MorePage() {
  return (
    <section>
      <PageHeader title="Más" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán los enlaces a Amigos y Mi perfil. La construye el rol B (Social y búsqueda)."
      />
    </section>
  )
}
