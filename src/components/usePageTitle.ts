import { useEffect, type RefObject } from 'react'

const PRODUCT = 'Goodreads'

/**
 * Every page already says its name in its h1, so the tab and a screen reader get that same name. It
 * watches the page instead of the route, because a view of Inicio or a book that finishes loading
 * change the h1 without changing the path.
 */
export function usePageTitle(main: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const page = main.current
    if (!page) return
    const update = () => {
      const name = page.querySelector('h1')?.textContent
      document.title = name ? `${name} · ${PRODUCT}` : PRODUCT
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(page, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [main])
}
