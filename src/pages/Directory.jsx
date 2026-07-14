const StorefrontIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 27v27h44V27" />
    <path d="M7 27 13 10h38l6 17" />
    <path d="M7 27c0 5 8 7 12 1 3 6 11 6 14 0 3 6 11 6 14 0 4 6 10 4 10-1" />
    <path d="M25 54V39h14v15" />
  </svg>
)

const steps = [
  {
    number: '01',
    title: 'Watch for the form',
    description: 'Smith Digitals LLC will share the official business submission form on Facebook.',
  },
  {
    number: '02',
    title: 'Tell us about your business',
    description: 'Share your contact details, location, website link, and a clear description of the services you provide.',
  },
  {
    number: '03',
    title: 'Get added to the directory',
    description: 'Approved submissions will become directory listings with a backlink to your business website or online page.',
  },
]

export default function Directory() {
  return (
    <>
      <section className="page-hero page-hero--directory">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Shop Local. Grow Local.</p>
          <h1 className="page-hero__headline">Lee County Business Directory</h1>
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
              We are building a free, community-focused directory to make Lee County
              businesses easier for neighbors and visitors to discover and support.
              Each listing will feature a description of the business&rsquo;s services and
              a backlink to its website or preferred online page.
            </p>
          </div>

          <div className="directory-empty" aria-labelledby="directory-status-title">
            <div className="directory-empty__icon"><StorefrontIcon /></div>
            <p className="directory-empty__count">0 businesses listed</p>
            <h2 id="directory-status-title">Our directory is just getting started.</h2>
            <p>
              There are no business listings yet. We will be collecting submissions
              soon and adding local businesses as they come in.
            </p>
          </div>
        </div>
      </section>

      <section className="directory-submit">
        <div className="directory-submit__inner">
          <div className="directory-submit__heading">
            <p className="section-label">Own a Local Business?</p>
            <h2 className="section-heading">Help us grow the directory.</h2>
            <p className="section-copy">
              We want to include businesses of every size from across Lee County.
              Smith Digitals LLC will share the submission form on Facebook. Here is
              how the first round of listings will work.
            </p>
          </div>
          <ol className="directory-steps">
            {steps.map((step) => (
              <li className="directory-step" key={step.number}>
                <span className="directory-step__number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
