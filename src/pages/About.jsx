import { Link } from 'react-router-dom'

const pillars = [
  {
    number: '01',
    name: 'Goods',
    title: 'Grow Your Own Goods',
    description: 'Handmade products, woodworking, local art, homestead goods, and rural products created with care and rooted in place.',
  },
  {
    number: '02',
    name: 'Power',
    title: 'Grow Your Own Power',
    description: 'Practical ideas for power farming, engineering, and infrastructure that can make rural communities more resilient.',
  },
  {
    number: '03',
    name: 'Talent',
    title: 'Grow Your Own Talent',
    description: 'Technical mentorship, hands-on learning, and workforce pathways that help local people build opportunity close to home.',
  },
  {
    number: '04',
    name: 'Adventure',
    title: 'Grow Your Own Adventure',
    description: 'Local businesses, experiences, events, and Appalachian stories that give residents and visitors more reasons to explore Lee County.',
  },
]

const values = [
  {
    title: 'Useful by Design',
    body: 'We believe the best ideas solve real problems. From a handcrafted board to a community resource, the work should be practical, durable, and worth sharing.',
  },
  {
    title: 'Local First',
    body: 'Local makers, students, businesses, and families should be able to see themselves in the future being built around them—and benefit from it.',
  },
  {
    title: 'Built Together',
    body: 'Lasting rural development takes collaboration. We look for ways to connect skills, stories, organizations, and opportunities across the county.',
  },
]

export default function About() {
  return (
    <>
      <section className="page-hero page-hero--about">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Rooted in Lee County</p>
          <h1 className="page-hero__headline">About LoveLeeVa</h1>
          <p className="page-hero__lede">
            A local platform connecting what we make, what we know, and what we can
            build together in Southwest Virginia.
          </p>
        </div>
      </section>

      <section className="about">
        <div className="about__inner">
          <div className="about__text">
            <p className="section-label">Our Purpose</p>
            <h2 className="section-heading">Rural growth can begin from within.</h2>
            <p className="about__body">
              LoveLeeVa is a sustainable rural development platform based in
              Jonesville, Virginia. It began with a respect for good materials,
              handmade work, and the people who keep local knowledge alive. That same
              spirit now supports a bigger vision for Lee County.
            </p>
            <p className="about__body about__body--spaced">
              We want to make it easier to discover local goods, strengthen practical
              infrastructure, create pathways for homegrown talent, and share the
              experiences that make this corner of Appalachia special. The goal is not
              growth for growth&rsquo;s sake. It is useful growth that keeps more skill,
              visibility, and opportunity close to home.
            </p>
          </div>
          <div className="about-manifesto" aria-label="LoveLeeVa mission statement">
            <p className="about-manifesto__label">Our Working Belief</p>
            <p className="about-manifesto__statement">We Grow Our Own.</p>
            <div className="about-manifesto__list" aria-hidden="true">
              <span>Goods</span>
              <span>Power</span>
              <span>Talent</span>
              <span>Adventure</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-pillars">
        <div className="about-pillars__inner">
          <div className="about-pillars__intro">
            <div>
              <p className="section-label">What We&rsquo;re Building</p>
              <h2 className="section-heading">Four connected paths to local growth.</h2>
            </div>
            <p className="section-copy">
              Each pillar can stand on its own, but they become more powerful when
              products, people, infrastructure, and local discovery reinforce one another.
            </p>
          </div>
          <div className="about-pillars__grid">
            {pillars.map((pillar) => (
              <article className="about-pillar" key={pillar.name}>
                <div className="about-pillar__meta">
                  <span>{pillar.number}</span>
                  <span>{pillar.name}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-place">
        <div className="about-place__inner">
          <div>
            <p className="section-label">Why Lee County</p>
            <h2>Small places are full of big capability.</h2>
          </div>
          <div className="about-place__copy">
            <p>
              Lee County has makers, tradespeople, students, small businesses,
              community organizations, natural beauty, and stories worth finding. What
              rural communities often need is not more potential—it is more connection
              between the potential already here.
            </p>
            <ul>
              <li>Give local businesses and makers more visibility.</li>
              <li>Turn practical knowledge into learning and workforce pathways.</li>
              <li>Keep more visitor attention and spending in the local economy.</li>
              <li>Build systems that are useful, resilient, and locally meaningful.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="values__inner">
          <p className="section-label">How We Work</p>
          <h2 className="section-heading">The values behind the work.</h2>
          <div className="values__grid">
            {values.map((value) => (
              <article className="value-card" key={value.title}>
                <h3 className="value-card__title">{value.title}</h3>
                <p className="value-card__body">{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta__inner about-cta__inner--split">
          <div>
            <p className="section-label">Be Part of It</p>
            <h2 className="section-heading">There is room to build together.</h2>
            <p className="section-copy">
              Discover local goods, find a Lee County business, or tell us about an
              idea that belongs in the LoveLeeVa ecosystem.
            </p>
          </div>
          <div className="about-cta__btns">
            <Link to="/shop" className="btn btn--primary">Browse the Shop</Link>
            <Link to="/directory" className="btn btn--ghost">Explore the Directory</Link>
            <Link to="/contact" className="btn btn--copper">Start a Conversation</Link>
          </div>
        </div>
      </section>
    </>
  )
}
