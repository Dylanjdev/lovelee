import { Link } from 'react-router-dom'
import { siteOrigin } from '../lib/seo.js'

const highlights = [
  {
    number: '01',
    label: 'Outdoors + Living History',
    title: 'Wilderness Road State Park',
    body: 'Start in Ewing for walking, biking, picnicking, frontier history, and the reconstructed Martin’s Station. The park is a practical first stop for understanding the landscape and history of far Southwest Virginia.',
    href: 'https://www.dcr.virginia.gov/state-parks/wilderness-road',
    cta: 'Check the official park page',
  },
  {
    number: '02',
    label: 'Mountain Gateway',
    title: 'Cumberland Gap',
    body: 'Explore the historic mountain passage where Virginia, Kentucky, and Tennessee meet. The national park offers overlooks, trails, visitor information, and deeper routes into Appalachian natural and cultural history.',
    href: 'https://www.nps.gov/cuga/',
    cta: 'Plan with the National Park Service',
  },
  {
    number: '03',
    label: 'Small-Town Stops',
    title: 'Jonesville + Pennington Gap',
    body: 'Build time around Lee County’s two incorporated towns. Look for local meals, shops, community parks, historic places, performances, and the everyday businesses that give a visit its sense of place.',
    to: '/directory/',
    cta: 'Find local businesses',
  },
  {
    number: '04',
    label: 'What’s Happening',
    title: 'Community Events',
    body: 'Festivals, music, markets, family activities, public meetings, and seasonal programs can turn a simple drive into a full Lee County day. Check dates before leaving and add something local to the plan.',
    to: '/calendar/',
    cta: 'See the community calendar',
  },
]

const itineraries = [
  {
    duration: 'A first visit',
    title: 'History, town, and a local table',
    steps: [
      'Begin at Wilderness Road State Park and explore the visitor center or trail.',
      'Choose a Lee County restaurant or shop through the local business directory.',
      'Spend the afternoon in Jonesville or Pennington Gap, then check the calendar for an evening event.',
    ],
  },
  {
    duration: 'An outdoor day',
    title: 'Mountain views and open trail',
    steps: [
      'Choose a Cumberland Gap hike that fits your group, weather, and available daylight.',
      'Leave room for overlooks, photos, and a slower mountain-road pace.',
      'Refuel locally and take home a Lee County-made good instead of ending the day at a chain stop.',
    ],
  },
  {
    duration: 'A slow local day',
    title: 'Makers, main streets, and community',
    steps: [
      'Start with coffee, breakfast, or a locally owned shop in the directory.',
      'Browse LoveLeeVa goods and look for businesses, parks, or cultural stops nearby.',
      'Finish with live music, a festival, a community gathering, or another calendar find.',
    ],
  },
]

const faqs = [
  {
    question: 'Where is Lee County, Virginia?',
    answer: 'Lee County is in the far southwestern corner of Virginia. It borders Tennessee to the south and Kentucky to the north and west. Jonesville is the county seat, and Pennington Gap is the county’s other incorporated town.',
  },
  {
    question: 'What is Lee County best known for?',
    answer: 'Lee County is closely connected to the Cumberland Gap and Wilderness Road, Appalachian mountain scenery, frontier and coal heritage, outdoor recreation, small towns, community events, and locally made goods.',
  },
  {
    question: 'Can I explore Lee County in one day?',
    answer: 'Yes. For a first visit, choose one major outdoor or historic destination, one town, and one local meal or event. The county is rural, so a focused route usually makes for a better day than trying to fit in every stop.',
  },
  {
    question: 'Where can I find current Lee County events?',
    answer: 'Use the LoveLeeVa community calendar for local events, then confirm time, location, admission, and weather details with the organizer before traveling.',
  },
  {
    question: 'How can my visit support the local community?',
    answer: 'Choose locally owned restaurants and shops, attend community events, buy from area makers, respect private property and park rules, and share specific local businesses with others after your visit.',
  },
]

const externalSources = [
  {
    label: 'Lee County, Virginia — county overview',
    href: 'https://www.leecova.com/about',
  },
  {
    label: 'Virginia State Parks — Wilderness Road State Park',
    href: 'https://www.dcr.virginia.gov/state-parks/wilderness-road',
  },
  {
    label: 'National Park Service — Cumberland Gap',
    href: 'https://www.nps.gov/cuga/',
  },
  {
    label: 'Lee County Tourism — attractions and visitor ideas',
    href: 'https://www.ilovelee.org/attractions',
  },
]

