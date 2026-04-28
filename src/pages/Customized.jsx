import { Link } from 'react-router-dom'

export default function Customized() {
  return (
    <>
      <section className="page-hero page-hero--custom">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Made Just for You</p>
          <h1 className="page-hero__headline">Customized</h1>
        </div>
      </section>

      <section className="custom-intro">
        <div className="custom-intro__inner">
          <div className="custom-intro__text">
            <p className="section-label">Custom Work</p>
            <h2 className="section-heading">Tell Us What You&rsquo;re After</h2>
            <p className="about__body">
              Got something specific in mind? We do custom engravings, sizing, wood species,
              and design work. Whether it&rsquo;s a wedding gift, a business logo on a board,
              or a one-of-a-kind piece for your home — we can make it.
            </p>
            <p className="about__body about__body--spaced">
              Fill out the form and we&rsquo;ll get back to you with a quote within 1&ndash;2 business days.
            </p>
          </div>
          <div className="custom-intro__options">
            <div className="custom-option">
              <h3>Custom Engraving</h3>
              <p>Names, logos, quotes, maps — burned right into the wood.</p>
            </div>
            <div className="custom-option">
              <h3>Custom Sizing</h3>
              <p>Need a specific dimension? We&rsquo;ll cut it to fit your space or purpose.</p>
            </div>
            <div className="custom-option">
              <h3>Gift Sets</h3>
              <p>We&rsquo;ll put together a curated set with custom packaging for any occasion.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="custom-form-section">
        <div className="custom-form-section__inner">
          <p className="section-label">Start Your Order</p>
          <h2 className="section-heading">Custom Order Request</h2>
          <form className="custom-form" onSubmit={e => e.preventDefault()}>
            <div className="custom-form__row">
              <div className="contact-form__field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" type="text" name="name" autoComplete="name" required />
              </div>
              <div className="contact-form__field">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" name="email" autoComplete="email" required />
              </div>
            </div>
            <div className="custom-form__row">
              <div className="contact-form__field">
                <label htmlFor="c-phone">Phone (optional)</label>
                <input id="c-phone" type="tel" name="phone" autoComplete="tel" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="c-type">Product Type</label>
                <select id="c-type" name="productType" required>
                  <option value="">Select a type…</option>
                  <option>Cutting Board</option>
                  <option>Rolling Tray</option>
                  <option>Charcuterie Board</option>
                  <option>Serving Board</option>
                  <option>Wall Art</option>
                  <option>Gift Set</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="contact-form__field">
              <label htmlFor="c-engraving">Engraving / Design Details</label>
              <input id="c-engraving" type="text" name="engraving" placeholder="e.g. 'Smith Family Est. 2018', a logo, a quote…" />
            </div>
            <div className="contact-form__field">
              <label htmlFor="c-details">Additional Details</label>
              <textarea id="c-details" name="details" rows="5" placeholder="Size, quantity, deadline, occasion, anything else we should know…" required />
            </div>
            <button type="submit" className="btn btn--primary">Submit Request</button>
          </form>
        </div>
      </section>

      <section className="tagline-strip">
        <div className="tagline-strip__inner">
          <p className="tagline-strip__text">
            &ldquo;Not sure where to start? Just reach out and we&rsquo;ll figure it out together.&rdquo;
          </p>
          <Link to="/contact" className="btn btn--ghost">Contact Us Directly</Link>
        </div>
      </section>
    </>
  )
}
