/**
 * The second click of a double tap would land on whatever was behind a panel or menu that just
 * closed, such as the navigation bar. event.detail counts the clicks of a double tap, so the next
 * click is the only one that can be that second click.
 */
export function ignoreSecondClick() {
  const ignore = (event: MouseEvent) => {
    if (event.detail < 2) return
    event.preventDefault()
    event.stopPropagation()
  }
  window.addEventListener('click', ignore, { capture: true, once: true })
}
