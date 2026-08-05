import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../assets/OurLoveLeeLogoGray.webp'
import rollingTrayHomepage from '../assets/RollingTrayHomepage.webp'
import wallArtHomepage from '../assets/wallArtHomepage.webp'

const pillars = [
  {
    title: 'Grow Your Own Goods',
    label: 'Homestead goods',
    description:
      'Homestead goods, handmade products, luffa, woodworking, crochet, local art, and rural Virginia products made with care and rooted in place.',
    link: '/shop/',
    cta: 'Shop goods',
    icon: 'goods',
  },
  {
    title: 'Grow Your Own Power',
    label: 'Rural infrastructure',
    description:
      'Power farming, engineering, and rural infrastructure designed to help communities become more resilient, self-reliant, and energy-aware.',
    link: '/rural-development/',
    cta: 'Explore rural development',
    icon: 'power',
  },
  {
    title: 'Grow Your Own Talent',
    label: 'Workforce pathways',
    description:
      'Technical mentorship, VoTech partnerships, Open Source Oasis, and hands-on learning pathways designed to help future unicorns grow right here at home.',
    link: '/workforce-development/',
    cta: 'Explore workforce development',
    icon: 'talent',
  },
  {
    title: 'Grow Your Own Adventure',
    label: 'Local discovery',
    description:
      'Local experiences, tourism, events, and Appalachian discovery designed to keep talent, stories, and tourism dollars close to home.',
    link: '/explore-lee-county/',
    cta: 'Discover Lee County',
    icon: 'adventure',
  },
]

const Icon = ({ name }) => {
  if (name === 'power') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M25 4 12 27h11l-2 17 15-25H25z" />
      </svg>
    )
  }

  if (name === 'talent') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 33c8-8 22-8 30 0" />
        <path d="M14 20h20v14H14z" />
        <path d="M19 15h10l5 5H14z" />
      </svg>
    )
  }

  if (name === 'adventure') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M7 34c9-15 16-21 34-25-4 18-10 25-25 34l-3-6z" />
        <path d="m26 16 6 6" />
        <path d="M9 39c4-1 7-2 10-5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 40V18" />
      <path d="M24 20c-9-1-13-6-14-13 8 1 13 5 14 13z" />
      <path d="M25 25c9-1 13-6 14-13-8 1-13 5-14 13z" />
      <path d="M13 40h22" />
    </svg>
  )
}

