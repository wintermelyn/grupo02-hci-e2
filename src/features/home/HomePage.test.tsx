import { fireEvent, screen, within } from '@testing-library/react'
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

  it.each([
    [2, 'grid-cols-2'],
    [3, 'grid-cols-3'],
  ])('lays out %i books in their columns', (count, columns) => {
    setReadingBooks(count)
    renderApp('/')
    const section = screen.getByRole('heading', { name: 'Leyendo ahora' }).closest('section')!
    expect(within(section).getByRole('list')).toHaveClass(columns)
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
    expect(button).toHaveAccessibleName('Me gusta')
    expect(button).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(button)
    expect(button).toHaveAccessibleName('Te gusta')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Valentina verá que te gustó')).toBeInTheDocument()
    expect(button.textContent).not.toMatch(/\d/)
  })

  it('stays in the activity view, which shares it with Inicio', () => {
    state().toggleLike('act-1')
    renderApp('/?actividad=1')
    expect(likeButtons()[0]).toHaveAccessibleName('Te gusta')
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
