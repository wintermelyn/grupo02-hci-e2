import { Navigate, Route } from 'react-router'
import { AppShell } from './components/AppShell'
import { BookPage } from './features/book/BookPage'
import { DiscoverPage } from './features/discover/DiscoverPage'
import { FriendsPage } from './features/friends/FriendsPage'
import { PersonPage } from './features/friends/PersonPage'
import { HomePage } from './features/home/HomePage'
import { FolderPage } from './features/library/FolderPage'
import { LibraryPage } from './features/library/LibraryPage'
import { UnfiledPage } from './features/library/UnfiledPage'
import { MorePage } from './features/more/MorePage'
import { ProfilePage } from './features/profile/ProfilePage'
import { SearchPage } from './features/search/SearchPage'

/** The route tree. main.tsx mounts it in a BrowserRouter and tests in a MemoryRouter. */
export const appRoutes = (
  <Route element={<AppShell />}>
    <Route index element={<HomePage />} />
    <Route path="biblioteca" element={<LibraryPage />} />
    <Route path="biblioteca/sin-carpeta" element={<UnfiledPage />} />
    <Route path="biblioteca/carpeta/:folderId" element={<FolderPage />} />
    <Route path="libro/:bookId" element={<BookPage />} />
    <Route path="descubrir" element={<DiscoverPage />} />
    <Route path="buscar" element={<SearchPage />} />
    <Route path="mas" element={<MorePage />} />
    <Route path="amigos" element={<FriendsPage />} />
    <Route path="amigos/:userId" element={<PersonPage />} />
    <Route path="perfil" element={<ProfilePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
)
