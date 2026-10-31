import { Ellipsis } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function MorePage() {
  return (
    <section>
      <PageHeader title="Más" />
      <EmptyState
        icon={Ellipsis}
        title="Disponible pronto"
        description="Aquí vas a encontrar a tus amigos y tu perfil. Este Goodreads es un prototipo de rediseño para un curso universitario."
      />
    </section>
  )
}
