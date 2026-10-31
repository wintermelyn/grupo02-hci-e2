import { UserX } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router'
import { Avatar, BookRow, EmptyState, PageHeader } from '../../components'
import { useStore } from '../../store'
import type { Book, BookId, User } from '../../types'
import { FRIENDS_PATH, mutualFriendsLabel } from './people'
import { PersonAction } from './PersonAction'
import { RowList, Section } from './Section'

function BookList({ books }: { books: Book[] }) {
  return (
    <RowList>
      {books.map((book) => (
        <li
          key={book.id}
          className="border-b border-line last:border-b-0 md:nth-last-2:odd:border-b-0"
        >
          <BookRow book={book} />
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
  const shared = useMemo(() => {
    const ids = new Set([...user.readingIds, ...user.readIds])
    return booksOf([...ids].filter((id) => Object.hasOwn(library, id)))
  }, [booksOf, library, user.readingIds, user.readIds])

  return (
    <section>
      <PageHeader
        title={user.name}
        subtitle={`@${user.username}`}
        backTo={backTo}
        backLabel="Amigos"
      />

      <div className="mt-5 flex items-center gap-4">
        <Avatar user={user} size="lg" />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-muted">{mutualFriendsLabel(user.mutualFriends)}</p>
          <PersonAction user={user} status={status} canRemove />
        </div>
      </div>

      {/* BookRow always shows my tag and my stars, which here could pass for the person's. */}
      {shared.length > 0 && (
        <p className="mt-3 text-sm text-muted">
          Los estados y las estrellas de cada libro son los tuyos.
        </p>
      )}

      {reading.length > 0 && (
        <Section title="Está leyendo">
          <BookList books={reading} />
        </Section>
      )}
      {read.length > 0 && (
        <Section title="Últimos leídos">
          <BookList books={read} />
        </Section>
      )}
      <Section title="Libros en común">
        {shared.length > 0 ? (
          <BookList books={shared} />
        ) : (
          <p className="mt-2 text-muted">Todavía no tienen libros en común.</p>
        )}
      </Section>
    </section>
  )
}

export function PersonPage() {
  const { userId } = useParams()
  // The search from Amigos stays in the URL, also after visiting the page of a book.
  const { search } = useLocation()
  const users = useStore((state) => state.users)
  const user = useMemo(() => users.find(({ id }) => id === userId), [users, userId])
  const backTo = FRIENDS_PATH + search

  if (!user) {
    return (
      <section>
        <PageHeader title="Persona no encontrada" backTo={backTo} backLabel="Amigos" />
        <EmptyState
          icon={UserX}
          title="No encontramos a esta persona"
          description="Puede que el enlace esté incompleto. Vuelve a Amigos para buscarla."
        />
      </section>
    )
  }

  return <PersonDetails user={user} backTo={backTo} />
}
