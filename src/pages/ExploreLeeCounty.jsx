import FocusPage from './FocusPage.jsx'

const page = {
  slug: 'explore-lee-county',
  breadcrumb: 'Explore Lee County',
  eyebrow: 'Tourism and Local Discovery',
  headline: 'Explore Lee County, Virginia',
  lede: 'Discover Appalachian events, local businesses, handmade goods, and the rural Virginia experiences that make Lee County worth knowing.',
  introLabel: 'Grow Your Own Adventure',
  introHeading: 'Find more of what makes Lee County worth the trip.',
  intro: [
    'Lee County sits in the far southwest corner of Virginia, where Appalachian landscapes, small towns, local makers, and community traditions shape the experience of a place. Local discovery helps residents see more of what is nearby and gives visitors a more meaningful way to explore rural Virginia.',
    'LoveLeeVa brings business listings, community events, handmade goods, and local stories into one connected starting point. Whether you are planning a visit or looking for something to do close to home, every local stop can help support the people and places behind Lee County tourism.',
  ],
  asideHeading: 'Start your local discovery',
  asideItems: [
    'Restaurants, shops, lodging, and services',
    'Festivals, music, family events, and meetings',
    'Handmade goods and local products',
    'Appalachian places, stories, and experiences',
  ],
  pathsLabel: 'Plan a LoveLee Day',
  pathsHeading: 'Eat, shop, gather, and explore locally.',
  pathsCopy: 'Use these LoveLeeVa resources to find local businesses and events, then keep discovering what is around the next bend.',
  paths: [
    {
      title: 'Find Local Businesses',
      description: 'Browse Lee County restaurants, shops, groceries, lodging, service providers, and other businesses before you head out.',
      link: '/directory/',
      cta: 'Open the directory',
    },
    {
      title: 'See What Is Happening',
      description: 'Check the community calendar for festivals, live music, arts and culture, outdoor activities, family events, and public gatherings.',
      link: '/calendar/',
      cta: 'View the calendar',
    },
    {
      title: 'Shop Handmade Goods',
      description: 'Take home woodworking, homestead goods, fiber arts, local art, and other products rooted in Southwest Virginia.',
      link: '/shop/',
      cta: 'Browse local products',
    },
    {
      title: 'Share a Local Find',
      description: 'Help more people discover a business, event, maker, or experience that belongs in the Lee County story.',
      link: '/contact/',
      cta: 'Send us a tip',
    },
  ],
  featureLabel: 'Tourism With Local Value',
  featureHeading: 'A good visit should strengthen the place being visited.',
  featureCopy: [
    'Rural tourism can do more than bring people through. When local discovery points visitors toward independent businesses, makers, events, and community spaces, more attention and spending stay in the local economy.',
    'That creates a better experience, too. Visitors encounter a living part of Appalachia rather than a generic itinerary, and residents gain more reasons to explore their own county. LoveLeeVa is building the connections that make both easier.',
  ],
  featureLinks: [
    { to: '/directory/', label: 'Browse local businesses' },
    { to: '/calendar/', label: 'Find community events' },
    { to: '/lee-county-virginia-guide/', label: 'Read the Lee County guide' },
  ],
  faqs: [
    {
      question: 'Where is Lee County, Virginia?',
      answer: 'Lee County is in the far southwestern corner of Virginia, in the Appalachian region near the borders of Kentucky and Tennessee.',
    },
    {
      question: 'What can I discover through LoveLeeVa?',
      answer: 'LoveLeeVa connects visitors and residents with Lee County businesses, community events, handmade goods, custom work, and locally rooted ideas and experiences.',
    },
    {
      question: 'How does local discovery support Lee County?',
      answer: 'Finding and choosing local businesses, products, and events helps keep more attention and spending in the local economy while giving small organizations and makers greater visibility.',
    },
  ],
  ctaLabel: 'Know a Place We Should Share?',
  ctaHeading: 'Help make local discovery easier.',
  ctaCopy: 'Add a Lee County business, submit a community event, or tell LoveLeeVa about a local experience worth finding.',
  ctaLinks: [
    { to: '/directory/#submit-a-business', label: 'Add a Business' },
    { to: '/calendar/#submit-an-event', label: 'Submit an Event' },
  ],
}

export default function ExploreLeeCounty() {
  return <FocusPage page={page} />
}
