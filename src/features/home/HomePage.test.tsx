import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { daysAgo, today } from '../../lib/dates'
import { useStore } from '../../store'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'
import { BATCH_SIZE } from './ActivityView'
import { PREVIEW_LENGTH } from './ActivityPreview'

const FEED_LENGTH = 10
const page = document.documentElement

const activityRows = () =>
  screen
    .getAllByRole('listitem')
    .filter((item) => within(item).queryByRole('button', { name: /gusta/ }))

const likeButtons = () => screen.getAllByRole('button', { name: /gusta/ })
const viewTitle = () => screen.getByText('Actividad de tus amigos', { selector: 'h1 span' })

function scrollPageTo(top: number) {
  page.scrollTop = top
  fireEvent.scroll(window)
}

function setReadingBooks(count: number) {
  const entries = Object.values(state().library).slice(0, count)
  useStore.setState(({ library }) => ({
    library: {
      ...Object.fromEntries(
        Object.entries(library).map(([id, entry]) => [
          id,
          entry.status === 'reading' ? { ...entry, status: 'owned' as const } : entry,
        ]),
      ),
      ...Object.fromEntries(
        entries.map((entry) => [
          entry.bookId,
          { ...entry, status: 'reading' as const, startedAt: today() },
        ]),
      ),
    },
  }))
}

