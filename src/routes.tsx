import { Navigate, Route } from 'react-router'
import { AppShell } from './components/AppShell'
import { BookPage } from './features/book/BookPage'
import { DiscoverPage } from './modelos/DiscoverPage'
import { FriendsPage } from './features/friends/FriendsPage'
import { PersonPage } from './features/friends/PersonPage'
import { HomePage } from './modelos/HomePage'
import { FolderPage } from './features/library/FolderPage'
import { LibraryPage } from './modelos/LibraryPage'
import { MorePage } from './features/more/MorePage'
import { ProfilePage } from './modelos/ProfilePage'
import { SearchPage } from './modelos/SearchPage'
import { ES_NUEVO, MODELO } from './modelos/modelo'
import { Actividad } from './modelos/nuevo/Actividad'
import { Buscar } from './modelos/nuevo/Buscar'
import { DiscoverD } from './modelos/nuevo/DiscoverD'
import { DiscoverE } from './modelos/nuevo/DiscoverE'
import { DiscoverF } from './modelos/nuevo/DiscoverF'
import { DiscoverG } from './modelos/nuevo/DiscoverG'
import { Inicio } from './modelos/nuevo/Inicio'
import { Shell } from './modelos/nuevo/Shell'

const Marco = ES_NUEVO ? Shell : AppShell
const Portada = ES_NUEVO ? Inicio : HomePage
const Busqueda = ES_NUEVO ? Buscar : SearchPage
const Descubrir =
  MODELO === 'd'
    ? DiscoverD
    : MODELO === 'e'
      ? DiscoverE
      : MODELO === 'f'
        ? DiscoverF
        : MODELO === 'g'
          ? DiscoverG
          : DiscoverPage

/** The route tree. main.tsx mounts it in a BrowserRouter and tests in a MemoryRouter. */
export const appRoutes = (
  <Route element={<Marco />}>
    <Route index element={<Portada />} />
    <Route path="biblioteca" element={<LibraryPage />} />
    <Route path="biblioteca/carpeta/:folderId" element={<FolderPage />} />
    <Route path="libro/:bookId" element={<BookPage />} />
    <Route path="descubrir" element={<Descubrir />} />
    <Route path="buscar" element={<Busqueda />} />
    <Route path="actividad" element={<Actividad />} />
    <Route path="mas" element={<MorePage />} />
    <Route path="amigos" element={<FriendsPage />} />
    <Route path="amigos/:userId" element={<PersonPage />} />
    <Route path="perfil" element={<ProfilePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
)
