import { House } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function HomePage() {
  return (
    <section>
      <PageHeader title="Inicio" />
      <EmptyState
        icon={House}
        title="Disponible pronto"
        description="Aquí vas a ver el libro que estás leyendo y lo que leen tus amigos."
      />
    </section>
  )
}
