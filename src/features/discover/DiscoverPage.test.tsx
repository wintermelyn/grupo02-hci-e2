import { act, fireEvent, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DISCOVER_LISTS, FOR_YOU_LIST_ID } from '../../data/seedDiscover'
import { useStore } from '../../store'
import { currentLocation, renderApp } from '../../test/router'
import { state } from '../../test/store'

const STEP = 200
const SETTLE = 150

const [forYou, classics] = DISCOVER_LISTS
const FIRST = 'OL17319533W'
const SECOND = 'OL59800W'
const LAST = forYou.bookIds[forYou.bookIds.length - 1]

const titleOf = (id: string) => state().getBook(id)!.title
const count = (text: string) => screen.getByText(new RegExp(`${text}$`))
const pressed = () => screen.getByRole('button', { pressed: true })
const rail = () => screen.getByRole('list', { name: /Libros de/ })
const front = () => within(rail()).getByRole('link')
const nextButton = () => screen.getByRole('button', { name: 'Libro siguiente', hidden: true })
const backButton = () => screen.getByRole('button', { name: 'Libro anterior', hidden: true })

/** jsdom has no layout: every cover measures STEP, and a scroll lands at once, as in a real one. */
function giveLayout() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: STEP,
  } as DOMRect)
  const scrollTo = vi.fn(function (this: HTMLElement, { left }: ScrollToOptions) {
    this.scrollLeft = left ?? 0
  })
  Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo
  return scrollTo
}

function reduceMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced && query.includes('reduce'),
  }))
}

beforeEach(() => {
  vi.useFakeTimers()
  return () => vi.unstubAllGlobals()
})

afterEach(() => {
  // @ts-expect-error jsdom has no scrollTo, and each test that needs it brings its own.
  delete Element.prototype.scrollTo
})

describe('the lists', () => {
  it('shows the four lists at the same level, "Seleccionados para ti" first and chosen', () => {
    renderApp('/descubrir')
    const group = screen.getByRole('group', { name: 'Listas' })
    expect(
      within(group)
        .getAllByRole('button')
        .map(({ textContent }) => textContent),
    ).toEqual(DISCOVER_LISTS.map(({ label }) => label))
    expect(pressed()).toHaveTextContent('Para ti')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Seleccionados para ti')
  })

  it('changes list in place, starts on its first book and leaves Back alone', () => {
    renderApp('/descubrir')
    fireEvent.click(screen.getByRole('button', { name: classics.label }))
    expect(pressed()).toHaveTextContent(classics.label)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(classics.title)
    expect(count(`1 de ${classics.bookIds.length}`)).toBeInTheDocument()
    expect(currentLocation()).toBe(`/descubrir?lista=${classics.id}`)
  })

  it('goes back to the first list without anything in the URL', () => {
    renderApp(`/descubrir?lista=${classics.id}`)
    fireEvent.click(screen.getByRole('button', { name: forYou.label }))
    expect(currentLocation()).toBe('/descubrir')
  })

  it('takes a list that does not exist for the first one', () => {
    renderApp('/descubrir?lista=nada')
    expect(pressed()).toHaveTextContent('Para ti')
  })
})

describe('what it shows of a book', () => {
  it('says the place in the list, its title, its facts and why it is there', () => {
    renderApp('/descubrir')
    expect(count('1 de 6')).toBeInTheDocument()
    const book = state().getBook(FIRST)!
    expect(screen.getByText(book.title)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(book.authors[0]))).toBeInTheDocument()
    expect(screen.getByText(forYou.reasons![FIRST])).toBeInTheDocument()
  })

  it('gives no reason in a list that was not made for the person', () => {
    renderApp(`/descubrir?lista=${classics.id}`)
    expect(screen.queryByText(/Porque guardas/)).not.toBeInTheDocument()
  })

  it('says so in the same place when a book has no description', () => {
    useStore.setState(({ seedBooks }) => ({
      seedBooks: { ...seedBooks, [FIRST]: { ...seedBooks[FIRST], description: undefined } },
    }))
    renderApp('/descubrir')
    expect(screen.getByText('Aún no tenemos descripción de este libro.')).toBeInTheDocument()
  })

  it('has one main action, which opens the book', () => {
    renderApp('/descubrir')
    const link = screen.getByRole('link', { name: `Ver ficha de ${titleOf(FIRST)}` })
    fireEvent.click(link)
    expect(currentLocation()).toBe(`/libro/${FIRST}`)
  })

  it('never shows the word of the plan for a tag', () => {
    state().setStatus(classics.bookIds[0], 'want')
    renderApp(`/descubrir?lista=${classics.id}`)
    expect(document.body.textContent).not.toMatch(/\btag\b/i)
  })
})

