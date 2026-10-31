import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Button, InlineConfirm, PageHeader } from '../components'
import { LedgerRow } from '../features/book/LedgerRow'
import { useStore } from '../store'
import { MODELO } from './modelo'

export function ProfilePage() {
  const me = useStore((state) => state.me)
  const resetDemo = useStore((state) => state.resetDemo)
  const books = useStore((state) => Object.keys(state.library).length)
  const friends = useStore((state) => state.friendships.filter((f) => f.status === 'friends').length)
  const [asking, setAsking] = useState(false)

  const confirm = asking && (
    <InlineConfirm
      title="¿Reiniciar la demo?"
      confirmLabel="Reiniciar demo"
      onConfirm={() => {
        resetDemo()
        setAsking(false)
      }}
      onCancel={() => setAsking(false)}
      className="mt-3"
    >
      Vuelves a los libros, carpetas y amigos del comienzo. Pierdes los cambios que hiciste.
    </InlineConfirm>
  )

  if (MODELO === 'c') {
    return (
      <section>
        <PageHeader title="Mi perfil" />
        <dl className="mt-3 md:max-w-lg">
          <LedgerRow label="Nombre">{me.name}</LedgerRow>
          <LedgerRow label="Usuario">@{me.username}</LedgerRow>
          <LedgerRow label="Libros">{books} en tu biblioteca</LedgerRow>
          <LedgerRow label="Amigos">{friends}</LedgerRow>
          <LedgerRow label="Demo">
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-muted">Vuelve al comienzo</span>
              <Button compact variant="quiet" onClick={() => setAsking(true)}>
                Reiniciar demo
              </Button>
            </div>
          </LedgerRow>
        </dl>
        <div className="md:max-w-lg">{confirm}</div>
      </section>
    )
  }

  return (
    <section>
      <PageHeader
        title={me.name}
        subtitle={`@${me.username}`}
        media={<Avatar user={me} size="lg" />}
      />
      <section className="mt-5 md:max-w-lg">
        <h2 className="font-serif text-heading font-semibold">Demo</h2>
        <p className="mt-1 text-muted">
          Vuelve a los libros, carpetas y amigos del comienzo, para repetir una tarea desde cero.
        </p>
        {!asking && (
          <Button icon={RotateCcw} onClick={() => setAsking(true)} className="mt-3">
            Reiniciar demo
          </Button>
        )}
        {confirm}
      </section>
    </section>
  )
}
