import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function FriendsPage() {
  return (
    <section>
      <PageHeader title="Amigos" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán tus amigos y las solicitudes pendientes. La construye el rol B (Social y búsqueda)."
      />
    </section>
  )
}
