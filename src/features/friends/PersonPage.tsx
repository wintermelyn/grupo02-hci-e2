import { UserX } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import {
  Avatar,
  BookCover,
  bookPath,
  BookRow,
  Button,
  EmptyState,
  PageHeader,
} from '../../components'
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

/** Covers instead of rows: these books are often listed just above, under the same person. */
function SharedBooks({ books }: { books: Book[] }) {
  const { pathname, search } = useLocation()
  return (
    <ul className="mt-2.5 grid grid-cols-3 gap-2.5 md:grid-cols-6 md:gap-4">
      {books.map((book) => (
        <li key={book.id}>
          <Link
            to={bookPath(book.id)}
            state={{ from: pathname + search }}
            className="block rounded-control active:bg-shell"
          >
            <BookCover book={book} />
            <span className="mt-1.5 line-clamp-2 block font-serif text-sm font-semibold">
              {book.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
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
        media={<Avatar user={user} size="lg" />}
        backTo={backTo}
        backLabel="Amigos"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 md:justify-start md:gap-x-6">
        <p className="text-muted">{mutualFriendsLabel(user.mutualFriends)}</p>
        <PersonAction user={user} status={status} canRemove />
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
          <SharedBooks books={shared} />
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
