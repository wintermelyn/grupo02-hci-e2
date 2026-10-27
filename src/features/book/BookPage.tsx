import { Construction } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components'

export function BookPage() {
  return (
    <section>
      <PageHeader title="Ficha del libro" backTo="/biblioteca" backLabel="Mis libros" />
      <EmptyState
        icon={Construction}
        title="Pantalla pendiente"
        description="Aquí irán los datos del libro, su estado y el panel «Terminé este libro». La construye el rol A (Biblioteca)."
      />
    </section>
  )
}
