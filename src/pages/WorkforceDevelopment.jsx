import FocusPage from './FocusPage.jsx'

const page = {
  slug: 'workforce-development',
  breadcrumb: 'Workforce Development',
  eyebrow: 'Grow Your Own Talent',
  headline: 'Workforce Development and Technical Mentorship',
  lede: 'A rural Virginia vision for technical mentorship, vocational education, and hands-on learning that helps local talent build opportunity close to home.',
  introLabel: 'Skills With a Purpose',
  introHeading: 'Build skills. Keep opportunity close to home.',
  intro: [
    'Workforce development in rural communities is strongest when learning connects to real tools, real problems, and people who know the work. LoveLeeVa envisions pathways where students, career changers, tradespeople, technologists, and local employers can share knowledge and build practical experience.',
    'Technical mentorship adds the human connection that online lessons and textbooks cannot replace. Vocational education provides a direct route from curiosity to capability. Together, project-based learning and trusted guidance can help more people see a future for themselves in Lee County, across Appalachia, and in the wider technical workforce.',
  ],
  asideHeading: 'What local pathways can include',
  asideItems: [
    'One-to-one and small-group technical mentorship',
    'Vocational education and VoTech partnerships',
    'Hands-on, project-based learning',
    'Connections to local needs and employers',
  ],
  pathsLabel: 'A Practical Learning Path',
  pathsHeading: 'Move from interest to useful experience.',
  pathsCopy: 'The goal is not training for training’s sake. It is a clear path toward confidence, capability, and work that matters.',
  paths: [
    {
      title: 'Technical Mentorship',
      description: 'Pair learners with experienced people who can offer context, feedback, problem-solving habits, and a clearer view of technical careers.',
    },
    {
      title: 'Vocational Education',
      description: 'Support hands-on learning in trades, technology, fabrication, engineering, and other practical disciplines tied to real-world work.',
    },
    {
      title: 'Applied Projects',
      description: 'Turn lessons into useful work through community challenges, open-source projects, prototypes, and practical systems learners can explain and improve.',
    },
    {
      title: 'Local Opportunity',
      description: 'Help learners connect new skills to Lee County businesses, community organizations, entrepreneurship, remote work, and the broader regional economy.',
      link: '/directory/',
      cta: 'Explore local businesses',
    },
  ],
  featureLabel: 'Why Mentorship Matters',
  featureHeading: 'A trusted guide can make a technical path feel possible.',
  featureCopy: [
    'Rural learners may have talent and motivation without having easy access to a professional network. Technical mentorship can shorten that distance by helping someone choose a project, work through setbacks, understand workplace expectations, and recognize where their skills could lead.',
    'For mentors, educators, and employers, the same relationship offers a way to invest directly in the next generation of local talent. Over time, those connections can strengthen workforce development and community development together.',
  ],
  featureLinks: [
    { to: '/rural-development/', label: 'See the rural development model' },
    { to: '/contact/', label: 'Discuss mentorship' },
  ],
  faqs: [
    {
      question: 'What is technical mentorship?',
      answer: 'Technical mentorship is guidance from someone with practical experience in a trade, technology, engineering, or related field. It combines skill feedback with context about projects, careers, and professional problem-solving.',
    },
    {
      question: 'How is vocational education connected to workforce development?',
      answer: 'Vocational education builds job-relevant, hands-on skills. Workforce development connects those skills to career pathways, employers, entrepreneurship, and the long-term needs of a community.',
    },
    {
      question: 'Is LoveLeeVa currently accepting mentors or partners?',
      answer: 'LoveLeeVa is building relationships around its workforce vision. Educators, technical professionals, employers, community organizations, and prospective learners are encouraged to get in touch and share their interests.',
    },
  ],
  ctaLabel: 'Grow Local Talent',
  ctaHeading: 'Bring your experience—or your curiosity.',
  ctaCopy: 'Tell us if you are interested in mentoring, learning, partnering, or helping shape practical workforce pathways for Lee County.',
  ctaLinks: [
    { to: '/contact/', label: 'Connect With LoveLeeVa' },
    { to: '/rural-development/', label: 'Explore the Bigger Vision' },
  ],
}

export default function WorkforceDevelopment() {
  return <FocusPage page={page} />
}
