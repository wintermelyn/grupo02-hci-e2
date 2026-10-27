import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function ProfilePage() {
  return (
    <section>
      <PageHeader title="Mi perfil" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán tu código de amigo y «Reiniciar demo». La construye el rol B (Social y búsqueda)."
      />
    </section>
  )
}
