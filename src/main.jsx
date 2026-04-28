import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Restore SPA routes redirected through GitHub Pages 404.html.
const { search, pathname, hash } = window.location
if (search.startsWith('?/')) {
  const route = search
    .slice(1)
    .split('&')
    .map((part) => part.replace(/~and~/g, '&'))
    .join('?')

  window.history.replaceState(null, '', `${pathname.slice(0, -1)}${route}${hash}`)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