function StructuredData({ data }) {
  const json = JSON.stringify(data).replaceAll('<', '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

export default function LeeCountyGuide() {
  const pageUrl = `${siteOrigin}/lee-county-virginia-guide/`
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
        name: 'Lee County, Virginia Guide',
        item: pageUrl,
      },
    ],
  }
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'A Local Guide to Lee County, Virginia',
    description: 'A practical guide to Lee County, Virginia attractions, outdoor recreation, towns, local businesses, events, and day-trip ideas.',
    datePublished: '2026-08-05',
    dateModified: '2026-08-05',
    mainEntityOfPage: pageUrl,
    author: {
      '@type': 'Organization',
      name: 'LoveLeeVa',
      url: siteOrigin,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LoveLeeVa',
      url: siteOrigin,
      logo: {
        '@type': 'ImageObject',
        url: `${siteOrigin}/android-chrome-512x512.png`,
      },
    },
    about: {
      '@type': 'Place',
      name: 'Lee County, Virginia',
      containedInPlace: {
        '@type': 'State',
        name: 'Virginia',
      },
    },
  }
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
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
      <StructuredData data={articleData} />
      <StructuredData data={faqData} />

      <section className="page-hero page-hero--focus page-hero--lee-guide">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="lee-guide-hero__terrain" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="page-hero__content">
          <p className="hero__eyebrow">Where Virginia Begins</p>
          <h1 className="page-hero__headline">A Local Guide to Lee County, Virginia</h1>
          <p className="page-hero__lede">
            Plan a day around Appalachian trails, living history, small-town stops,
            local businesses, handmade goods, and the community events that make
            Virginia&rsquo;s far southwest corner worth exploring.
          </p>
          <div className="lee-guide-hero__actions">
            <a className="btn btn--primary" href="#plan-your-day">Plan your day</a>
            <Link className="btn btn--ghost" to="/directory/">Find local businesses</Link>
          </div>
        </div>
      </section>

      <section className="lee-guide-intro">
        <div className="focus-page__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Lee County, Virginia Guide</span>
          </nav>

          <div className="lee-guide-intro__grid">
            <article className="lee-guide-intro__copy">
              <p className="section-label">Start With the Place</p>
              <h2 className="section-heading">Mountains, stories, and useful local stops.</h2>
              <p>
                Lee County occupies Virginia&rsquo;s far southwestern corner, bordered by
                Tennessee and Kentucky. Its two incorporated towns are Jonesville, the
                county seat, and Pennington Gap. Between and beyond them are mountain
                communities, farms, parks, trails, historic sites, local businesses, and
                a long relationship with the routes that carried people through the
                Cumberland Gap.
              </p>
              <p>
                This guide is built for a satisfying day, not a race between pins on a
                map. Choose one anchor experience, add a local meal or shop, and leave
                time for the roads and conversations in between. That slower approach is
                often where Lee County feels most like itself.
              </p>
              <p className="lee-guide-intro__note">
                LoveLeeVa is based in Jonesville and connects local discovery with a
                larger mission: helping more attention, skill, and spending stay close
                to home.
              </p>
            </article>

            <aside className="lee-guide-nav" aria-labelledby="guide-contents-heading">
              <p className="section-label">In This Guide</p>
              <h2 id="guide-contents-heading">Find what you need.</h2>
              <ol>
                <li><a href="#things-to-do">Things to do</a></li>
                <li><a href="#plan-your-day">Three day-trip ideas</a></li>
                <li><a href="#know-before-you-go">Know before you go</a></li>
                <li><a href="#lee-county-faq">Frequently asked questions</a></li>
                <li><a href="#guide-sources">Official visitor sources</a></li>
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <section className="lee-guide-highlights" id="things-to-do">
        <div className="focus-page__inner">
          <div className="lee-guide-section-heading">
            <div>
              <p className="section-label">Things to Do in Lee County</p>
              <h2 className="section-heading">Four good ways to begin.</h2>
            </div>
            <p>
              Pair a well-known destination with local food, shopping, or an event.
              You will see more of the county and put more of your visit into the
              community around you.
            </p>
          </div>

          <div className="lee-guide-highlights__grid">
            {highlights.map((highlight) => (
              <article className="lee-guide-highlight" key={highlight.title}>
                <div className="lee-guide-highlight__meta">
                  <span>{highlight.number}</span>
                  <span>{highlight.label}</span>
                </div>
                <h3>{highlight.title}</h3>
                <p>{highlight.body}</p>
                {highlight.to ? (
                  <Link to={highlight.to}>{highlight.cta} <span aria-hidden="true">→</span></Link>
                ) : (
                  <a href={highlight.href} target="_blank" rel="noopener noreferrer">
                    {highlight.cta} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lee-guide-itineraries" id="plan-your-day">
        <div className="focus-page__inner">
          <div className="lee-guide-itineraries__intro">
            <p className="section-label">Ready-Made Routes</p>
            <h2>Three ways to spend a Lee County day.</h2>
            <p>
              Use these as a starting point, then check hours, weather, trail
              conditions, and the <Link to="/calendar/">community calendar</Link> before you go.
            </p>
          </div>
          <div className="lee-guide-itineraries__grid">
            {itineraries.map((itinerary) => (
              <article className="lee-guide-itinerary" key={itinerary.title}>
                <p className="lee-guide-itinerary__duration">{itinerary.duration}</p>
                <h3>{itinerary.title}</h3>
                <ol>
                  {itinerary.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lee-guide-practical" id="know-before-you-go">
        <div className="focus-page__inner lee-guide-practical__inner">
          <div>
            <p className="section-label">Know Before You Go</p>
            <h2>Give a rural day room to breathe.</h2>
          </div>
          <div className="lee-guide-practical__tips">
            <article>
              <span aria-hidden="true">01</span>
              <h3>Check the day&rsquo;s details.</h3>
              <p>Park programs, tours, performances, business hours, and events can be seasonal. Confirm with the official source or organizer before traveling.</p>
            </article>
            <article>
              <span aria-hidden="true">02</span>
              <h3>Plan for mountain roads.</h3>
              <p>Stops may look close on a map while the drive asks for more time. Download directions, keep fuel in mind, and avoid stacking the itinerary too tightly.</p>
            </article>
            <article>
              <span aria-hidden="true">03</span>
              <h3>Leave the place stronger.</h3>
              <p>Buy local when you can, follow park guidance, stay on marked routes, respect private property, and carry out what you bring in.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="lee-guide-local">
        <div className="focus-page__inner lee-guide-local__inner">
          <div className="lee-guide-local__statement">
            <p className="section-label">The LoveLeeVa Lens</p>
            <h2>A good visit should create local value.</h2>
          </div>
          <div className="lee-guide-local__copy">
            <p>
              The best Lee County guide is not only a list of scenery. It also helps
              people find the maker, restaurant, performer, shop, tradesperson, and
              community group connected to the place.
            </p>
            <p>
              LoveLeeVa calls that <strong>Grow Your Own Adventure</strong>: explore
              locally, tell better stories about rural Virginia, and keep more of the
              benefit close to the people doing the work.
            </p>
            <div className="lee-guide-local__links">
              <Link to="/directory/">Browse the business directory <span aria-hidden="true">→</span></Link>
              <Link to="/shop/">Shop locally made goods <span aria-hidden="true">→</span></Link>
              <Link to="/about/">Learn about LoveLeeVa <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="focus-faq" id="lee-county-faq">
        <div className="focus-page__inner focus-faq__inner">
          <div>
            <p className="section-label">Helpful Answers</p>
            <h2 className="section-heading">Lee County guide FAQ.</h2>
          </div>
          <div className="focus-faq__list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="lee-guide-sources" id="guide-sources">
        <div className="focus-page__inner lee-guide-sources__inner">
          <div>
            <p className="section-label">Plan With Current Information</p>
            <h2>Official sources for your visit.</h2>
            <p>Guide reviewed August 5, 2026. Conditions and operating details can change; confirm them directly before leaving.</p>
          </div>
          <ul>
            {externalSources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer">
                  {source.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="focus-cta">
        <div className="focus-page__inner focus-cta__inner">
          <div>
            <p className="section-label">Make It a LoveLee Day</p>
            <h2>Find one more local stop.</h2>
            <p>Build your route with a Lee County business, community event, or locally made good.</p>
          </div>
          <div className="focus-cta__actions">
            <Link className="btn btn--primary" to="/directory/">Find a Business</Link>
            <Link className="btn btn--ghost" to="/calendar/">Check the Calendar</Link>
          </div>
        </div>
      </section>
    </>
  )
}
