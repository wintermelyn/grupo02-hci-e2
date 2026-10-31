import { ArrowRight, CircleUser, Users, type LucideIcon } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Avatar, PageHeader } from '../../components'
import { useStore } from '../../store'
import type { User } from '../../types'
import { compareNames, friendsLabel, requestsLabel } from '../friends/people'

interface MoreCardProps {
  to: string
  label: string
  icon: LucideIcon
  /** What the person finds there, in their own words. */
  hint: string
  /** Who is behind the link, with data the app already has. */
  children: ReactNode
}

/**
 * The link names the card and reaches over all of it, so only the name is announced as the link and
 * the rest can be read on its own.
 */
function MoreCard({ to, label, icon: Icon, hint, children }: MoreCardProps) {
  return (
    <li className="group relative flex min-w-0 flex-col rounded-tile bg-shell px-5 pt-2 pb-5 transition-[background-color,translate] duration-150 hover:bg-sand active:translate-y-px active:bg-sand-deep">
      <Link
        to={to}
        className="flex min-h-14 items-center gap-3 section-title outline-none after:absolute after:inset-0 after:rounded-tile focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink"
      >
        <Icon aria-hidden size={22} className="shrink-0 text-muted" />
        <span className="min-w-0 flex-1">{label}</span>
        <ArrowRight
          aria-hidden
          size={22}
          className="shrink-0 transition-[translate] duration-150 group-hover:translate-x-1"
        />
      </Link>
      <p className="text-sm text-muted">{hint}</p>
      <div className="mt-4 flex min-h-10 items-center gap-3">{children}</div>
    </li>
  )
}

const MAX_FACES = 5

/** Overlapping faces: the ring takes the colour of the card, which changes under the cursor. */
function Faces({ people }: { people: User[] }) {
  return (
    <span className="flex shrink-0">
      {people.slice(0, MAX_FACES).map((person) => (
        <Avatar
          key={person.id}
          user={person}
          className="-ml-1.5 ring-2 ring-shell first:ml-0 transition-[box-shadow] duration-150 group-hover:ring-sand group-active:ring-sand-deep"
        />
      ))}
    </span>
  )
}

function FriendsSummary() {
  const users = useStore((state) => state.users)
  const friendships = useStore((state) => state.friendships)

  const friends = useMemo(() => {
    const ids = new Set(
      friendships.filter(({ status }) => status === 'friends').map((f) => f.userId),
    )
    return users.filter(({ id }) => ids.has(id)).sort(compareNames)
  }, [users, friendships])
  const pending = friendships.filter(({ status }) => status === 'pending').length

  return (
    <>
      {friends.length > 0 && <Faces people={friends} />}
      <p className="min-w-0">
        <span className="block font-semibold">
          {friends.length > 0 ? friendsLabel(friends.length) : 'Aún no tienes amigos'}
        </span>
        {pending > 0 && <span className="block text-sm text-muted">{requestsLabel(pending)}</span>}
      </p>
    </>
  )
}

function ProfileSummary() {
  const me = useStore((state) => state.me)
  return (
    <>
      <Avatar user={me} />
      <p className="min-w-0">
        <span className="block font-semibold">{me.name}</span>
        <span className="block text-sm text-muted">@{me.username}</span>
      </p>
    </>
  )
}

export function MorePage() {
  return (
    <section>
      <PageHeader title="Más" />
      <ul className="grid gap-2.5 md:grid-cols-2 md:gap-4">
        <MoreCard to="/amigos" label="Amigos" icon={Users} hint="Busca a una persona y agrégala">
          <FriendsSummary />
        </MoreCard>
        <MoreCard
          to="/perfil"
          label="Mi perfil"
          icon={CircleUser}
          hint="Tus datos y Reiniciar demo"
        >
          <ProfileSummary />
        </MoreCard>
      </ul>
      <p className="mt-5 text-sm text-muted">
        Este Goodreads es un prototipo de rediseño para un curso universitario.
      </p>
    </section>
  )
}
