import { Link } from 'react-router-dom'
import logoImg from '../assets/OurLoveLeeLogoGray.png'
import rollingTrayHomepage from '../assets/RollingTrayHomepage.png'

const MARQUEE_TEXT = 'Handcrafted \u00a0\u2022\u00a0 Heirloom Quality \u00a0\u2022\u00a0 Made in Virginia \u00a0\u2022\u00a0 Built to Last \u00a0\u2022\u00a0 '

export default function Home() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────── */}
      <section className="hero" aria-label="Hero">
        <div className="hero__noise" aria-hidden="true" />
        <div className="hero__content">
          <div className="hero__logo-wrap">
            <img src={logoImg} alt="LoveLeeVa" className="hero__logo" />
          </div>
          <p className="hero__eyebrow">Handcrafted in Virginia</p>
          <h1 className="hero__headline">
            Boards for<br />Every Occasion
          </h1>
          <p className="hero__sub">
            Premium hardwood cutting boards and custom rolling trays —
            built to last, crafted with love.
          </p>
          <div className="hero__ctas">
            <Link to="/shop" className="btn btn--primary">Shop Now</Link>
            <Link to="/about" className="btn btn--ghost">Our Story</Link>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">↓</div>
      </section>

      {/* ── MARQUEE BANNER ────────────────────────── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="marquee__text">{MARQUEE_TEXT}</span>
          ))}
        </div>
      </div>

      {/* ── HOME PREVIEW CARDS ────────────────────── */}
      <section className="home-preview">
        <div className="home-preview__inner">
          <p className="section-label">What We Make</p>
          <h2 className="section-heading">Crafted for Real Life</h2>
          <p className="home-preview__sub">
            These are featured favorites. We carry more than just these categories,
            including Loofas, Soft Items, Wall Art, and custom work.
          </p>
          <div className="home-preview__cta-wrap">
            <Link to="/shop" className="btn btn--ghost">See Full Shop</Link>
          </div>
          <div className="home-preview__grid">
            <Link to="/shop" className="preview-card preview-card--1">
              <div className="preview-card__overlay">
                <h3>Cutting Boards</h3>
                <span className="preview-card__cta">Shop Now →</span>
              </div>
            </Link>
            <Link
              to="/shop"
              className="preview-card preview-card--2"
              style={{
                backgroundImage: `url(${rollingTrayHomepage})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              <div className="preview-card__overlay">
                <h3>Rolling Trays</h3>
                <span className="preview-card__cta">Shop Now →</span>
              </div>
            </Link>
            <Link to="/customized" className="preview-card preview-card--3">
              <div className="preview-card__overlay">
                <h3>Custom Orders</h3>
                <span className="preview-card__cta">Start Here →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TAGLINE STRIP ─────────────────────────── */}
      <section className="tagline-strip">
        <div className="tagline-strip__inner">
          <p className="tagline-strip__text">
            &ldquo;Every piece tells a story. Make yours worth telling.&rdquo;
          </p>
          <Link to="/customized" className="btn btn--primary">Get a Custom Piece</Link>
        </div>
      </section>
    </>
  )
}
