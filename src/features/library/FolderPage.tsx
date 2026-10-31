import { FolderOpen } from 'lucide-react'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { EmptyState, PageHeader } from '../../components'
import { useStore } from '../../store'

export function FolderPage() {
  const { folderId } = useParams()
  const folders = useStore((state) => state.folders)
  const folder = useMemo(() => folders.find(({ id }) => id === folderId), [folders, folderId])

  return (
    <section>
      <PageHeader title={folder?.name ?? 'Carpeta'} backTo="/biblioteca" backLabel="Mis libros" />
      <EmptyState
        icon={FolderOpen}
        title="Disponible pronto"
        description="Aquí vas a ver los libros de esta carpeta y podrás buscar entre ellos."
      />
    </section>
  )
}
