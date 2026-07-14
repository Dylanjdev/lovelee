import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import './App.css'

const About = lazy(() => import('./pages/About.jsx'))
const Shop = lazy(() => import('./pages/Shop.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Customized = lazy(() => import('./pages/Customized.jsx'))
const Directory = lazy(() => import('./pages/Directory.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <ScrollToTop />
      <Nav />
      <main id="main-content" tabIndex="-1">
        <Suspense fallback={<div className="page-loader" role="status">Loading page…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/customized" element={<Customized />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
