import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function HomePage() {
  return (
    <section>
      <PageHeader title="Inicio" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán «Leyendo ahora» y la actividad de tus amigos. La construye el rol B (Social y búsqueda)."
      />
    </section>
  )
}
