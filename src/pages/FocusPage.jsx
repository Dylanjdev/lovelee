import { Link } from 'react-router-dom'
import { siteOrigin } from '../lib/seo.js'

function StructuredData({ data }) {
  const json = JSON.stringify(data).replaceAll('<', '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

export default function FocusPage({ page }) {
  const pageUrl = `${siteOrigin}/${page.slug}/`
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteOrigin}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.breadcrumb,
        item: pageUrl,
      },
    ],
  }
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <StructuredData data={breadcrumbData} />
      <StructuredData data={faqData} />

      <section className={`page-hero page-hero--focus page-hero--${page.slug}`}>
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">{page.eyebrow}</p>
          <h1 className="page-hero__headline">{page.headline}</h1>
          <p className="page-hero__lede">{page.lede}</p>
        </div>
      </section>

      <section className="focus-overview">
        <div className="focus-page__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.breadcrumb}</span>
          </nav>

          <div className="focus-overview__grid">
            <div className="focus-overview__copy">
              <p className="section-label">{page.introLabel}</p>
              <h2 className="section-heading">{page.introHeading}</h2>
              {page.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <aside className="focus-overview__aside" aria-labelledby={`${page.slug}-at-a-glance`}>
              <p className="section-label">At a Glance</p>
              <h2 id={`${page.slug}-at-a-glance`}>{page.asideHeading}</h2>
              <ul>
                {page.asideItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="focus-paths">
        <div className="focus-page__inner">
          <div className="focus-paths__intro">
            <p className="section-label">{page.pathsLabel}</p>
            <h2 className="section-heading">{page.pathsHeading}</h2>
            <p className="section-copy">{page.pathsCopy}</p>
          </div>
          <div className="focus-paths__grid">
            {page.paths.map((path, index) => (
              <article className="focus-card" key={path.title}>
                <span className="focus-card__number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                {path.link ? <Link to={path.link}>{path.cta} <span aria-hidden="true">→</span></Link> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="focus-feature">
        <div className="focus-page__inner focus-feature__inner">
          <div>
            <p className="section-label">{page.featureLabel}</p>
            <h2>{page.featureHeading}</h2>
          </div>
          <div className="focus-feature__copy">
            {page.featureCopy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="focus-feature__links">
              {page.featureLinks.map((link) => (
                <Link to={link.to} key={link.to}>{link.label} <span aria-hidden="true">→</span></Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="focus-faq">
        <div className="focus-page__inner focus-faq__inner">
          <div>
            <p className="section-label">Helpful Context</p>
            <h2 className="section-heading">Questions people ask.</h2>
          </div>
          <div className="focus-faq__list">
            {page.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="focus-cta">
        <div className="focus-page__inner focus-cta__inner">
          <div>
            <p className="section-label">{page.ctaLabel}</p>
            <h2>{page.ctaHeading}</h2>
            <p>{page.ctaCopy}</p>
          </div>
          <div className="focus-cta__actions">
            {page.ctaLinks.map((link, index) => (
              <Link
                className={index === 0 ? 'btn btn--primary' : 'btn btn--ghost'}
                to={link.to}
                key={link.to}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
