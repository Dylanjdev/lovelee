import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Shop from './pages/Shop.jsx'
import Contact from './pages/Contact.jsx'
import Customized from './pages/Customized.jsx'
import './App.css'

export default function App() {
  return (
    <div className="site-wrapper">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/customized" element={<Customized />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
