import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function FolderPage() {
  return (
    <section>
      <PageHeader title="Carpeta" backTo="/biblioteca" backLabel="Mis libros" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán los libros de la carpeta, con su buscador. La construye el rol A (Biblioteca)."
      />
    </section>
  )
}
