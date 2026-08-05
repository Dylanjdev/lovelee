import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { getSeoForPath } from './lib/seo.js'

// Restore SPA routes redirected through GitHub Pages 404.html.
const { search, pathname, hash } = window.location
let wasSpaRedirect = false

if (search.startsWith('?/')) {
  wasSpaRedirect = true
  const route = search
    .slice(1)
    .split('&')
    .map((part) => part.replace(/~and~/g, '&'))
    .join('?')

  window.history.replaceState(null, '', `${pathname.slice(0, -1)}${route}${hash}`)
}

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

const currentPage = getSeoForPath(window.location.pathname)
const shouldHydrate = root.hasChildNodes() && !wasSpaRedirect && currentPage.hydrate !== false

if (shouldHydrate) {
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