export default function Home() {
  useEffect(() => {
    const revealTargets = document.querySelectorAll('[data-reveal]')

    if (
      !window.IntersectionObserver
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      revealTargets.forEach((target) => target.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 },
    )

    revealTargets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section className="hero" aria-label="LoveLeeVa introduction">
        <div className="hero__map" aria-hidden="true" />
        <div className="hero__inner">
          <div className="hero__content">
            <img
              src={logoImg}
              alt="LoveLeeVa"
              className="hero__logo"
              width="586"
              height="426"
              decoding="async"
              fetchPriority="high"
            />
            <p className="hero__eyebrow">We Grow Our Own</p>
            <h1 className="hero__headline">Local Roots. Rural Possibility.</h1>
            <p className="hero__sub">
              Sustainable rural development through local goods, rural infrastructure,
              workforce development, and Appalachian discovery in Lee County, Virginia.
            </p>
            <div className="hero__ctas">
              <Link to="/shop/" className="btn btn--primary">Shop Local Goods</Link>
              <Link to="/rural-development/" className="btn btn--ghost">Explore the Mission</Link>
              <Link to="/explore-lee-county/" className="btn btn--copper">Grow Your Own Adventure</Link>
            </div>
          </div>
          <div className="hero__system" aria-label="LoveLeeVa growth pillars">
            <div className="system-card system-card--center">
              <span>Built in Lee County</span>
              <strong>We Grow Our Own</strong>
            </div>
            {pillars.map((pillar) => (
              <div className="system-card" key={pillar.title}>
                <Icon name={pillar.icon} />
                <span>{pillar.title.replace('Grow Your Own ', '')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pillars section-band" id="pillars" data-reveal>
        <div className="section-inner">
          <div className="section-intro" data-reveal>
            <p className="section-label">Four Pillars</p>
            <h2 className="section-heading">A local ecosystem designed for growth.</h2>
            <p className="section-copy">
              LoveLeeVa is more than a storefront. It is a rural development platform
              connecting handmade goods, practical infrastructure, technical mentorship,
              vocational education, and local discovery.
            </p>
          </div>
          <div className="pillars__grid">
            {pillars.map((pillar) => (
              <article className="pillar-card" key={pillar.title} data-reveal>
                <div className="pillar-card__top">
                  <span className="pillar-card__icon"><Icon name={pillar.icon} /></span>
                  <span className="pillar-card__label">{pillar.label}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <Link to={pillar.link}>{pillar.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="goods-section" data-reveal>
        <div className="goods-section__inner">
          <div className="goods-section__content" data-reveal>
            <p className="section-label">Shop / Products</p>
            <h2 className="section-heading">Homestead goods with a maker's hand.</h2>
            <p className="section-copy">
              Luffa products, woodworking, crochet, handmade goods, local artist items,
              and seasonal rural products can all live under one LoveLeeVa roof.
            </p>
            <Link to="/shop/" className="btn btn--primary">Shop LoveLeeVa Goods</Link>
          </div>
          <div className="goods-grid" aria-label="Featured product areas">
            <Link
              to="/shop/"
              className="goods-tile goods-tile--photo"
              data-reveal
            >
              <img
                src={rollingTrayHomepage}
                alt="Handcrafted wooden rolling tray with raised edges and an engraved tree detail"
                className="goods-tile__image"
                width="433"
                height="577"
                loading="lazy"
                decoding="async"
              />
              <span>Woodworking</span>
            </Link>
            <Link
              to="/shop/"
              className="goods-tile goods-tile--photo"
              data-reveal
            >
              <img
                src={wallArtHomepage}
                alt="Black-and-white Appalachian woodland landscape painting displayed on an easel"
                className="goods-tile__image"
                width="1600"
                height="1200"
                loading="lazy"
                decoding="async"
              />
              <span>Local Art</span>
            </Link>
            <Link to="/shop/" className="goods-tile goods-tile--texture" data-reveal>
              <span>Luffa + Handmade Goods</span>
            </Link>
            <Link to="/customized/" className="goods-tile goods-tile--craft" data-reveal>
              <span>Custom Rural Products</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mission-section section-band" data-reveal>
        <div className="mission-section__inner" data-reveal>
          <p className="section-label">Mission</p>
          <h2>We Grow Our Own.</h2>
          <p>
            LoveLeeVa is a sustainable rural development platform rooted in local
            products, rural infrastructure, workforce development, and tourism. The
            foundation is simple: build useful systems at home, keep opportunity close,
            and let Lee County&rsquo;s makers, students, small businesses, and visitors see
            themselves in the same Appalachian story.
          </p>
        </div>
      </section>

      <section className="community-section" data-reveal>
        <div className="section-inner community-section__inner">
          <div data-reveal>
            <p className="section-label">Local Visibility</p>
            <h2 className="section-heading">Better discovery means stronger local revenue.</h2>
          </div>
          <div className="community-list">
            <p data-reveal>Local maker features and small business storytelling</p>
            <p data-reveal>Chamber work, small businesses, restaurants, and events visibility</p>
            <p data-reveal>Tourism ideas that keep stories and spending close to home</p>
            <Link to="/explore-lee-county/" data-reveal>Explore Lee County <span aria-hidden="true">→</span></Link>
            <Link to="/lee-county-virginia-guide/" data-reveal>Read the Local Guide <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="collaborate-section" data-reveal>
        <div className="collaborate-section__inner" data-reveal>
          <p className="section-label">Contact / Collaborate</p>
          <h2>Want to collaborate, be featured, sell goods, or join the mission?</h2>
          <div className="collaborate-section__actions">
            <Link to="/contact/" className="btn btn--primary">Contact LoveLeeVa</Link>
            <Link to="/contact/" className="btn btn--ghost">Feature My Business</Link>
            <Link to="/contact/" className="btn btn--copper">Join the Local Maker Network</Link>
          </div>
        </div>
      </section>
    </>
  )
}
