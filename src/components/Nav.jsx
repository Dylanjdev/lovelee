import { NavLink } from 'react-router-dom'
import logoImg from '../assets/OurLoveLeeLogoGray.png'

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="22" height="22">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

export default function Nav() {
  return (
    <header className="nav">
      <nav className="nav__inner">
        <NavLink to="/" className="nav__logo-link" aria-label="LoveLeeVa home">
          <img src={logoImg} alt="LoveLeeVa" className="nav__logo" />
        </NavLink>
        <ul className="nav__links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>About Us</NavLink></li>
          <li><NavLink to="/shop" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Shop</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Contact Us</NavLink></li>
          <li><NavLink to="/customized" className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Customized</NavLink></li>
        </ul>
        <NavLink to="/shop" className="nav__cart" aria-label="Shopping cart">
          <CartIcon />
        </NavLink>
      </nav>
    </header>
  )
}
