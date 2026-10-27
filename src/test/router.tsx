import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { appRoutes } from '../routes'
import { CURRENT_LOCATION_TEST_ID, CurrentLocation } from './CurrentLocation'

interface RouterOptions {
  /** Route pattern `ui` is mounted at, e.g. "/libro/:bookId". */
  route?: string
  /** URL the router starts at; defaults to `route`. */
  path?: string
}

/** The URL the router is on, query string included, e.g. "/libro/OL1W?accion=terminar". */
export function currentLocation(): string | null {
  return screen.getByTestId(CURRENT_LOCATION_TEST_ID).textContent
}

/** Renders `ui` as the element of `route`. Navigating elsewhere unmounts it. */
export function renderWithRouter(
  ui: ReactElement,
  { route = '/', path = route }: RouterOptions = {},
) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={route} element={ui} />
        <Route path="*" element={null} />
      </Routes>
      <CurrentLocation />
    </MemoryRouter>,
  )
}

/** Renders the whole app (AppShell and every page) at `path`. */
export function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>{appRoutes}</Routes>
      <CurrentLocation />
    </MemoryRouter>,
  )
}
