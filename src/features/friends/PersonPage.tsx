import { CircleUser } from 'lucide-react'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { EmptyState, PageHeader } from '../../components'
import { useStore } from '../../store'

export function PersonPage() {
  const { userId } = useParams()
  const users = useStore((state) => state.users)
  const user = useMemo(() => users.find(({ id }) => id === userId), [users, userId])

  return (
    <section>
      <PageHeader title={user?.name ?? 'Persona'} backTo="/amigos" backLabel="Amigos" />
      <EmptyState
        icon={CircleUser}
        title="Disponible pronto"
        description="Aquí vas a ver qué lee esta persona y los libros que tienen en común."
      />
    </section>
  )
}
