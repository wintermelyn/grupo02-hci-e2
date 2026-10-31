import { CircleUser } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function ProfilePage() {
  return (
    <section>
      <PageHeader title="Mi perfil" />
      <EmptyState
        icon={CircleUser}
        title="Disponible pronto"
        description="Aquí vas a ver tu nombre, tu @usuario y la opción de reiniciar la demo."
      />
    </section>
  )
}