describe('what is already in the library', () => {
  it('hides it from "Seleccionados para ti"', () => {
    state().setStatus(FIRST, 'want')
    renderApp('/descubrir')
    expect(count('1 de 5')).toBeInTheDocument()
    expect(screen.queryByText(titleOf(FIRST))).not.toBeInTheDocument()
  })

  it('keeps it in the other lists, with its tag', () => {
    const [id] = classics.bookIds
    state().setStatus(id, 'owned')
    renderApp(`/descubrir?lista=${classics.id}`)
    expect(count(`1 de ${classics.bookIds.length}`)).toBeInTheDocument()
    expect(screen.getByText('Lo tengo').closest('.shrink-0')).toBeInTheDocument()
    expect(rail().querySelector('.ribbon')).toBeInTheDocument()
  })

  it('shows no tag for a book outside the library', () => {
    renderApp(`/descubrir?lista=${classics.id}`)
    expect(screen.queryByText(/Lo quiero|Lo tengo|Leyendo|Leído/)).not.toBeInTheDocument()
    expect(rail().querySelector('.ribbon')).not.toBeInTheDocument()
  })

  it('offers another list when every book of the selection is taken, keeping the picker', () => {
    forYou.bookIds.forEach((id) => state().setStatus(id, 'want'))
    renderApp('/descubrir')
    expect(screen.getByText('Ya guardaste todos estos libros')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Listas' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: `Ver ${classics.title}` }))
    expect(pressed()).toHaveTextContent(classics.label)
  })

  it('has no way forward with a single book, but still opens it', () => {
    forYou.bookIds.slice(1).forEach((id) => state().setStatus(id, 'want'))
    renderApp('/descubrir')
    expect(count('1 de 1')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Libro siguiente', hidden: true })).toBeNull()
    expect(within(rail()).getAllByRole('listitem')).toHaveLength(1)
  })
})

describe('the carousel', () => {
  it('goes three times through the list, with only the book in front for assistive tech', () => {
    renderApp('/descubrir')
    expect(rail().children).toHaveLength(18)
    expect(within(rail()).getAllByRole('listitem')).toHaveLength(1)
    expect(front()).toHaveAccessibleName(`${titleOf(FIRST)}, ${state().getBook(FIRST)!.authors[0]}`)
  })

  it('leaves one book in the tab order', () => {
    renderApp('/descubrir')
    const links = [...rail().querySelectorAll('a')]
    expect(links.filter(({ tabIndex }) => tabIndex === 0)).toEqual([front()])
  })

  it('starts on the middle copy', () => {
    giveLayout()
    renderApp('/descubrir')
    expect(rail().scrollLeft).toBe(6 * STEP)
  })

  it('opens the book in front', () => {
    giveLayout()
    renderApp('/descubrir')
    fireEvent.click(front())
    expect(currentLocation()).toBe(`/libro/${FIRST}`)
  })

  it('brings a side cover to the centre instead of opening it', () => {
    const scrollTo = giveLayout()
    renderApp('/descubrir')
    const side = rail().children[7].querySelector('a')!
    fireEvent.click(side)
    expect(currentLocation()).toBe('/descubrir')
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: 7 * STEP }))
    expect(count('2 de 6')).toBeInTheDocument()
    expect(front()).toHaveAccessibleName(new RegExp(titleOf(SECOND)))
  })

  it('moves one book with the edges of the scene', () => {
    giveLayout()
    renderApp('/descubrir')
    fireEvent.click(nextButton())
    expect(count('2 de 6')).toBeInTheDocument()
    fireEvent.click(backButton())
    expect(count('1 de 6')).toBeInTheDocument()
  })

  it('keeps the edges out of the tab order, because the arrow keys do that job', () => {
    renderApp('/descubrir')
    expect(nextButton()).toHaveAttribute('tabindex', '-1')
  })

  it('has no end: after the last book comes the first, and before the first, the last', () => {
    giveLayout()
    renderApp('/descubrir')
    fireEvent.click(backButton())
    expect(count('6 de 6')).toBeInTheDocument()
    expect(screen.getByText(titleOf(LAST), { selector: 'a span' })).toBeInTheDocument()
    fireEvent.click(nextButton())
    expect(count('1 de 6')).toBeInTheDocument()
  })

  it('stays in the middle copy after coming to rest, however far it went', () => {
    giveLayout()
    renderApp('/descubrir')
    for (let click = 0; click < 8; click += 1) fireEvent.click(nextButton())
    act(() => {
      vi.advanceTimersByTime(SETTLE)
    })
    expect(count('3 de 6')).toBeInTheDocument()
    expect(rail().scrollLeft).toBeGreaterThanOrEqual(6 * STEP)
    expect(rail().scrollLeft).toBeLessThan(12 * STEP)
  })

  it('gives the snap back after coming to rest, or the next drag would stop anywhere', () => {
    giveLayout()
    vi.stubGlobal('requestAnimationFrame', (run: FrameRequestCallback) => setTimeout(run))
    renderApp('/descubrir')
    for (let click = 0; click < 6; click += 1) fireEvent.click(backButton())
    expect(rail().style.scrollSnapType).toBe('none')
    act(() => {
      vi.advanceTimersByTime(SETTLE)
    })
    expect(rail().style.scrollSnapType).toBe('')
  })

  it('comes to rest when the mouse lets go', () => {
    giveLayout()
    renderApp('/descubrir')
    rail().scrollLeft = 13 * STEP
    fireEvent.pointerUp(rail())
    act(() => {
      vi.advanceTimersByTime(SETTLE)
    })
    expect(rail().scrollLeft).toBe(7 * STEP)
    expect(count('2 de 6')).toBeInTheDocument()
  })

  it('follows a finger: the count changes while the rail scrolls', () => {
    giveLayout()
    renderApp('/descubrir')
    rail().scrollLeft = 8 * STEP
    fireEvent.scroll(rail())
    expect(count('3 de 6')).toBeInTheDocument()
  })

  it('does not fight a finger that is still on the rail', () => {
    giveLayout()
    renderApp('/descubrir')
    fireEvent.touchStart(rail())
    rail().scrollLeft = 12 * STEP
    fireEvent.scroll(rail())
    act(() => {
      vi.advanceTimersByTime(SETTLE)
    })
    expect(rail().scrollLeft).toBe(12 * STEP)

    fireEvent.touchEnd(rail())
    act(() => {
      vi.advanceTimersByTime(SETTLE)
    })
    expect(rail().scrollLeft).toBe(6 * STEP)
  })
})

