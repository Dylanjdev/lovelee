import { Link } from 'react-router-dom'
import { siteOrigin } from '../lib/seo.js'

const quickFacts = [
  {
    label: 'Location',
    value: 'Virginia, Kentucky, and Tennessee',
  },
  {
    label: 'Park Admission',
    value: 'Free; guided tours and shuttle programs may have fees',
  },
  {
    label: 'High Points',
    value: 'Pinnacle Overlook at 2,440 feet and White Rocks near 3,500 feet',
  },
  {
    label: 'Trail Network',
    value: 'More than 85 miles, from short walks to backcountry routes',
  },
]

const highlights = [
  {
    number: '01',
    label: 'Essential Overlook',
    title: 'Pinnacle Overlook',
    body: 'At 2,440 feet, this sandstone outcropping opens onto panoramic views across Kentucky, Virginia, and Tennessee. A winding four-mile paved road from U.S. 25E leads toward paved walkways and observation platforms above the historic Gap and Powell Valley.',
    note: 'If you only have time for one park stop, begin here. In autumn, the overlook is also a notable place to watch migrating hawks.',
  },
  {
    number: '02',
    label: 'Three States',
    title: 'Tri-State Peak',
    body: 'Follow the historic Wilderness Road Trail on a moderate climb to the point where Virginia, Tennessee, and Kentucky meet. A marker and sheltered gazebo make the state-line convergence easy to find.',
    note: 'Expect a steady switchback climb and allow time to explore the historic route along the way.',
  },
  {
    number: '03',
    label: 'Below the Mountain',
    title: 'Gap Cave',
    body: 'Also known historically as Cudjo’s Cavern, Gap Cave holds stalagmites, underground streams, and inscriptions associated with Civil War soldiers who used the cave for shelter and storage.',
    note: 'Ranger-led walking tours are seasonal. Check the National Park Service schedule and reservation details before your visit.',
  },
  {
    number: '04',
    label: 'Mountain History',
    title: 'Hensley Settlement',
    body: 'High on Brush Mountain, this preserved early 20th-century community includes hand-hewn log buildings, split-rail fences, and agricultural fields that tell the story of self-sufficient mountain families.',
    note: 'Reach the settlement by a strenuous backcountry hike or a park-operated seasonal shuttle tour.',
  },
]

const trails = [
  {
    name: 'Object Lesson Road Trail',
    distance: '0.8 miles',
    difficulty: 'Easy',
    features: 'A short paved route suited to families, with abundant botanical life.',
  },
  {
    name: 'Tri-State Peak Trail',
    distance: '2.4 miles',
    difficulty: 'Moderate',
    features: 'A steady switchback climb to the point where Virginia, Tennessee, and Kentucky meet.',
  },
  {
    name: 'White Rocks & Sand Cave',
    distance: '8.5–9 miles',
    difficulty: 'Strenuous',
    features: 'A 75-foot sandstone overhang, colorful sand, and a broad view over Powell Valley.',
  },
  {
    name: 'The Ridge Trail',
    distance: '21 miles one way',
    difficulty: 'Strenuous',
    features: 'A long-distance backcountry route along the spine of Cumberland Mountain.',
  },
]

const travelTips = [
  {
    title: 'Prepare for limited service.',
    body: 'Cell service can be unreliable on mountain trails and backroads. Download an offline map and pick up a current paper trail map at the visitor center before setting out.',
  },
  {
    title: 'Choose the season that fits.',
    body: 'Spring brings mountain laurel and rhododendron, while October and early November often bring changing color across the ridgelines. Weather and trail conditions can shift quickly in any season.',
  },
  {
    title: 'Leave the park as you found it.',
    body: 'Stay on marked trails, pack out everything you carry in, respect wildlife and historic resources, and follow current National Park Service guidance.',
  },
]

const externalSources = [
  {
    label: 'National Park Service — Cumberland Gap',
    href: 'https://www.nps.gov/cuga/',
  },
  {
    label: 'National Park Service — Things to Do',
    href: 'https://www.nps.gov/cuga/planyourvisit/things2do.htm',
  },
  {
    label: 'National Park Service — Current Conditions',
    href: 'https://www.nps.gov/cuga/planyourvisit/conditions.htm',
  },
  {
    label: 'Virginia State Parks — Wilderness Road',
    href: 'https://www.dcr.virginia.gov/state-parks/wilderness-road',
  },
]