describe('Inicio', () => {
  it('shows what the person is reading, how long for, and opens the book', () => {
    renderApp('/')
    const section = screen.getByRole('heading', { name: 'Leyendo ahora' }).closest('section')!
    expect(within(section).getByText('Llevas 12 días')).toBeInTheDocument()
    expect(within(section).getByText('Llevas 30 días')).toBeInTheDocument()
    expect(within(section).getByRole('link', { name: /Carrie/ })).toHaveAttribute(
      'href',
      '/libro/OL81626W',
    )
  })

  it('lets a long word of a title break, so three columns do not cut it', () => {
    setReadingBooks(3)
    renderApp('/')
    const section = screen.getByRole('heading', { name: 'Leyendo ahora' }).closest('section')!
    const [{ book }] = Object.values(state().library).flatMap(({ bookId, status }) =>
      status === 'reading' ? [{ book: state().getBook(bookId)! }] : [],
    )
    expect(within(section).getByText(book.title)).toHaveClass('hyphens-auto', 'wrap-anywhere')
  })

  it.each([
    [2, 'grid-cols-2'],
    [3, 'grid-cols-3'],
  ])('lays out %i books in their columns', (count, columns) => {
    setReadingBooks(count)
    renderApp('/')
    const section = screen.getByRole('heading', { name: 'Leyendo ahora' }).closest('section')!
    expect(within(section).getByRole('list')).toHaveClass(columns)
  })

  it('gives one book the whole width', () => {
    setReadingBooks(1)
    renderApp('/')
    const section = screen.getByRole('heading', { name: 'Leyendo ahora' }).closest('section')!
    expect(within(section).getByRole('list')).toHaveClass('grid-cols-1')
  })

  it('tints each reading card with the colour of its book', () => {
    renderApp('/')
    expect(screen.getByRole('link', { name: /Carrie/ }).style.backgroundColor).not.toBe('')
  })

  it('says on a reading card which friend has the same book', () => {
    renderApp('/')
    const section = screen.getByRole('heading', { name: 'Leyendo ahora' }).closest('section')!
    expect(within(section).getByRole('link', { name: /Dune/ })).toHaveTextContent('Diego empezó')
  })

  it('puts the rows on shell, with the cover loose and no tone of its book', () => {
    renderApp('/')
    const [row] = activityRows()
    expect(row).toHaveClass('bg-shell', 'hover:bg-sand')
    expect(row).not.toHaveClass('bg-white', 'border')
    expect(row.firstElementChild).not.toHaveAttribute('style')
  })

  it('opens the book from the whole row, with the avatar and the heart over it', () => {
    renderApp('/')
    const [row] = activityRows()
    expect(within(row).getByRole('link', { name: /Nuestra parte de noche/ })).toHaveClass(
      'after:inset-0',
    )
    expect(within(row).getByRole('button', { name: /gusta/ })).toHaveClass('relative', 'z-10')
  })

  it('shows the last 5 activities and a way to the rest, with how many there are', () => {
    renderApp('/')
    expect(activityRows()).toHaveLength(PREVIEW_LENGTH)
    expect(
      screen.getByRole('link', { name: `Ver toda la actividad (${FEED_LENGTH})` }),
    ).toHaveAttribute('href', '/?actividad=1')
  })

  it('has no way to the rest when everything already fits', () => {
    useStore.setState(({ activities }) => ({ activities: activities.slice(0, PREVIEW_LENGTH) }))
    renderApp('/')
    expect(screen.queryByRole('link', { name: /Ver toda la actividad/ })).not.toBeInTheDocument()
  })

  it('says who did what, and the avatar goes to the person', () => {
    renderApp('/')
    const [row] = activityRows()
    expect(row).toHaveTextContent('Valentina empezó · Hoy')
    expect(within(row).getByRole('link', { name: /Nuestra parte de noche/ })).toHaveAttribute(
      'href',
      '/libro/OL20901051W',
    )
    expect(within(row).getByRole('link', { name: 'Ver a Valentina Soto' })).toHaveAttribute(
      'href',
      '/amigos/valentina',
    )
  })

  it('keeps a short date on the line of the person, and the title in one line', () => {
    const [activity] = state().activities
    useStore.setState({
      activities: [{ ...activity, kind: 'want', userId: 'valentina', date: daysAgo(13) }],
    })
    renderApp('/')
    const [longest] = activityRows()
    expect(longest).toHaveTextContent('Valentina quiere leer · 13 d')
    expect(longest).not.toHaveTextContent('Hace 13 días')
    // What gives way on a narrow row is the sentence, never the date.
    expect(within(longest).getByText('· 13 d')).toHaveClass('shrink-0')
    expect(within(longest).getByText(state().getBook(activity.bookId)!.title)).toHaveClass(
      'line-clamp-1',
    )
  })

  it('leaves the author for a computer', () => {
    renderApp('/')
    const [activity] = state().activities
    const [row] = activityRows()
    expect(within(row).getByText(state().getBook(activity.bookId)!.authors[0])).toHaveClass(
      'max-lg:hidden',
    )
  })

  it('offers a way out when nothing is being read', () => {
    setReadingBooks(0)
    renderApp('/')
    expect(screen.getByText('No estás leyendo ningún libro')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Ir a Mis libros' }))
    expect(currentLocation()).toBe('/biblioteca')
  })

  it('offers a way to friends when there is no activity', () => {
    useStore.setState({ friendships: [] })
    renderApp('/')
    expect(screen.getByText('Aún no hay actividad')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Buscar amigos' }))
    expect(currentLocation()).toBe('/amigos')
  })
})

describe('like', () => {
  it('shows the state and who it reaches, with no counter or names', () => {
    renderApp('/')
    const [button] = likeButtons()
    expect(button).toHaveTextContent('Me gusta')
    expect(button).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(button)
    expect(button).toHaveTextContent('Te gusta')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Valentina verá que te gustó')).toBeInTheDocument()
    expect(button.textContent).not.toMatch(/\d/)
  })

  it('is only the heart in a row of Inicio until a computer, and on a phone in the view', () => {
    renderApp('/')
    const [button] = likeButtons()
    expect(within(button).getByText('Me gusta')).toHaveClass('max-lg:hidden')
    expect(button).toHaveClass('lg:min-w-26')
    cleanup()
    renderApp('/?actividad=1')
    const [inTheView] = likeButtons()
    expect(within(inTheView).getByText('Me gusta')).toHaveClass('max-md:hidden')
    expect(inTheView).toHaveClass('md:min-w-26')
  })

  it('shows the heart filled once it is given, in the shape and not only in the colour', () => {
    renderApp('/')
    const [button] = likeButtons()
    const heart = () => button.querySelector('svg')?.getAttribute('fill')
    expect(heart()).toBe('none')
    fireEvent.click(button)
    expect(heart()).toBe('currentColor')
  })

  it('does not take Deshacer away from a change in the library', () => {
    state().setStatus('OL81626W', 'want')
    renderApp('/')
    fireEvent.click(likeButtons()[0])
    expect(screen.queryByText('Valentina verá que te gustó')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Deshacer/ })).toBeInTheDocument()
    expect(likeButtons()[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('says which activity it acts on, with a name that does not depend on its state', () => {
    renderApp('/')
    const [button] = likeButtons()
    const name = 'Me gusta: Valentina empezó Nuestra parte de noche'
    expect(button).toHaveAccessibleName(name)
    fireEvent.click(button)
    expect(button).toHaveAccessibleName(name)
  })

  it('gives each button its own name', () => {
    renderApp('/')
    const names = likeButtons().map((button) => button.getAttribute('aria-label'))
    expect(new Set(names).size).toBe(names.length)
  })

  it('stays in the activity view, which shares it with Inicio', () => {
    state().toggleLike('act-1')
    renderApp('/?actividad=1')
    expect(likeButtons()[0]).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('activity view', () => {
  const headings = () =>
    screen.getAllByRole('heading', { level: 2 }).map(({ textContent }) => textContent)

  it('opens from Inicio inside the same URL, with its own title and way back', () => {
    renderApp('/')
    fireEvent.click(screen.getByRole('link', { name: /Ver toda la actividad/ }))
    expect(currentLocation()).toBe('/?actividad=1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Actividad de tus amigos')
    expect(screen.getByRole('link', { name: 'Inicio', current: false })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.queryByRole('heading', { name: 'Leyendo ahora' })).not.toBeInTheDocument()
  })

  it('groups by Hoy, Esta semana and Antes', () => {
    renderApp('/?actividad=2')
    expect(headings()).toEqual(['Hoy', 'Esta semana', 'Antes'])
  })

  it('brings more than Inicio from the start', () => {
    expect(BATCH_SIZE).toBeGreaterThan(PREVIEW_LENGTH)
  })

  it('grows by batches and ends clearly', () => {
    renderApp('/?actividad=1')
    expect(activityRows()).toHaveLength(BATCH_SIZE)
    expect(headings()).toEqual(['Hoy', 'Esta semana'])

    fireEvent.click(screen.getByRole('button', { name: `Ver más (${FEED_LENGTH - BATCH_SIZE})` }))
    expect(activityRows()).toHaveLength(FEED_LENGTH)
    expect(currentLocation()).toBe('/?actividad=2')
    expect(screen.queryByRole('button', { name: /Ver más/ })).not.toBeInTheDocument()
    expect(screen.getByText('Ya viste toda la actividad')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver a Inicio' })).toHaveAttribute('href', '/')
  })

  it('moves the focus to the first new row, because the button stays below them', () => {
    renderApp('/?actividad=1')
    fireEvent.click(screen.getByRole('button', { name: /Ver más/ }))
    expect(document.activeElement).toHaveTextContent('Tomás empezó · Hace 6 días')
  })

  it.each(['abc', '0', '-1', ''])('reads the batch "%s" as the first one', (value) => {
    renderApp(`/?actividad=${value}`)
    expect(activityRows()).toHaveLength(BATCH_SIZE)
  })

  it('does not ask for more than there is', () => {
    renderApp('/?actividad=9')
    expect(activityRows()).toHaveLength(FEED_LENGTH)
    expect(screen.getByText('Ya viste toda la actividad')).toBeInTheDocument()
  })

  it('shows the empty state when there are no friends', () => {
    useStore.setState({ friendships: [] })
    renderApp('/?actividad=1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Actividad de tus amigos')
    expect(screen.getByText('Aún no hay actividad')).toBeInTheDocument()
  })

  it('moves the focus to its title, and back to the link when it closes', () => {
    renderApp('/')
    const link = () => screen.getByRole('link', { name: /Ver toda la actividad/ })
    fireEvent.click(link())
    expect(viewTitle()).toHaveFocus()

    fireEvent.click(screen.getByRole('link', { name: 'Inicio', current: false }))
    expect(link()).toHaveFocus()
  })

  it('takes its own width for Ver más from a tablet up', () => {
    renderApp('/?actividad=1')
    const showMore = screen.getByRole('button', { name: /Ver más/ })
    expect(showMore).toHaveClass('max-md:w-full')
    expect(showMore).not.toHaveClass('w-full')
  })

  it('keeps the dot with the date, in the space a wrapped date leaves out of the box', () => {
    renderApp('/?actividad=2')
    const dated = activityRows().at(-1) as HTMLElement
    const date = within(dated)
      .getAllByText(/Hace \d+ días/)
      .at(-1) as HTMLElement
    expect(date.querySelector('[aria-hidden]')).toHaveTextContent('·')
    expect(date).toHaveClass('pl-3')
    expect(date.parentElement).toHaveClass('-ml-3', 'flex-wrap')
    expect(date.closest('p')).toHaveClass('overflow-hidden')
  })

  it('leaves the focus alone when the view is opened directly', () => {
    renderApp('/?actividad=1')
    expect(document.body).toHaveFocus()
  })

  it('says the date of each activity, except where the period already says it', () => {
    renderApp('/?actividad=2')
    const [today, ...rest] = activityRows()
    expect(today).toHaveTextContent('Valentina empezó')
    expect(today).not.toHaveTextContent('Hoy')
    const last = rest[rest.length - 1]
    // Twice in the page, for the place it takes on each width.
    expect(within(last).getAllByText(/Hace \d+ días/)).toHaveLength(2)
  })

  it('starts at the top, and Inicio comes back to where it was', () => {
    renderApp('/')
    scrollPageTo(320)
    fireEvent.click(screen.getByRole('link', { name: /Ver toda la actividad/ }))
    expect(page.scrollTop).toBe(0)

    fireEvent.click(screen.getByRole('link', { name: 'Inicio', current: false }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Inicio')
    expect(page.scrollTop).toBe(320)
  })

  it('does not move the page when a new batch arrives', () => {
    renderApp('/?actividad=1')
    scrollPageTo(500)
    fireEvent.click(screen.getByRole('button', { name: /Ver más/ }))
    expect(page.scrollTop).toBe(500)
  })

  it('takes the book page back to the view, with how far it was read', () => {
    renderApp('/?actividad=2')
    const [row] = activityRows()
    fireEvent.click(within(row).getByRole('link', { name: /Nuestra parte de noche/ }))
    expect(currentLocation()).toBe('/libro/OL20901051W')
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/?actividad=2')
  })

  it('keeps a rating of each friend on the row', () => {
    renderApp('/?actividad=1')
    expect(screen.getAllByRole('img', { name: '5 de 5 estrellas' })).toHaveLength(2)
  })

  it('files an activity of today under Hoy even if it is the only one', () => {
    useStore.setState(({ activities }) => ({
      activities: [{ ...activities[0], date: daysAgo(0) }],
    }))
    renderApp('/?actividad=1')
    expect(headings()).toEqual(['Hoy'])
  })
})
