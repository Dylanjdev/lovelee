import FocusPage from './FocusPage.jsx'

const page = {
  slug: 'rural-development',
  breadcrumb: 'Rural Development',
  eyebrow: 'Community Development in Appalachia',
  headline: 'Sustainable Rural Development in Virginia',
  lede: 'LoveLeeVa connects rural infrastructure, workforce development, local products, and tourism to strengthen Lee County and its local economy.',
  introLabel: 'A Local-First Model',
  introHeading: 'Rural development built from local strengths.',
  intro: [
    'Sustainable rural development works best when people, skills, businesses, and infrastructure grow together. In Lee County, Virginia, that means starting with the capability already here and building stronger connections between it.',
    'LoveLeeVa approaches community development as a practical, connected system. Useful rural infrastructure supports homes and businesses. Workforce development helps local talent build durable skills. Handmade goods and local products create reasons to buy close to home, while tourism and local discovery bring new attention to the people and places that make Appalachia distinctive.',
  ],
  asideHeading: 'Four parts of durable rural growth',
  asideItems: [
    'Practical, resilient rural infrastructure',
    'Workforce and vocational learning pathways',
    'Local products and small-business visibility',
    'Tourism rooted in place and community',
  ],
  pathsLabel: 'The Rural Development Framework',
  pathsHeading: 'Build the connections that help a place thrive.',
  pathsCopy: 'Each part supports the others, creating more ways for knowledge, opportunity, and spending to stay in rural Virginia.',
  paths: [
    {
      title: 'Rural Infrastructure',
      description: 'Explore practical ideas around power, engineering, resilience, and the systems that help rural households and communities do more for themselves.',
    },
    {
      title: 'Workforce Development',
      description: 'Connect technical mentorship, vocational education, and hands-on projects to skills that are useful in Lee County and beyond.',
      link: '/workforce-development/',
      cta: 'Explore workforce pathways',
    },
    {
      title: 'Local Enterprise',
      description: 'Give makers, shops, service providers, and other local businesses more visibility so the local economy has more room to circulate and grow.',
      link: '/directory/',
      cta: 'Find local businesses',
    },
    {
      title: 'Rural Tourism',
      description: 'Make it easier for residents and visitors to discover Appalachian events, experiences, handmade goods, and stories worth sharing.',
      link: '/explore-lee-county/',
      cta: 'Discover Lee County',
    },
  ],
  featureLabel: 'Connected Community Development',
  featureHeading: 'Local systems become stronger when they reinforce one another.',
  featureCopy: [
    'A workforce program is more valuable when learners can apply new skills to real local needs. A maker has more opportunity when residents and visitors can discover their work. A tourism initiative creates deeper value when it directs attention toward local businesses, products, and events.',
    'That is the heart of the LoveLeeVa rural development vision: not one isolated project, but a growing network of useful connections built around Lee County.',
  ],
  featureLinks: [
    { to: '/about/', label: 'Read about LoveLeeVa' },
    { to: '/shop/', label: 'Shop local goods' },
  ],
  faqs: [
    {
      question: 'What does sustainable rural development mean for Lee County?',
      answer: 'It means creating practical, locally useful growth that connects infrastructure, skills, small businesses, products, and visitor experiences while keeping more opportunity close to home.',
    },
    {
      question: 'How does community development support the local economy?',
      answer: 'Community development can make local businesses easier to find, help residents build relevant skills, strengthen shared resources, and give visitors more reasons to spend time and money locally.',
    },
    {
      question: 'Why connect rural infrastructure, workforce, and tourism?',
      answer: 'These areas reinforce one another. Better systems support businesses, skilled people can solve local problems, and thoughtful tourism can create demand for local goods, services, and experiences.',
    },
  ],
  ctaLabel: 'Build With Us',
  ctaHeading: 'Have an idea that could strengthen Lee County?',
  ctaCopy: 'LoveLeeVa welcomes conversations with makers, educators, businesses, community organizations, and neighbors who see practical ways to grow local capability.',
  ctaLinks: [
    { to: '/contact/', label: 'Start a Conversation' },
    { to: '/about/', label: 'Meet LoveLeeVa' },
  ],
}

export default function RuralDevelopment() {
  return <FocusPage page={page} />
}