describe('with a keyboard', () => {
  it('moves with the arrows and takes the focus along', () => {
    giveLayout()
    renderApp('/descubrir')
    front().focus()
    fireEvent.keyDown(front(), { key: 'ArrowRight' })
    expect(count('2 de 6')).toBeInTheDocument()
    expect(front()).toHaveFocus()
    expect(front()).toHaveAccessibleName(new RegExp(titleOf(SECOND)))

    fireEvent.keyDown(front(), { key: 'ArrowLeft' })
    expect(count('1 de 6')).toBeInTheDocument()
    expect(front()).toHaveFocus()
  })

  it('keeps the focus when the arrows go past the end of the list', () => {
    giveLayout()
    renderApp('/descubrir')
    front().focus()
    fireEvent.keyDown(front(), { key: 'ArrowLeft' })
    expect(count('6 de 6')).toBeInTheDocument()
    expect(front()).toHaveFocus()
  })

  it('leaves other keys alone', () => {
    giveLayout()
    renderApp('/descubrir')
    fireEvent.keyDown(front(), { key: 'ArrowDown' })
    expect(count('1 de 6')).toBeInTheDocument()
  })
})

describe('with a screen reader', () => {
  it('announces the book and its place when it changes', () => {
    giveLayout()
    renderApp('/descubrir')
    fireEvent.click(nextButton())
    const announcement = count('2 de 6')
    expect(announcement).toHaveAttribute('aria-live', 'polite')
    expect(announcement).toHaveTextContent(`${titleOf(SECOND)}, 2 de 6`)
  })

  it('names the list of the rail', () => {
    renderApp('/descubrir')
    expect(rail()).toHaveAccessibleName(`Libros de ${forYou.title}`)
  })
})

describe('with reduced motion', () => {
  it('jumps instead of sliding', () => {
    const scrollTo = giveLayout()
    reduceMotion(true)
    renderApp('/descubrir')
    fireEvent.click(nextButton())
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }))
  })

  it('slides otherwise', () => {
    const scrollTo = giveLayout()
    reduceMotion(false)
    renderApp('/descubrir')
    fireEvent.click(nextButton())
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }))
  })
})

describe('coming back from a book', () => {
  it('returns to the same list, with that book in front', () => {
    giveLayout()
    const [, second] = classics.bookIds
    renderApp(`/descubrir?lista=${classics.id}`)
    fireEvent.click(nextButton())
    fireEvent.click(front())
    expect(currentLocation()).toBe(`/libro/${second}`)

    fireEvent.click(screen.getByRole('link', { name: 'Volver' }))
    expect(pressed()).toHaveTextContent(classics.label)
    expect(count(`2 de ${classics.bookIds.length}`)).toBeInTheDocument()
  })

  it('starts on the first book if that book has left the list', () => {
    state().setStatus(SECOND, 'want')
    renderApp(`/descubrir?lista=${FOR_YOU_LIST_ID}&libro=${SECOND}`)
    expect(count('1 de 5')).toBeInTheDocument()
  })
})
