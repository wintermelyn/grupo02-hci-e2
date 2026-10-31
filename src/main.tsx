import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes } from 'react-router'
import './index.css'
import './modelos/nuevo/nuevo.css'
import { appRoutes } from './routes'
import { BASENAME } from './modelos/modelo'
import { useStore } from './store'

// Outside React so StrictMode's double effects cannot schedule the timers twice.
useStore.getState().processPendingRequests()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={BASENAME}>
      <Routes>{appRoutes}</Routes>
    </BrowserRouter>
  </StrictMode>,
)
