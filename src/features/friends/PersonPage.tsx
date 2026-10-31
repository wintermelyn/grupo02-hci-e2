import { UserX } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Avatar, BookRow, Button, EmptyState, PageHeader } from '../../components'
import { useStore } from '../../store'
import type { Book, BookId, User } from '../../types'
import { FRIENDS_PATH, mutualFriendsLabel, sharedBooksLabel } from './people'
import { PersonAction } from './PersonAction'
import { RowList, Section } from './Section'

function BookList({ books, sharedIds }: { books: Book[]; sharedIds: Set<BookId> }) {
  return (
    <RowList>
      {books.map((book) => (
        <li
          key={book.id}
          className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
        >
          <BookRow
            book={book}
            note={
              sharedIds.has(book.id) ? (
                <span className="block text-sm font-semibold">En común</span>
              ) : null
            }
          />
        </li>
      ))}
    </RowList>
  )
}

function PersonDetails({ user, backTo }: { user: User; backTo: string }) {
  const friendships = useStore((state) => state.friendships)
  const library = useStore((state) => state.library)
  const seedBooks = useStore((state) => state.seedBooks)
  const extraBooks = useStore((state) => state.extraBooks)

  const status = useMemo(
    () => friendships.find(({ userId }) => userId === user.id)?.status,
    [friendships, user.id],
  )

  const booksOf = useMemo(() => {
    const books = { ...seedBooks, ...extraBooks }
    return (ids: BookId[]) => ids.flatMap((id) => books[id] ?? [])
  }, [seedBooks, extraBooks])

  const reading = useMemo(() => booksOf(user.readingIds), [booksOf, user.readingIds])
  const read = useMemo(() => booksOf(user.readIds), [booksOf, user.readIds])
  // Each book once: what they have in common is marked on their own lists, not listed again.
  const sharedIds = useMemo(
    () => new Set([...user.readingIds, ...user.readIds].filter((id) => Object.hasOwn(library, id))),
    [library, user.readingIds, user.readIds],
  )

  return (
    <section>
      <PageHeader
        title={user.name}
        subtitle={`@${user.username}`}
        media={<Avatar user={user} size="lg" />}
        backTo={backTo}
        backLabel="Amigos"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pb-3">
          <p className="text-sm text-muted">
            {mutualFriendsLabel(user.mutualFriends)} · {sharedBooksLabel(sharedIds.size)}
          </p>
          <PersonAction user={user} status={status} canRemove />
        </div>
      </PageHeader>

      {reading.length > 0 && (
        <Section title="Está leyendo">
          <BookList books={reading} sharedIds={sharedIds} />
        </Section>
      )}
      {read.length > 0 && (
        <Section title="Últimos leídos">
          <BookList books={read} sharedIds={sharedIds} />
        </Section>
      )}
    </section>
  )
}

export function PersonPage() {
  const { userId } = useParams()
  // The search from Amigos stays in the URL, also after visiting the page of a book.
  const { search } = useLocation()
  const navigate = useNavigate()
  const users = useStore((state) => state.users)
  const user = useMemo(() => users.find(({ id }) => id === userId), [users, userId])
  const backTo = FRIENDS_PATH + search

  if (!user) {
    return (
      <section>
        <PageHeader title="Persona no encontrada" backTo={backTo} backLabel="Amigos" />
        <EmptyState
          icon={UserX}
          title="El enlace no lleva a una persona"
          description="Puede que esté incompleto. Búscala en Amigos."
          action={<Button onClick={() => navigate(backTo)}>Ir a Amigos</Button>}
        />
      </section>
    )
  }

  return <PersonDetails user={user} backTo={backTo} />
}
