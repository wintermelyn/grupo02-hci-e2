import { RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, InlineConfirm, PageHeader } from '../../components'
import { forgetSearches } from '../../lib/openlibrary'
import { useStore } from '../../store'
import { clearRecentSearches } from '../search/recentSearchStore'

export function ProfilePage() {
  const me = useStore((state) => state.me)
  const resetDemo = useStore((state) => state.resetDemo)
  const showToast = useStore((state) => state.showToast)
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
    forgetSearches()
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
      />
      <section className="mt-5 md:max-w-lg">
        <h2 className="font-serif text-heading font-semibold">Demo</h2>
        <p className="mt-1 text-muted">
          Vuelve a los libros, carpetas y amigos del comienzo, para repetir una tarea desde cero.
        </p>
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
          <Button
            ref={resetButton}
            icon={RotateCcw}
            onClick={() => setAsking(true)}
            className="mt-3"
          >
            Reiniciar demo
          </Button>
        )}
      </section>
    </section>
  )
}
