import { screen } from '@testing-library/react'
import { createRoutesFromElements, type RouteObject } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { appRoutes } from './routes'
import { currentLocation, renderApp } from './test/router'

// One sample URL per route pattern, using ids that exist in the seed. Adding a route to
// routes.tsx makes the first test fail until it gets a sample here.
const SCREENS: Record<string, string> = {
  '/': '/',
  '/biblioteca': '/biblioteca',
  '/biblioteca/sin-carpeta': '/biblioteca/sin-carpeta',
  '/biblioteca/carpeta/:folderId': '/biblioteca/carpeta/proximos',
  '/libro/:bookId': '/libro/OL81626W',
  '/descubrir': '/descubrir',
  '/buscar': '/buscar',
  '/mas': '/mas',
  '/amigos': '/amigos',
  '/amigos/:userId': '/amigos/camila',
  '/perfil': '/perfil',
}

const CATCH_ALL = '/*'

function routePatterns(routes: RouteObject[], parent = ''): string[] {
  return routes.flatMap((route) => {
    const pattern = route.path ? `${parent}/${route.path}` : parent
    if (route.children) return routePatterns(route.children, pattern)
    return [pattern || '/']
  })
}

// Only the structure is checked, so pages can title themselves with the book, folder or person.
function expectScreen(url: string) {
  const consoleError = vi.spyOn(console, 'error')
  renderApp(url)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  expect(screen.getAllByRole('navigation', { name: 'Principal' })).not.toHaveLength(0)
  expect(consoleError).not.toHaveBeenCalled()
}

describe('routes', () => {
  it('has a sample URL for every route', () => {
    const patterns = routePatterns(createRoutesFromElements(appRoutes))
    expect(patterns).toContain(CATCH_ALL)
    expect(patterns.filter((pattern) => pattern !== CATCH_ALL).sort()).toEqual(
      Object.keys(SCREENS).sort(),
    )
  })

  it.each(Object.values(SCREENS))('%s renders one page inside the shell', expectScreen)

  it('sends unknown URLs to Inicio', () => {
    renderApp('/ruta-inexistente')
    expect(currentLocation()).toBe('/')
  })
})
