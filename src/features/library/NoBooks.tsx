import { FolderOpen, SearchX } from 'lucide-react'
import { Button, EmptyState } from '../../components'

export interface NoBooksProps {
  /** The folder, or what stands for one. */
  name: string
  /** The active tag, if any. */
  label?: string
  query: string
  /** How many books the folder has, whatever their tag. */
  total: number
  /** Where those books are, when the list is not the folder itself. */
  place?: string
  onShowAll: () => void
}

/** A folder with books, none of which pass the filters. */
export function NoBooks({
  name,
  label,
  query,
  total,
  place = 'esta carpeta',
  onShowAll,
}: NoBooksProps) {
  // A book that changes its tag leaves this list but stays in the folder, so the way back is here.
  const showAll = label && <Button onClick={onShowAll}>Ver todos los libros</Button>

  if (query) {
    return (
      <EmptyState
        icon={SearchX}
        title="Sin resultados"
        description={
          label
            ? `Ningún libro con el estado «${label}» coincide con «${query}».`
            : `Ningún libro de «${name}» coincide con «${query}».`
        }
        action={showAll}
      />
    )
  }
  return (
    <EmptyState
      icon={FolderOpen}
      title={`Ningún libro en «${label}»`}
      description={
        total === 1
          ? `El libro de ${place} tiene otro estado.`
          : `Los ${total} libros de ${place} tienen otro estado.`
      }
      action={showAll}
    />
  )
}
