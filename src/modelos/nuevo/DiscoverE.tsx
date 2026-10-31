import { useId } from 'react'
import { Ribbon } from '../../components'
import { cx } from '../../components/cx'
import type { Book } from '../../types'
import { Flecha } from './Flecha'
import { useListas, type ListaCargada } from './listas'
import { EnlaceLibro, Portada } from './PiezasLibro'
import { Marca } from './Shell'
import { useRiel } from './useRiel'

function LibroEstante({ book, why }: { book: Book; why?: string }) {
  return (
    <li className="w-[9.5rem] shrink-0 snap-start md:w-44">
      <EnlaceLibro book={book} className="block rounded-[6px]" draggable={false}>
        <span className="portada-viva block">
          <Portada book={book} />
        </span>
        <span className="mt-3 line-clamp-2 font-serif text-[1.0625rem]/[1.25] font-semibold">
          {book.title}
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted">{book.authors[0]}</span>
        {why && (
          <span className="mt-0.5 block text-sm font-semibold text-ribbon">
            {why.replace('Porque guardas ', 'Por ')}
          </span>
        )}
      </EnlaceLibro>
    </li>
  )
}

function Estante({ lista }: { lista: ListaCargada }) {
  const tituloId = useId()
  const { ref, puedeAtras, puedeAdelante, avanzar, rielProps } = useRiel<HTMLUListElement>()
  const cantidad = lista.items.length

  return (
    <section aria-labelledby={tituloId} className="group/estante mt-8 first-of-type:mt-5 lg:mt-12">
      <div className="px-(--gut) lg:hidden">
        <h2 id={tituloId} className="titulo-seccion">
          {lista.title}
        </h2>
        <p className="text-sm text-muted">{lista.note}</p>
      </div>
      <div className="relative mt-3 lg:mt-0">
        <ul
          ref={ref}
          {...rielProps}
          className={cx(
            'riel-sin-barra flex snap-x gap-4 overflow-x-auto px-(--gut) pt-2 pb-3 [--rotulo:15rem] scroll-pl-(--gut) scroll-pr-(--gut) md:gap-5 lg:scroll-pl-[calc(var(--gut)+var(--rotulo)+1.25rem)] lg:cursor-grab',
            puedeAdelante && 'e-sigue',
          )}
        >
          <li
            data-desplazado={puedeAtras}
            className="e-columna sticky left-0 z-10 hidden w-(--rotulo) shrink-0 lg:block"
          >
            <div className="e-rotulo relative flex h-[16.5rem] flex-col rounded-[14px] p-5">
              <Ribbon className="absolute top-0 right-5 h-11 w-3.5 bg-ribbon" />
              <h2 id={tituloId} className="titulo-seccion pr-6">
                {lista.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{lista.note}</p>
              <p className="mt-auto text-sm font-semibold tabular-nums">
                {cantidad} {cantidad === 1 ? 'libro' : 'libros'}
              </p>
            </div>
          </li>
          {lista.items.map((book) => (
            <LibroEstante key={book.id} book={book} why={lista.why?.[book.id]} />
          ))}
          {cantidad === 0 && (
            <li className="flex min-h-40 items-center text-muted">
              Ya guardaste todos estos libros. Vuelve cuando agregues más a tu biblioteca.
            </li>
          )}
        </ul>
        <Flecha
          direccion="atras"
          etiqueta={`Ver libros anteriores de ${lista.title}`}
          onClick={() => avanzar(-1)}
          visible={puedeAtras}
          className="top-[6.5rem] left-[calc(var(--gut)+15rem+0.75rem)] opacity-0 group-focus-within/estante:opacity-100 group-hover/estante:opacity-100 max-lg:left-3"
        />
        <Flecha
          direccion="adelante"
          etiqueta={`Ver más libros de ${lista.title}`}
          onClick={() => avanzar(1)}
          visible={puedeAdelante}
          className="top-[6.5rem] right-4 lg:right-6"
        />
      </div>
    </section>
  )
}

/** Cuatro estantes iguales, como Spotify o Apple Music: todo a la vista, ninguno por encima de otro. */
export function DiscoverE() {
  const listas = useListas()
  return (
    <section className="pt-3 lg:pt-8">
      <header className="px-(--gut)">
        <Marca className="mb-2" />
        <h1 className="titulo-pagina">Descubrir</h1>
      </header>
      {listas.map((lista) => (
        <Estante key={lista.id} lista={lista} />
      ))}
    </section>
  )
}
