import { SearchX, UserPlus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button, EmptyState, PageHeader, SearchField } from '../../components'
import { useStore } from '../../store'
import type { Friendship, User } from '../../types'
import { compareNames, matchesPerson, searchTerm } from './people'
import { PersonRow } from './PersonRow'
import { RowList, Section } from './Section'
import { useKeepRowFocus } from './useKeepRowFocus'

const QUERY_PARAM = 'q'

type StatusOf = (user: User) => Friendship['status'] | undefined

interface PeopleListProps {
  people: User[]
  statusOf: StatusOf
  showFriendState?: boolean
}

function PeopleList({ people, statusOf, showFriendState }: PeopleListProps) {
  return (
    <RowList>
      {people.map((user) => (
        <PersonRow
          key={user.id}
          user={user}
          status={statusOf(user)}
          showFriendState={showFriendState}
        />
      ))}
    </RowList>
  )
}

function SearchResults({
  people,
  query,
  statusOf,
}: {
  people: User[]
  query: string
  statusOf: StatusOf
}) {
  if (people.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No encontramos a nadie"
        description={`Nadie coincide con «${query.trim()}». Prueba con otro nombre o @usuario.`}
      />
    )
  }
  return (
    <section>
      <h2 className="sr-only">Resultados</h2>
      <PeopleList people={people} statusOf={statusOf} showFriendState />
    </section>
  )
}

function FriendLists({ users, statusOf }: { users: User[]; statusOf: StatusOf }) {
  const pending = useMemo(
    () => users.filter((user) => statusOf(user) === 'pending').sort(compareNames),
    [users, statusOf],
  )
  const friends = useMemo(
    () => users.filter((user) => statusOf(user) === 'friends').sort(compareNames),
    [users, statusOf],
  )

  if (pending.length === 0 && friends.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aún no tienes amigos"
        description="Busca a una persona por su nombre o @usuario para agregarla."
      />
    )
  }
  return (
    <>
      {pending.length > 0 && (
        <Section title="Solicitudes pendientes">
          <PeopleList people={pending} statusOf={statusOf} />
        </Section>
      )}
      {friends.length > 0 && (
        <Section title="Tus amigos">
          <PeopleList people={friends} statusOf={statusOf} />
        </Section>
      )}
    </>
  )
}

export function FriendsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  // The router applies a URL change as a transition, so a field fed only by the URL loses letters.
  const [query, setQuery] = useState(searchParams.get(QUERY_PARAM) ?? '')
  const users = useStore((state) => state.users)
  const friendships = useStore((state) => state.friendships)
  const showToast = useStore((state) => state.showToast)
  const rows = useKeepRowFocus(friendships)

  const statusOf = useMemo<StatusOf>(() => {
    const statuses = new Map(friendships.map(({ userId, status }) => [userId, status]))
    return ({ id }) => statuses.get(id)
  }, [friendships])

  const term = searchTerm(query)
  const results = useMemo(() => users.filter((user) => matchesPerson(user, term)), [users, term])

  // Replaces the entry, so Back leaves Amigos instead of undoing each letter.
  function search(value: string) {
    setQuery(value)
    setSearchParams(value ? { [QUERY_PARAM]: value } : {}, { replace: true })
  }

  return (
    <section>
      <PageHeader
        title="Amigos"
        backTo="/mas"
        backLabel="Más"
        action={
          <Button
            variant="quiet"
            compact
            icon={UserPlus}
            onClick={() => showToast('Este prototipo no envía invitaciones')}
            className="-mr-2.5"
          >
            Invitar contactos
          </Button>
        }
      >
        <SearchField
          label="Buscar personas"
          placeholder="Nombre o @usuario"
          value={query}
          onChange={search}
          // The first column of the rows under it, with the gap of RowList.
          className="mb-4 md:w-[calc((100%-0.625rem)/2)]"
        />
      </PageHeader>

      <div {...rows}>
        {term ? (
          <SearchResults people={results} query={query} statusOf={statusOf} />
        ) : (
          <FriendLists users={users} statusOf={statusOf} />
        )}
      </div>
    </section>
  )
}
