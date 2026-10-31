import { Sparkles } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Button, EmptyState, Wordmark } from '../../components'
import { coverTone } from '../../lib/coverTone'
import type { Book } from '../../types'
import { BookCarousel } from './BookCarousel'
import { BookDetail } from './BookDetail'
import { ListPicker } from './ListPicker'
import { useCarousel } from './useCarousel'
import { useDiscoverLists, type LoadedList } from './useDiscoverLists'

const LIST_PARAM = 'lista'
const BOOK_PARAM = 'libro'

/** Where a book page goes back to: the same list, with that same book in front. */
function discoverPath(listId: string, book: Book): string {
  return `/descubrir?${new URLSearchParams({ [LIST_PARAM]: listId, [BOOK_PARAM]: book.id })}`
}

interface ShelfProps {
  list: LoadedList
  /** The book to start on, when coming back from its page. */
  startAt: number
}

function Shelf({ list, startAt }: ShelfProps) {
  const { books } = list
  const carousel = useCarousel(books.length, startAt)
  const { bookIndex } = carousel
  const book = books[bookIndex]

  return (
    <div className="mt-2.5 lg:mt-6 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-x-10">
      <div className="min-w-0 lg:col-start-2 lg:row-start-1">
        <BookCarousel
          label={`Libros de ${list.title}`}
          books={books}
          tone={coverTone(book)}
          fromOf={(shown) => discoverPath(list.id, shown)}
          carousel={carousel}
        />
      </div>
      <BookDetail
        list={list}
        book={book}
        position={bookIndex}
        total={books.length}
        from={discoverPath(list.id, book)}
      />
    </div>
  )
}

export function DiscoverPage() {
  const lists = useDiscoverLists()
  const [params, setParams] = useSearchParams()
  const [forYou, nextList] = lists
  const list = lists.find(({ id }) => id === params.get(LIST_PARAM)) ?? forYou
  const wanted = params.get(BOOK_PARAM)
  const startAt = Math.max(
    list.books.findIndex(({ id }) => id === wanted),
    0,
  )

  const choose = (listId: string) =>
    setParams(listId === forYou.id ? {} : { [LIST_PARAM]: listId }, { replace: true })

  return (
    <section className="pt-3 lg:pt-8">
      <header className="flex flex-wrap items-center gap-x-8 gap-y-2 lg:gap-y-3">
        <div className="flex w-full items-center justify-between gap-3 lg:w-auto">
          <h1 className="page-title">Descubrir</h1>
          <Wordmark />
        </div>
        <ListPicker lists={lists} chosen={list.id} onChoose={choose} />
      </header>

      {list.books.length > 0 ? (
        // A new list starts over: other books, another length and another place in the rail.
        <Shelf key={list.id} list={list} startAt={startAt} />
      ) : (
        <EmptyState
          icon={Sparkles}
          title="Ya guardaste todos estos libros"
          description="Vuelve cuando agregues más a tu biblioteca."
          action={<Button onClick={() => choose(nextList.id)}>Ver {nextList.title}</Button>}
        />
      )}
    </section>
  )
}