function StructuredData({ data }) {
  const json = JSON.stringify(data).replaceAll('<', '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

export default function CumberlandGapGuide() {
  const pageUrl = `${siteOrigin}/cumberland-gap-national-historical-park-guide/`
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
        item: `${siteOrigin}/lee-county-virginia-guide/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Cumberland Gap National Historical Park Guide',
        item: pageUrl,
      },
    ],
  }
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Ultimate Visitor’s Guide to Cumberland Gap National Historical Park',
    description: 'Plan a Cumberland Gap visit with scenic overlooks, hiking trails, historic sites, travel tips, and local stops in Lee County, Virginia.',
    datePublished: '2026-08-27',
    dateModified: '2026-08-27',
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
      '@type': 'LandmarksOrHistoricalBuildings',
      name: 'Cumberland Gap National Historical Park',
    },
  }

  return (
    <>
      <StructuredData data={breadcrumbData} />
      <StructuredData data={articleData} />

      <section className="page-hero page-hero--focus page-hero--lee-guide page-hero--cumberland-guide">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="lee-guide-hero__terrain" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="page-hero__content">
          <p className="hero__eyebrow">Overlooks, Trails &amp; Local Stops</p>
          <h1 className="page-hero__headline">The Ultimate Visitor&rsquo;s Guide to Cumberland Gap National Historical Park</h1>
          <p className="page-hero__lede">
            Explore a storied Appalachian gateway through panoramic overlooks,
            historic routes, caves, backcountry trails, and welcoming Lee County
            communities on the park&rsquo;s Virginia side.
          </p>
          <div className="lee-guide-hero__actions">
            <a className="btn btn--primary" href="#park-highlights">See the highlights</a>
            <Link className="btn btn--ghost" to="/directory/">Find a local stop</Link>
          </div>
        </div>
      </section>

      <section className="lee-guide-intro">
        <div className="focus-page__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/lee-county-virginia-guide/">Lee County Guide</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Cumberland Gap</span>
          </nav>

          <div className="lee-guide-intro__grid">
            <article className="lee-guide-intro__copy">
              <p className="section-label">The First Gateway to the West</p>
              <h2 className="section-heading">A mountain passage with centuries of stories.</h2>
              <p>
                Stretching across roughly 24,000 acres along the rugged crest of
                Cumberland Mountain, Cumberland Gap National Historical Park is one
                of the most storied landscapes in the American East. The dramatic
                mountain notch served as a route for wildlife, Native peoples, and
                generations of westward travelers, later becoming part of the
                Wilderness Road associated with Daniel Boone.
              </p>
              <p>
                Today, the park crosses Virginia, Kentucky, and Tennessee, with more
                than 85 miles of hiking trails, sweeping overlooks, Civil War
                earthworks, historic settlements, and subterranean landscapes. Use
                this guide to choose the experiences that fit your time, then leave
                room for the mountain communities surrounding the park.
              </p>
              <p className="lee-guide-intro__note">
                Park programs, tours, roads, and trails can change with weather and
                the season. Confirm current conditions with the National Park Service
                before leaving home.
              </p>
            </article>

            <aside className="lee-guide-nav" aria-labelledby="cumberland-contents-heading">
              <p className="section-label">In This Guide</p>
              <h2 id="cumberland-contents-heading">Build your park day.</h2>
              <ol>
                <li><a href="#quick-facts">Park quick facts</a></li>
                <li><a href="#park-highlights">Must-see highlights</a></li>
                <li><a href="#cumberland-trails">Top hiking trails</a></li>
                <li><a href="#lee-county-basecamp">Lee County stops</a></li>
                <li><a href="#cumberland-travel-tips">Essential travel tips</a></li>
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <section className="cumberland-guide-facts" id="quick-facts">
        <div className="focus-page__inner">
          <div className="cumberland-guide-facts__heading">
            <p className="section-label">Getting to Know the Park</p>
            <h2>Quick facts for planning.</h2>
          </div>
          <dl className="cumberland-guide-facts__grid">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="lee-guide-highlights cumberland-guide-highlights" id="park-highlights">
        <div className="focus-page__inner">
          <div className="lee-guide-section-heading">
            <div>
              <p className="section-label">Must-See Stops</p>
              <h2 className="section-heading">Four ways into the park&rsquo;s story.</h2>
            </div>
            <p>
              From a drive-up panorama to a remote mountain settlement, each stop
              shows a different layer of the Cumberland Gap landscape.
            </p>
          </div>

          <div className="cumberland-guide-highlights__grid">
            {highlights.map((highlight) => (
              <article className="cumberland-guide-highlight" key={highlight.title}>
                <div className="lee-guide-highlight__meta">
                  <span>{highlight.number}</span>
                  <span>{highlight.label}</span>
                </div>
                <h3>{highlight.title}</h3>
                <p>{highlight.body}</p>
                <p className="cumberland-guide-highlight__note">{highlight.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cumberland-guide-trails" id="cumberland-trails">
        <div className="focus-page__inner">
          <div className="cumberland-guide-trails__heading">
            <p className="section-label">Top Hiking Trails</p>
            <h2>Choose a route that matches your day.</h2>
            <p>
              The park&rsquo;s trail network ranges from a short paved walk to a
              multi-day ridge journey. Distances are approximate; use an official
              map and check trail conditions before setting out.
            </p>
          </div>

          <div className="cumberland-guide-table-wrap">
            <table className="cumberland-guide-table">
              <caption>Selected Cumberland Gap hiking trails</caption>
              <thead>
                <tr>
                  <th scope="col">Trail</th>
                  <th scope="col">Distance</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Highlights</th>
                </tr>
              </thead>
              <tbody>
                {trails.map((trail) => (
                  <tr key={trail.name}>
                    <th scope="row">{trail.name}</th>
                    <td data-label="Distance">{trail.distance}</td>
                    <td data-label="Difficulty"><span>{trail.difficulty}</span></td>
                    <td data-label="Highlights">{trail.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cumberland-guide-feature">
        <div className="focus-page__inner cumberland-guide-feature__inner">
          <div className="cumberland-guide-feature__marker" aria-hidden="true">
            <span>3,500</span>
            <small>feet above sea level</small>
          </div>
          <article>
            <p className="section-label">High-Point Hike</p>
            <h2>White Rocks &amp; Sand Cave</h2>
            <p>
              On the park&rsquo;s eastern end near Ewing, Virginia, the climb to Sand
              Cave and White Rocks is one of Southwest Virginia&rsquo;s signature hikes.
              From the Civic Park or Ewing trailhead, the route rises through hardwood
              forest to Sand Cave, a sandstone amphitheater shaped by wind and water.
            </p>
            <p>
              Its roughly 75-foot ceiling shelters a floor of colorful sand.
              Continuing toward White Rocks brings hikers to a high cliffline and a
              sweeping view over the farms and ridges of Powell Valley. It is a
              strenuous outing, so carry water, start early, and plan around available
              daylight.
            </p>
            <a href="https://www.nps.gov/cuga/planyourvisit/hiking-trails.htm" target="_blank" rel="noopener noreferrer">
              Check official trail information <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      </section>

      <section className="lee-guide-local" id="lee-county-basecamp">
        <div className="focus-page__inner lee-guide-local__inner">
          <div className="lee-guide-local__statement">
            <p className="section-label">Basecamp &amp; Local Exploration</p>
            <h2>Make Lee County part of the adventure.</h2>
          </div>
          <div className="lee-guide-local__copy">
            <p>
              The park&rsquo;s eastern side opens into Lee County, Virginia. Pair the
              wilderness with Appalachian hospitality, small-town meals, local shops,
              and another chapter of the region&rsquo;s frontier history.
            </p>
            <h3>Wilderness Road State Park</h3>
            <p>
              Minutes from the national park boundary in Ewing, Wilderness Road State
              Park includes Martin&rsquo;s Station, a reconstructed 1775 frontier fort,
              along with visitor exhibits, picnicking areas, and gentler walking routes.
            </p>
            <h3>Jonesville &amp; Pennington Gap</h3>
            <p>
              After the trail, head toward Jonesville or Pennington Gap for a locally
              owned meal, coffee, handcrafted goods, or a community event. Look for
              Appalachian cooking, pottery, woodworking, regional foods, and mountain art.
            </p>
            <div className="lee-guide-local__links">
              <Link to="/directory/">Browse restaurants, shops &amp; lodging <span aria-hidden="true">→</span></Link>
              <Link to="/calendar/">Check local markets &amp; events <span aria-hidden="true">→</span></Link>
              <Link to="/lee-county-virginia-guide/">Explore the full Lee County guide <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lee-guide-practical" id="cumberland-travel-tips">
        <div className="focus-page__inner lee-guide-practical__inner">
          <div>
            <p className="section-label">Essential Travel Tips</p>
            <h2>Prepare for a mountain day.</h2>
          </div>
          <div className="lee-guide-practical__tips">
            {travelTips.map((tip, index) => (
              <article key={tip.title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{tip.title}</h3>
                <p>{tip.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lee-guide-sources">
        <div className="focus-page__inner lee-guide-sources__inner">
          <div>
            <p className="section-label">Plan With Current Information</p>
            <h2>Official sources for your visit.</h2>
            <p>
              Guide added August 27, 2026. Fees, programs, access, and trail
              conditions can change; confirm the latest details directly before traveling.
            </p>
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
            <p className="section-label">Plan the Full Day</p>
            <h2>Pair the trail with a local table.</h2>
            <p>Find a Lee County restaurant, shop, stay, or event to round out your Cumberland Gap itinerary.</p>
          </div>
          <div className="focus-cta__actions">
            <Link className="btn btn--primary" to="/directory/">Find a Local Stop</Link>
            <Link className="btn btn--ghost" to="/calendar/">Check the Calendar</Link>
          </div>
        </div>
      </section>
    </>
  )
}
