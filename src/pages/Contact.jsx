const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="24" height="24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

export default function Contact() {
  return (
    <>
      <section className="page-hero page-hero--contact">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Reach Out</p>
          <h1 className="page-hero__headline">Contact Us</h1>
        </div>
      </section>

      <section className="contact">
        <div className="contact__inner">
          <div className="contact__info">
            <p className="section-label">Find Us</p>
            <h2 className="section-heading">Get In Touch</h2>
            <p className="contact__detail">Jonesville, Virginia, United States</p>
            <a href="tel:2762991475" className="contact__phone">(276) 299-1475</a>
            <p className="contact__hours-title">Hours</p>
            <ul className="contact__hours-list">
              <li><span>Monday</span><span>9:00 am – 5:00 pm</span></li>
              <li><span>Tuesday</span><span>9:00 am – 5:00 pm</span></li>
              <li><span>Wednesday</span><span>9:00 am – 5:00 pm</span></li>
              <li><span>Thursday</span><span>9:00 am – 5:00 pm</span></li>
              <li><span>Friday</span><span>9:00 am – 5:00 pm</span></li>
              <li><span>Saturday</span><span>Closed</span></li>
              <li><span>Sunday</span><span>Closed</span></li>
            </ul>
          </div>
          <div className="contact__social">
            <p className="section-label">Send a Message</p>
            <h2 className="section-heading">We&rsquo;d Love to Hear From You</h2>
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
              <div className="contact-form__field">
                <label htmlFor="cf-name">Name</label>
                <input id="cf-name" type="text" name="name" autoComplete="name" required />
              </div>
              <div className="contact-form__field">
                <label htmlFor="cf-email">Email</label>
                <input id="cf-email" type="email" name="email" autoComplete="email" required />
              </div>
              <div className="contact-form__field">
                <label htmlFor="cf-message">Message</label>
                <textarea id="cf-message" name="message" rows="5" required />
              </div>
              <button type="submit" className="btn btn--primary">Send Message</button>
            </form>
            <div className="contact__social-links">
              <p className="section-label" style={{marginTop: '2.5rem'}}>Follow Along</p>
              <div className="social-links">
                <a href="https://www.facebook.com/loveleecounty" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon />
                </a>
                <a href="https://www.instagram.com/loveleeva/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href="https://www.linkedin.com/company/105233053/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
