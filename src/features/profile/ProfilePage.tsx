import { RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button, InlineConfirm, PageHeader } from '../../components'
import { useStore } from '../../store'
import { friendsLabel } from '../friends/people'
import { clearRecentSearches } from '../search/recentSearchStore'

function booksLabel(count: number): string {
  return count === 1 ? '1 libro' : `${count} libros`
}

export function ProfilePage() {
  const me = useStore((state) => state.me)
  const resetDemo = useStore((state) => state.resetDemo)
  const showToast = useStore((state) => state.showToast)
  const library = useStore((state) => state.library)
  const friendships = useStore((state) => state.friendships)
  const summary = useMemo(() => {
    const friends = friendships.filter(({ status }) => status === 'friends').length
    return `${booksLabel(Object.keys(library).length)} · ${friendsLabel(friends)}`
  }, [library, friendships])
  const [asking, setAsking] = useState(false)
  const resetButton = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef(false)

  // The button only exists again once the confirmation is gone.
  useEffect(() => {
    if (asking || !returnFocus.current) return
    returnFocus.current = false
    resetButton.current?.focus()
  }, [asking])

  function close() {
    returnFocus.current = true
    setAsking(false)
  }

  function reset() {
    resetDemo()
    clearRecentSearches()
    showToast('Demo reiniciada')
    close()
  }

  return (
    <section>
      <PageHeader
        title={me.name}
        subtitle={`@${me.username}`}
        media={<Avatar user={me} size="lg" />}
        backTo="/mas"
        backLabel="Más"
      >
        <p className="text-sm text-muted">{summary}</p>
      </PageHeader>
      <section className="mt-7 lg:mt-10">
        <h2 className="section-title">Demo</h2>
        {asking ? (
          <InlineConfirm
            title="¿Reiniciar la demo?"
            confirmLabel="Reiniciar demo"
            onConfirm={reset}
            onCancel={close}
            className="mt-3"
          >
            Pierdes los cambios que hiciste en tus libros, carpetas y amigos.
          </InlineConfirm>
        ) : (
          <div className="mt-3 rounded-tile bg-shell p-5 md:flex md:items-center md:justify-between md:gap-6">
            <p>
              Vuelve a los libros, carpetas y amigos del comienzo, para repetir una tarea desde
              cero.
            </p>
            <Button
              ref={resetButton}
              icon={RotateCcw}
              onClick={() => setAsking(true)}
              className="mt-3 shrink-0 md:mt-0"
            >
              Reiniciar demo
            </Button>
          </div>
        )}
      </section>
    </section>
  )
}
