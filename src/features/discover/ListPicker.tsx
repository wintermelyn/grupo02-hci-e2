import { cx } from '../../components/cx'
import type { LoadedList } from './useDiscoverLists'

export interface ListPickerProps {
  lists: LoadedList[]
  chosen: string
  onChoose: (listId: string) => void
}

/** All the lists at the same level and always in sight: D6 asks for no tab to be hidden. */
export function ListPicker({ lists, chosen, onChoose }: ListPickerProps) {
  return (
    <div
      role="group"
      aria-label="Listas"
      className="flex w-full gap-0.5 rounded-full bg-sand p-1 lg:w-auto lg:gap-1"
    >
      {lists.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={id === chosen}
          onClick={() => onChoose(id)}
          className={cx(
            'min-h-11 flex-auto rounded-full px-1 text-sm font-semibold transition-colors duration-150 sm:px-3 lg:px-5 lg:text-base',
            id === chosen ? 'bg-ink text-white' : 'text-ink hover:bg-sand-deep active:bg-sand-dark',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
