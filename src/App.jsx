import { Route, Routes } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import CatalogProvider from './components/CatalogProvider.jsx'
import CartProvider from './components/CartProvider.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Shop from './pages/Shop.jsx'
import Contact from './pages/Contact.jsx'
import Customized from './pages/Customized.jsx'
import Directory from './pages/Directory.jsx'
import Calendar from './pages/Calendar.jsx'
import RuralDevelopment from './pages/RuralDevelopment.jsx'
import WorkforceDevelopment from './pages/WorkforceDevelopment.jsx'
import ExploreLeeCounty from './pages/ExploreLeeCounty.jsx'
import LeeCountyGuide from './pages/LeeCountyGuide.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'
import './storefront.css'

export default function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <div className="site-shell">
          <a className="skip-link" href="#main-content">Skip to main content</a>
          <ScrollToTop />
          <Nav />
          <main id="main-content" tabIndex="-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/customized" element={<Customized />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/rural-development" element={<RuralDevelopment />} />
              <Route path="/workforce-development" element={<WorkforceDevelopment />} />
              <Route path="/explore-lee-county" element={<ExploreLeeCounty />} />
              <Route path="/lee-county-virginia-guide" element={<LeeCountyGuide />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </CatalogProvider>
  )
}
