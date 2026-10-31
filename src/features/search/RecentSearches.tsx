import { History } from 'lucide-react'
import { Button } from '../../components'

export interface RecentSearchesProps {
  terms: string[]
  onPick: (term: string) => void
  onClear: () => void
}

export function RecentSearches({ terms, onPick, onClear }: RecentSearchesProps) {
  return (
    <section className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="section-title">Búsquedas recientes</h2>
        <Button
          compact
          variant="quiet"
          aria-label="Borrar búsquedas recientes"
          onClick={onClear}
          className="-mr-2.5"
        >
          Borrar
        </Button>
      </div>
      <ul className="mt-1 flex flex-wrap gap-1.5">
        {terms.map((term) => (
          <li key={term} className="max-w-full min-w-0">
            <Button icon={History} onClick={() => onPick(term)} className="max-w-full">
              <span className="truncate">{term}</span>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
