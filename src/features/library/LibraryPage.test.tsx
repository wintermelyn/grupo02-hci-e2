import { act, fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { daysAgo, today } from '../../lib/dates'
import { currentLocation, renderApp } from '../../test/router'
import { state, stubAction } from '../../test/store'

const FUNDACION = 'OL46125W'

const main = () => within(screen.getByRole('main'))
const tagButton = (name: RegExp) => main().getByRole('button', { name })
const board = () => main().queryByRole('heading', { name: 'Mis carpetas' })
const prompt = () => main().queryByRole('region', { name: '¿Sigues queriendo leer este libro?' })
const question = () => main().getByRole('heading', { name: '¿Sigues queriendo leer este libro?' })
const searchBox = () => main().getByRole('searchbox', { name: 'Buscar en Mis libros' })
const band = () => screen.getByRole('heading', { level: 1 }).closest('header') as HTMLElement
const toast = () => screen.getByText(/./, { selector: '[role="status"] p' })

function search(value: string) {
  fireEvent.change(searchBox(), { target: { value } })
}

function bookTitles() {
  return main()
    .getAllByRole('listitem')
    .map((item) => within(item).getAllByRole('link').at(-1)?.textContent)
}

describe('LibraryPage', () => {
  it('starts on Todos, with the total and the count of each tag', () => {
    renderApp('/biblioteca')
    expect(screen.getByRole('heading', { level: 1, name: 'Mis libros' })).toBeInTheDocument()
    expect(tagButton(/^Todos: 34 libros/)).toHaveAttribute('aria-pressed', 'true')
    for (const name of [/Lo quiero: 17/, /Lo tengo: 5/, /Leyendo: 2/, /Leído: 10/]) {
      expect(tagButton(name)).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('shows the folder board with Próximos first and a link to each folder', () => {
    renderApp('/biblioteca')
    expect(board()).toBeInTheDocument()
    const links = main().getAllByRole('link')
    expect(links[0]).toHaveTextContent('Próximos')
    expect(links[0]).toHaveTextContent('2 libros · fija')
    expect(links[0]).toHaveAttribute('href', '/biblioteca/carpeta/proximos')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/biblioteca/carpeta/proximos',
      '/biblioteca/carpeta/terror',
      '/biblioteca/carpeta/novela',
      '/biblioteca/carpeta/ciencia-ficcion',
      '/biblioteca/carpeta/regalos',
      '/biblioteca?vista=sin-carpeta',
    ])
  })

  it('counts a book in every folder it belongs to', () => {
    renderApp('/biblioteca')
    expect(main().getByRole('link', { name: /Terror/ })).toHaveTextContent('10 libros')
    expect(main().getByRole('link', { name: /Novela/ })).toHaveTextContent('9 libros')
  })

  it('shows different covers on each card, even for a book in two folders', () => {
    renderApp('/biblioteca')
    const covers = [...screen.getByRole('main').querySelectorAll('img')].map((img) => img.src)
    // Plus the cover of the prompt, which repeats the one on Terror.
    expect(covers).toHaveLength(13)
    expect(new Set(covers).size).toBe(12)
  })

  it('replaces the board with the books of the chosen tag, in title order', () => {
    renderApp('/biblioteca')
    fireEvent.click(tagButton(/^Lo tengo/))
    expect(board()).not.toBeInTheDocument()
    expect(tagButton(/^Lo tengo/)).toHaveAttribute('aria-pressed', 'true')
    expect(currentLocation()).toBe('/biblioteca?tag=owned')
    const titles = bookTitles()
    expect(titles).toHaveLength(5)
    expect(titles[0]).toMatch(/^Drácula/)
    expect(titles.at(-1)).toMatch(/^Sapiens/)
    for (const title of titles) expect(title).not.toContain('Lo tengo')
  })

  it('shows the 17 books of Lo quiero, as T2 expects', () => {
    renderApp('/biblioteca?tag=want')
    expect(bookTitles()).toHaveLength(17)
  })

  it('goes back to the board with Todos', () => {
    renderApp('/biblioteca?tag=reading')
    fireEvent.click(tagButton(/^Todos/))
    expect(board()).toBeInTheDocument()
    expect(currentLocation()).toBe('/biblioteca')
  })

  it('ignores a tag it does not know', () => {
    renderApp('/biblioteca?tag=otro')
    expect(tagButton(/^Todos/)).toHaveAttribute('aria-pressed', 'true')
    expect(board()).toBeInTheDocument()
  })

  it('follows the store when a tag changes', () => {
    renderApp('/biblioteca?tag=reading')
    expect(bookTitles()).toHaveLength(2)
    act(() => state().setStatus('OL81626W', 'owned'))
    expect(bookTitles()).toHaveLength(1)
    expect(tagButton(/^Lo tengo: 6/)).toBeInTheDocument()
  })

  it('tells what the list is for when a tag has no books', () => {
    renderApp('/biblioteca?tag=reading')
    act(() => {
      state().setStatus('OL81626W', 'owned')
      state().setStatus('OL893414W', 'owned')
    })
    expect(main().getByRole('heading', { name: 'Aún no hay libros aquí' })).toBeInTheDocument()
    expect(main().getByText(/estado «Leyendo»/)).toBeInTheDocument()
  })

  describe('list of a tag', () => {
    const row = (name: RegExp) => main().getByRole('link', { name })

    it('says the folders of each book, since the filter already says the tag', () => {
      renderApp('/biblioteca?tag=want')
      expect(row(/^Fundación/)).toHaveTextContent('Ciencia ficción')
      expect(row(/^Fundación/)).not.toHaveTextContent('Lo quiero')
      expect(row(/^La sombra del viento/)).toHaveTextContent('Próximos · Novela')
    })

    it('shows at once that a book reached Próximos, first of its folders', () => {
      renderApp('/biblioteca?tag=want')
      act(() => state().addToFolder([FUNDACION], 'proximos'))
      expect(row(/^Fundación/)).toHaveTextContent('Próximos · Ciencia ficción')
    })

    it('keeps saying the folders while searching inside the tag', () => {
      renderApp('/biblioteca?tag=want&q=fundaci')
      expect(row(/^Fundación/)).toHaveTextContent('Ciencia ficción')
      expect(row(/^Fundación/)).not.toHaveTextContent('Lo quiero')
    })

    it('keeps the tag in the results of Todos, where nothing else says it', () => {
      renderApp('/biblioteca?q=fundaci')
      expect(row(/^Fundación/)).toHaveTextContent('Lo quiero')
      expect(row(/^Fundación/)).not.toHaveTextContent('Ciencia ficción')
    })
  })

  describe('prompt', () => {
    const IT = 'OL81613W'

    it('asks about It, with how long it has been waiting, in Todos and in Lo quiero', () => {
      renderApp('/biblioteca')
      expect(prompt()).toHaveTextContent('It · 210 días en Lo quiero')
      fireEvent.click(tagButton(/^Lo quiero/))
      expect(prompt()).toHaveTextContent('It · 210 días en Lo quiero')
    })

    it('says what No costs before it is pressed, also to a screen reader', () => {
      renderApp('/biblioteca')
      const cost = 'Si dices No, sale de Mis libros y de Terror'
      expect(prompt()).toHaveTextContent(cost)
      expect(main().getByRole('button', { name: 'No' })).toHaveAccessibleDescription(cost)
    })

    it('does not mention folders for a book in none', () => {
      act(() => state().removeFromFolder([IT], 'terror'))
      renderApp('/biblioteca')
      expect(prompt()).toHaveTextContent('Si dices No, sale de Mis libros')
      expect(prompt()).not.toHaveTextContent('Terror')
    })

    it.each(['owned', 'reading', 'read'])('stays out of the list of %s', (tag) => {
      renderApp(`/biblioteca?tag=${tag}`)
      expect(prompt()).not.toBeInTheDocument()
    })

    it('gives Sí and No the same weight', () => {
      renderApp('/biblioteca')
      const yes = main().getByRole('button', { name: 'Sí' })
      const no = main().getByRole('button', { name: 'No' })
      expect(yes.className).toBe(no.className)
    })

    it('keeps the book with Sí, and does not ask again today', () => {
      renderApp('/biblioteca')
      fireEvent.click(main().getByRole('button', { name: 'Sí' }))
      expect(state().library[IT].wantCheckedAt).toBe(today())
      expect(toast()).toHaveTextContent('«It» sigue en Lo quiero')
      expect(prompt()).not.toBeInTheDocument()
    })

    it('takes the book out with No, and Deshacer brings back the book and the question', () => {
      renderApp('/biblioteca')
      fireEvent.click(main().getByRole('button', { name: 'No' }))
      expect(state().library).not.toHaveProperty(IT)
      expect(toast()).toHaveTextContent('«It» salió de Mis libros y de Terror')
      expect(main().getByRole('link', { name: /Terror/ })).toHaveTextContent('9 libros')

      fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
      expect(state().library[IT].folderIds).toEqual(['terror'])
      expect(prompt()).toHaveTextContent('It · 210 días en Lo quiero')
    })

    describe('after Deshacer', () => {
      it.each([
        ['No', '/biblioteca'],
        ['No', '/biblioteca?tag=want'],
        ['Sí', '/biblioteca'],
        ['Sí', '/biblioteca?tag=want'],
      ])('takes the focus to the question and shows it whole: %s in %s', (answer, path) => {
        const reveal = vi.fn()
        Element.prototype.scrollIntoView = reveal
        onTestFinished(() => {
          Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
        })
        renderApp(path)
        fireEvent.click(main().getByRole('button', { name: answer }), { detail: 1 })
        expect(reveal).not.toHaveBeenCalled()

        fireEvent.click(screen.getByRole('button', { name: 'Deshacer' }))
        expect(question()).toHaveFocus()
        expect(reveal).toHaveBeenCalledExactlyOnceWith({ block: 'nearest' })
        expect(reveal.mock.contexts[0]).toBe(prompt())
      })

      it('does not take the focus when the question is there from the start', () => {
        renderApp('/biblioteca')
        expect(question()).not.toHaveFocus()
      })
    })

    it('calls the action with the book it asks about', () => {
      const answer = stubAction('answerWantPrompt')
      renderApp('/biblioteca')
      fireEvent.click(main().getByRole('button', { name: 'Sí' }))
      expect(answer).toHaveBeenCalledExactlyOnceWith(IT, true)
    })

    it('stays until it is answered, also after leaving the section', () => {
      const { unmount } = renderApp('/biblioteca')
      unmount()
      renderApp('/biblioteca')
      expect(prompt()).toBeInTheDocument()
    })

    it('keeps the second tap from opening what moves up under it', () => {
      renderApp('/biblioteca')
      const no = main().getByRole('button', { name: 'No' })
      const ignored = vi.spyOn(window, 'addEventListener')
      fireEvent.click(no)
      expect(ignored).toHaveBeenCalledWith('click', expect.any(Function), {
        capture: true,
        once: true,
      })
    })

    it('leaves the focus on the content after a tap, not lost with its buttons', () => {
      renderApp('/biblioteca')
      fireEvent.click(main().getByRole('button', { name: 'Sí' }), { detail: 1 })
      expect(document.activeElement).toContainElement(board())
    })

    describe('from the keyboard', () => {
      function answerNo() {
        renderApp('/biblioteca?tag=want')
        const no = main().getByRole('button', { name: 'No' })
        no.focus()
        // The click of Enter or Space counts no clicks.
        fireEvent.click(no, { detail: 0 })
        return screen.getByRole('button', { name: 'Deshacer' })
      }

      it('takes the focus to Deshacer, so it can be reached in time', () => {
        expect(answerNo()).toHaveFocus()
      })

      it('brings the book back and the focus to the question with Enter on Deshacer', () => {
        const undo = answerNo()
        fireEvent.click(undo, { detail: 0 })
        expect(state().library[IT].folderIds).toEqual(['terror'])
        expect(question()).toHaveFocus()
      })

      it('goes on through the list with Tab', () => {
        const undo = answerNo()
        fireEvent.keyDown(undo, { key: 'Tab' })
        expect(document.activeElement).toContainElement(main().getAllByRole('link')[0])
      })
    })

    it('does not appear with every wanted book checked lately', () => {
      for (const entry of Object.values(state().library)) {
        if (entry.status === 'want') {
          act(() =>
            state().commit('x', ({ library }) => ({
              library: { ...library, [entry.bookId]: { ...entry, wantCheckedAt: daysAgo(1) } },
            })),
          )
        }
      }
      renderApp('/biblioteca')
      expect(prompt()).not.toBeInTheDocument()
    })
  })

  describe('search', () => {
    it('goes in the title row, with the name of the product beside it', () => {
      renderApp('/biblioteca')
      expect(band()).toContainElement(searchBox())
      expect(searchBox()).toHaveAttribute('placeholder', 'Buscar en Mis libros')
      expect(within(band()).getByText('Goodreads')).toBeInTheDocument()
      const tags = within(band()).getByRole('group', { name: 'Filtrar por estado' })
      expect(searchBox().compareDocumentPosition(tags)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    it('opens on a phone over the row that was touched, with the focus in the field', () => {
      renderApp('/biblioteca')
      fireEvent.click(main().getByRole('button', { name: 'Buscar en Mis libros' }))
      expect(searchBox()).toHaveFocus()
      expect(searchBox().parentElement?.parentElement).toHaveClass('max-md:absolute')
    })

    it('finds a book by title or author, across the whole library', () => {
      renderApp('/biblioteca')
      search('STEPHEN KING')
      const titles = bookTitles()
      expect(titles.length).toBeGreaterThan(3)
      for (const title of titles) expect(title).toContain('Stephen King')
      expect(board()).not.toBeInTheDocument()
      expect(prompt()).not.toBeInTheDocument()
      expect(currentLocation()).toBe('/biblioteca?q=STEPHEN+KING')
    })

    it('stays within the active tag', () => {
      renderApp('/biblioteca?tag=want')
      search('stephen')
      expect(bookTitles()).toHaveLength(3)
      expect(currentLocation()).toBe('/biblioteca?tag=want&q=stephen')
      fireEvent.click(tagButton(/^Leyendo/))
      expect(searchBox()).toHaveValue('stephen')
      expect(bookTitles()).toHaveLength(1)
    })

    it('comes back from the URL, with the field open', () => {
      renderApp('/biblioteca?tag=want&q=gotico')
      expect(searchBox()).toHaveValue('gotico')
      expect(searchBox()).not.toHaveFocus()
      expect(bookTitles()).toHaveLength(1)
    })

    it('tells a screen reader how many books it found', () => {
      renderApp('/biblioteca')
      search('dune')
      expect(main().getByText('1 libro')).toHaveAttribute('role', 'status')
    })

    it('does not take spaces as a search', () => {
      renderApp('/biblioteca')
      search('   ')
      expect(board()).toBeInTheDocument()
    })

    it('says what it did not find, and where else to look', () => {
      renderApp('/biblioteca')
      search('zzz')
      expect(main().getByRole('heading', { name: 'Sin resultados' })).toBeInTheDocument()
      expect(main().getByText(/Nada en Mis libros coincide con «zzz»/)).toBeInTheDocument()
      expect(main().queryByRole('button', { name: 'Ver todos los libros' })).toBeNull()
    })

    it('says which tag held the search back, and offers the way out', () => {
      renderApp('/biblioteca?tag=read&q=dune')
      expect(
        main().getByText('Ningún libro con el estado «Leído» coincide con «dune».'),
      ).toBeTruthy()
      fireEvent.click(main().getByRole('button', { name: 'Ver todos los libros' }))
      expect(bookTitles()).toHaveLength(1)
      expect(currentLocation()).toBe('/biblioteca?q=dune')
    })

    it('has nothing to search in an empty library', () => {
      act(() => state().removeFromLibrary(Object.keys(state().library)))
      renderApp('/biblioteca')
      expect(main().queryByRole('searchbox')).not.toBeInTheDocument()
    })

    describe('when the section is touched again', () => {
      const section = () => screen.getAllByRole('link', { name: 'Mis libros' })[0]

      it('goes back to the board with an empty field', () => {
        renderApp('/biblioteca')
        search('king')
        fireEvent.click(section())
        expect(currentLocation()).toBe('/biblioteca')
        expect(searchBox()).toHaveValue('')
        expect(board()).toBeInTheDocument()
      })

      it('also leaves the active tag', () => {
        renderApp('/biblioteca?tag=want&q=stephen')
        fireEvent.click(section())
        expect(searchBox()).toHaveValue('')
        expect(tagButton(/^Todos/)).toHaveAttribute('aria-pressed', 'true')
        expect(board()).toBeInTheDocument()
      })

      it('closes the field that a phone opened, which covers the title', () => {
        renderApp('/biblioteca')
        fireEvent.click(main().getByRole('button', { name: 'Buscar en Mis libros' }))
        search('king')
        fireEvent.click(section())
        expect(main().getByRole('button', { name: 'Buscar en Mis libros' })).toBeInTheDocument()
      })

      it('keeps the field open on a phone after deleting what was written', () => {
        renderApp('/biblioteca')
        fireEvent.click(main().getByRole('button', { name: 'Buscar en Mis libros' }))
        search('king')
        search('')
        expect(main().queryByRole('button', { name: 'Buscar en Mis libros' })).toBeNull()
      })
    })

    it('leaves the list of books without a folder with its tag', () => {
      renderApp('/biblioteca?vista=sin-carpeta')
      fireEvent.click(tagButton(/^Leído/))
      expect(currentLocation()).toBe('/biblioteca?tag=read')
    })
  })
})
