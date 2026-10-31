import { Users } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function FriendsPage() {
  return (
    <section>
      <PageHeader title="Amigos" />
      <EmptyState
        icon={Users}
        title="Disponible pronto"
        description="Aquí vas a ver a tus amigos, tus solicitudes y a cualquier persona que busques."
      />
    </section>
  )
}
