import { Link } from 'react-router-dom'
import logoImg from '../assets/OurLoveLeeLogoGray.png'

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="18" height="18">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <img src={logoImg} alt="LoveLeeVa" className="footer__logo" />
          <p className="footer__tagline">Handcrafted in Jonesville, Virginia</p>
          <div className="social-links">
            <a href="https://www.facebook.com/loveleecounty" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://www.instagram.com/loveleeva/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://www.linkedin.com/company/105233053/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
        </div>
        <nav className="footer__nav" aria-label="Footer navigation">
          <p className="footer__nav-heading">Pages</p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/customized">Customized</Link></li>
          </ul>
        </nav>
        <div className="footer__contact">
          <p className="footer__nav-heading">Contact</p>
          <p>Jonesville, Virginia</p>
          <a href="tel:2762991475">(276) 299-1475</a>
          <p className="footer__hours">Mon – Fri &nbsp; 9am – 5pm</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copy">&copy; 2026 LoveLeeVa &mdash; All Rights Reserved</p>
        <div className="footer__links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
        </div>
      </div>
    </footer>
  )
}
