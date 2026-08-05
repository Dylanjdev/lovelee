import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">404 Error</p>
          <h1 className="page-hero__headline">Page Not Found</h1>
          <p className="page-hero__lede">
            The page you requested may have moved or no longer exists.
          </p>
        </div>
      </section>
      <section className="about-cta">
        <div className="about-cta__inner">
          <h2 className="section-heading">Let&rsquo;s get you back on the trail.</h2>
          <div className="about-cta__btns">
            <Link to="/" className="btn btn--primary">Return Home</Link>
            <Link to="/contact/" className="btn btn--ghost">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
