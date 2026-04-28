import { Link } from 'react-router-dom'

export default function About() {
  return (
    <>
      <section className="page-hero page-hero--about">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Who We Are</p>
          <h1 className="page-hero__headline">About Us</h1>
        </div>
      </section>

      <section className="about">
        <div className="about__inner">
          <div className="about__text">
            <p className="section-label">Our Story</p>
            <h2 className="section-heading">
              Rooted in Tradition,<br />Made by Hand
            </h2>
            <p className="about__body">
              Every board we make starts as a raw slab of hardwood and ends as a
              piece you&rsquo;ll pass down. We&rsquo;re based in Jonesville, Virginia &mdash;
              deep in the hills where good wood and honest work still mean something.
            </p>
            <p className="about__body about__body--spaced">
              Whether it&rsquo;s a cutting board for your kitchen or a custom rolling
              tray for your setup, we put the same care into every piece. No shortcuts,
              no cheap materials &mdash; just solid hardwood and time.
            </p>
          </div>
          <div className="about__visual" aria-hidden="true">
            <div className="about__wood-block">
              <div className="about__wood-text">
                <span className="about__wood-brand">LoveLeeVa</span>
                <span className="about__wood-est">Est. &nbsp; Virginia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="values__inner">
          <p className="section-label">What Drives Us</p>
          <h2 className="section-heading">Our Values</h2>
          <div className="values__grid">
            <div className="value-card">
              <h3 className="value-card__title">Quality Materials</h3>
              <p className="value-card__body">We source only the finest hardwoods — walnut, maple, cherry — selected for grain, strength, and beauty.</p>
            </div>
            <div className="value-card">
              <h3 className="value-card__title">Handcrafted Every Time</h3>
              <p className="value-card__body">No mass production. Every piece is hand-shaped, sanded, and finished in our Jonesville shop.</p>
            </div>
            <div className="value-card">
              <h3 className="value-card__title">Community First</h3>
              <p className="value-card__body">We&rsquo;re proud to be a Virginia small business. When you buy from us, you&rsquo;re supporting our family and community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta__inner">
          <h2 className="section-heading">Ready to find your piece?</h2>
          <div className="about-cta__btns">
            <Link to="/shop" className="btn btn--primary">Browse the Shop</Link>
            <Link to="/customized" className="btn btn--ghost">Request Custom Order</Link>
          </div>
        </div>
      </section>
    </>
  )
}
