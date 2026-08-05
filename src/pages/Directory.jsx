import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  attachBusinessLogo,
  getApprovedBusinesses,
  getBusinessLogoUrl,
  isBusinessDirectoryConfigured,
  submitBusinessListing,
  uploadBusinessLogo,
} from '../lib/businessDirectory.js'

const StorefrontIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 27v27h44V27" />
    <path d="M7 27 13 10h38l6 17" />
    <path d="M7 27c0 5 8 7 12 1 3 6 11 6 14 0 3 6 11 6 14 0 4 6 10 4 10-1" />
    <path d="M25 54V39h14v15" />
  </svg>
)

const categories = [
  { value: 'all', label: 'All' },
  { value: 'restaurants', label: 'Restaurants' },
  { value: 'shops', label: 'Shops' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'lodging', label: 'Lodging' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Other' },
]

const categoryLabels = Object.fromEntries(
  categories.map(({ value, label }) => [value, label]),
)

const allowedLogoTypes = ['image/jpeg', 'image/png', 'image/webp']

function BusinessCard({ business }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const logoUrl = getBusinessLogoUrl(business.logo_path)
  const phoneHref = business.phone?.replace(/(?!^\+)[^\d]/g, '')

  return (
    <article className="directory-card">
      <div className="directory-card__logo">
        {logoUrl && !logoFailed ? (
          <img
            src={logoUrl}
            alt={`${business.name} logo`}
            loading="lazy"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{business.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="directory-card__body">
        <p className="directory-card__category">
          {categoryLabels[business.category] ?? 'Other'}
        </p>
        <h3>{business.name}</h3>
        {business.description && <p className="directory-card__description">{business.description}</p>}
        <address className="directory-card__contact">
          <span>{business.address}</span>
          {business.phone && <a href={`tel:${phoneHref}`}>{business.phone}</a>}
          {business.business_email && <a href={`mailto:${business.business_email}`}>{business.business_email}</a>}
        </address>
        {business.website_url && (
          <a
            className="directory-card__website"
            href={business.website_url}
            target="_blank"
            rel="noreferrer"
          >
            Visit website <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  )
}

export default function Directory() {
  const [businesses, setBusinesses] = useState([])
  const [loadStatus, setLoadStatus] = useState('loading')
  const [loadError, setLoadError] = useState('')
  const [requestId, setRequestId] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadBusinesses() {
      if (!isBusinessDirectoryConfigured) {
        setLoadStatus('error')
        setLoadError('The directory connection has not been configured.')
        return
      }

      setLoadStatus('loading')
      setLoadError('')

      try {
        const listings = await getApprovedBusinesses({ signal: controller.signal })
        setBusinesses(listings)
        setLoadStatus('success')
      } catch (error) {
        if (error.name === 'AbortError') return
        setLoadStatus('error')
        setLoadError('We could not load the directory right now. Please try again.')
      }
    }

    loadBusinesses()
    return () => controller.abort()
  }, [requestId])

  const filteredBusinesses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return businesses.filter((business) => {
      const matchesCategory = category === 'all' || business.category === category
      const searchableText = [
        business.name,
        business.description,
        business.address,
        categoryLabels[business.category],
      ].filter(Boolean).join(' ').toLowerCase()

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [businesses, category, query])

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const logo = formData.get('logo')

    if (logo?.size && !allowedLogoTypes.includes(logo.type)) {
      setSubmitStatus('error')
      setSubmitMessage('Choose a JPG, PNG, or WebP logo.')
      return
    }

    if (logo?.size > 2 * 1024 * 1024) {
      setSubmitStatus('error')
      setSubmitMessage('The logo must be 2 MB or smaller.')
      return
    }

    setSubmitStatus('submitting')
    setSubmitMessage('')

    try {
      const businessId = await submitBusinessListing({
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        businessEmail: formData.get('businessEmail'),
        websiteUrl: formData.get('websiteUrl'),
        submitterName: formData.get('submitterName'),
        submitterEmail: formData.get('submitterEmail'),
      })

      let logoUploaded = true
      if (logo?.size) {
        try {
          const logoPath = await uploadBusinessLogo(businessId, logo)
          await attachBusinessLogo(businessId, logoPath)
        } catch {
          logoUploaded = false
        }
      }

      form.reset()
      setSubmitStatus('success')
      setSubmitMessage(
        logoUploaded
          ? 'Thank you! Your listing was submitted and will appear after it is reviewed and approved.'
          : 'Your listing was submitted for review, but the logo did not upload. Please contact us if you would like it added.',
      )
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(error.message || 'Your listing could not be submitted. Please try again.')
    }
  }

  return (
    <>
      <section className="page-hero page-hero--directory">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Shop Local. Grow Local.</p>
          <h1 className="page-hero__headline">Lee County Business Directory</h1>
          <p className="page-hero__lede">
            Find local products, places to eat, lodging, shops, and services across
            Lee County, Virginia.
          </p>
        </div>
      </section>

      <section className="directory">
        <div className="directory__inner">
          <div className="directory__intro">
            <div>
              <p className="section-label">The Directory</p>
              <h2 className="section-heading">Local discovery starts here.</h2>
            </div>
            <p className="section-copy">
              Find Lee County restaurants, shops, lodging, services, and more. Better
              local discovery gives small businesses more visibility and helps keep
              more spending in the local economy. Every listing is reviewed before it
              is added to this community directory.
            </p>
          </div>

          {loadStatus === 'success' && businesses.length > 0 && (
            <div className="directory-toolbar" role="search">
              <div className="directory-search">
                <label htmlFor="directory-search">Search businesses</label>
                <input
                  id="directory-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Name, category, or location…"
                />
              </div>
              <div className="directory-filters" aria-label="Filter by category">
                {categories.map(({ value, label }) => (
                  <button
                    className={category === value ? 'directory-filter directory-filter--active' : 'directory-filter'}
                    type="button"
                    key={value}
                    aria-pressed={category === value}
                    onClick={() => setCategory(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="directory-results" aria-live="polite">
            {loadStatus === 'loading' && (
              <div className="directory-status" role="status">
                <span className="directory-status__spinner" aria-hidden="true" />
                <p>Loading local businesses…</p>
              </div>
            )}

            {loadStatus === 'error' && (
              <div className="directory-status directory-status--error" role="alert">
                <h2>Listings are temporarily unavailable.</h2>
                <p>{loadError}</p>
                {isBusinessDirectoryConfigured && (
                  <button className="btn btn--ghost" type="button" onClick={() => setRequestId((id) => id + 1)}>
                    Try again
                  </button>
                )}
              </div>
            )}

            {loadStatus === 'success' && businesses.length === 0 && (
              <div className="directory-empty" aria-labelledby="directory-status-title">
                <div className="directory-empty__icon"><StorefrontIcon /></div>
                <p className="directory-empty__count">0 businesses listed</p>
                <h2 id="directory-status-title">Our directory is just getting started.</h2>
                <p>
                  There are no approved listings yet. Submit a local business below
                  and help us build the directory.
                </p>
              </div>
            )}

            {loadStatus === 'success' && businesses.length > 0 && (
              <>
                <p className="directory-results__count">
                  {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
                </p>
                {filteredBusinesses.length > 0 ? (
                  <div className="directory-grid">
                    {filteredBusinesses.map((business) => (
                      <BusinessCard business={business} key={business.id} />
                    ))}
                  </div>
                ) : (
                  <div className="directory-status">
                    <h2>No businesses match those filters.</h2>
                    <p>Try a different search or category.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="directory-submit" id="submit-a-business">
        <div className="directory-submit__inner">
          <div className="directory-submit__heading">
            <p className="section-label">Own a Local Business?</p>
            <h2 className="section-heading">Join the directory.</h2>
            <p className="section-copy">
              Submit a free listing for a Lee County business. We review each request
              before publishing it, and your private contact details are used only to
              follow up about the submission.
            </p>
          </div>

          <form className="directory-form" onSubmit={handleSubmit}>
            <div className="directory-form__row">
              <div className="contact-form__field">
                <label htmlFor="business-name">Business name</label>
                <input id="business-name" name="name" type="text" maxLength="140" required />
              </div>
              <div className="contact-form__field">
                <label htmlFor="business-category">Category</label>
                <select id="business-category" name="category" defaultValue="" required>
                  <option value="" disabled>Choose a category…</option>
                  {categories.slice(1).map(({ value, label }) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-form__field">
              <label htmlFor="business-description">Business description</label>
              <textarea id="business-description" name="description" rows="4" maxLength="2000" placeholder="What does your business offer?" />
            </div>

            <div className="contact-form__field">
              <label htmlFor="business-address">Business address</label>
              <input id="business-address" name="address" type="text" maxLength="300" autoComplete="street-address" required />
            </div>

            <div className="directory-form__row">
              <div className="contact-form__field">
                <label htmlFor="business-phone">Business phone <span>(optional)</span></label>
                <input id="business-phone" name="phone" type="tel" maxLength="50" autoComplete="tel" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="business-email">Business email <span>(optional)</span></label>
                <input id="business-email" name="businessEmail" type="email" maxLength="254" autoComplete="email" />
              </div>
            </div>

            <div className="directory-form__row">
              <div className="contact-form__field">
                <label htmlFor="business-website">Website <span>(optional)</span></label>
                <input id="business-website" name="websiteUrl" type="url" maxLength="500" inputMode="url" placeholder="https://example.com" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="business-logo">Logo <span>(optional)</span></label>
                <input id="business-logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp" />
                <small>JPG, PNG, or WebP. Maximum 2 MB.</small>
              </div>
            </div>

            <fieldset className="directory-form__contact">
              <legend>Your private contact details</legend>
              <div className="directory-form__row">
                <div className="contact-form__field">
                  <label htmlFor="submitter-name">Your name</label>
                  <input id="submitter-name" name="submitterName" type="text" maxLength="140" autoComplete="name" required />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="submitter-email">Your email</label>
                  <input id="submitter-email" name="submitterEmail" type="email" maxLength="254" autoComplete="email" required />
                </div>
              </div>
            </fieldset>

            <button className="btn btn--primary" type="submit" disabled={submitStatus === 'submitting' || !isBusinessDirectoryConfigured}>
              {submitStatus === 'submitting' ? 'Submitting…' : 'Submit Business'}
            </button>
            {submitMessage && (
              <p
                className={`directory-form__message directory-form__message--${submitStatus}`}
                role={submitStatus === 'error' ? 'alert' : 'status'}
              >
                {submitMessage}
              </p>
            )}
            <p className="form-privacy-note">
              By submitting, you confirm that you are authorized to request this listing.
              See our <Link to="/privacy-policy/">Privacy Policy</Link> and{' '}
              <Link to="/terms/">Terms of Service</Link>.
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
