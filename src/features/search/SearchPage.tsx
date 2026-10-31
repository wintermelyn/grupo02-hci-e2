import { Search } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function SearchPage() {
  return (
    <section>
      <PageHeader title="Buscar" />
      <EmptyState
        icon={Search}
        title="Disponible pronto"
        description="Aquí vas a poder buscar libros y autores."
      />
    </section>
  )
}
