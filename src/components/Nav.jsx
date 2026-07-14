import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import logoImg from '../assets/OurLoveLeeLogoGray.webp'

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="22" height="22">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
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
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const menuButtonRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    const handlePointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isCartModalOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const cartButton = cartButtonRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsCartModalOpen(false)
      if (event.key === 'Tab') {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
      cartButton?.focus()
    }
  }, [isCartModalOpen])

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
            <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>About Us</NavLink></li>
            <li><NavLink to="/shop" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Shop</NavLink></li>
            <li><NavLink to="/directory" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Directory</NavLink></li>
            <li><NavLink to="/contact" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Contact Us</NavLink></li>
            <li><NavLink to="/customized" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav__link nav__link--active' : 'nav__link'}>Customized</NavLink></li>
          </ul>
          <button
            ref={cartButtonRef}
            type="button"
            className="nav__cart"
            aria-label="Open shopping cart status"
            aria-haspopup="dialog"
            aria-expanded={isCartModalOpen}
            aria-controls="cart-status-dialog"
            onClick={() => {
              setIsMenuOpen(false)
              setIsCartModalOpen(true)
            }}
          >
            <CartIcon />
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

      {isCartModalOpen ? (
        <div
          id="cart-status-dialog"
          className="cart-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-modal-title"
          aria-describedby="cart-modal-message"
          onClick={() => setIsCartModalOpen(false)}
        >
          <div className="cart-modal__content" onClick={(event) => event.stopPropagation()}>
            <button
              ref={closeButtonRef}
              type="button"
              className="cart-modal__close"
              aria-label="Close cart status"
              onClick={() => setIsCartModalOpen(false)}
            >
              ×
            </button>
            <p className="cart-modal__label">Under Construction</p>
            <span className="cart-modal__sparkle" aria-hidden="true">✦</span>
            <h2 id="cart-modal-title">Our Unicorns Are Working Their Magic</h2>
            <p id="cart-modal-message">
              Unicorns are working their magic to get the online shop and cart
              functional as quickly as possible.
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
