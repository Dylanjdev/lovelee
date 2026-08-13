import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import CartDrawer from './CartDrawer.jsx'
import logoImg from '../assets/OurLoveLeeLogoGray.webp'
import { useCart } from '../lib/cartContext.js'

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="22" height="22">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

const AccountIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="21" height="21">
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
  </svg>
)

const MenuIcon = () => (
  <span className="nav__menu-icon" aria-hidden="true">
    <span />
    <span />
    <span />
  </span>
)

export default function Nav() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const cartButtonRef = useRef(null)
  const menuButtonRef = useRef(null)
  const navRef = useRef(null)
  const location = useLocation()
  const { itemCount } = useCart()
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  useEffect(() => {
    if (!isMenuOpen && !isGuideOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setIsGuideOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    const handlePointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
        setIsGuideOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen, isGuideOpen])

  return (
    <>
      <header className="nav">
        <nav ref={navRef} className="nav__inner" aria-label="Primary navigation">
          <NavLink
            to="/"
            className="nav__logo-link"
            aria-label="LoveLeeVa home"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src={logoImg}
              alt="LoveLeeVa"
              className="nav__logo"
              width="586"
              height="426"
              decoding="async"
            />
          </NavLink>
          <ul
            id="primary-navigation-links"
            className={`nav__links${isMenuOpen ? ' nav__links--open' : ''}`}
          >
            <li><NavLink to="/" end onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Home</NavLink></li>
            <li><NavLink to="/about/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>About Us</NavLink></li>
            <li><NavLink to="/shop/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Shop</NavLink></li>
            <li><NavLink to="/directory/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Directory</NavLink></li>
            <li className={`nav__dropdown${isGuideOpen ? ' nav__dropdown--open' : ''}`}>
              <button
                type="button"
                className={`nav__link nav__dropdown-toggle${location.pathname.startsWith('/lee-county-virginia-guide') || location.pathname.startsWith('/explore-lee-county') ? ' nav__link--active' : ''}`}
                aria-expanded={isGuideOpen}
                aria-controls="local-guide-menu"
                onClick={() => setIsGuideOpen((isOpen) => !isOpen)}
              >
                Local Guide <span className="nav__dropdown-arrow" aria-hidden="true">▾</span>
              </button>
              <ul id="local-guide-menu" className="nav__dropdown-menu">
                <li><NavLink to="/lee-county-virginia-guide/" onClick={() => { setIsMenuOpen(false); setIsGuideOpen(false) }} className={({ isActive }) => isActive ? 'nav__dropdown-link nav__dropdown-link--active' : 'nav__dropdown-link'}>Lee County Guide</NavLink></li>
                <li><NavLink to="/explore-lee-county/" onClick={() => { setIsMenuOpen(false); setIsGuideOpen(false) }} className={({ isActive }) => isActive ? 'nav__dropdown-link nav__dropdown-link--active' : 'nav__dropdown-link'}>Tourism in Lee County</NavLink></li>
              </ul>
            </li>
            <li><NavLink to="/calendar/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Calendar</NavLink></li>
            <li><NavLink to="/contact/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Contact Us</NavLink></li>
            <li><NavLink to="/customized/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Customized</NavLink></li>
          </ul>
          <a
            className="nav__account"
            href="https://lovelee.odoo.com/my/orders"
            aria-label="View your LoveLeeVA orders"
          >
            <AccountIcon />
          </a>
          <button
            ref={cartButtonRef}
            type="button"
            className="nav__cart"
            aria-label={`Open shopping cart${itemCount ? `, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : ''}`}
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
            aria-controls="shopping-cart-drawer"
            onClick={() => {
              setIsMenuOpen(false)
              setIsCartOpen(true)
            }}
          >
            <CartIcon />
            {itemCount ? (
              <span className="nav__cart-count" aria-hidden="true">{itemCount > 99 ? '99+' : itemCount}</span>
            ) : null}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className={`nav__toggle${isMenuOpen ? ' nav__toggle--open' : ''}`}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation-links"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <MenuIcon />
          </button>
        </nav>
      </header>

      <div id="shopping-cart-drawer">
        <CartDrawer
          isOpen={isCartOpen}
          onClose={closeCart}
          triggerRef={cartButtonRef}
        />
      </div>
    </>
  )
}
