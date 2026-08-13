import FocusPage from './FocusPage.jsx'

const page = {
  slug: 'explore-lee-county',
  breadcrumb: 'Tourism in Lee County',
  eyebrow: 'U.S. Tourism, Rooted Locally',
  headline: 'Plan Your Lee County, Virginia Visit',
  lede: 'For travelers exploring the United States by road, mountain route, or weekend getaway, Lee County offers an authentic Southwest Virginia stop built around Appalachian landscapes, living history, and local people.',
  introLabel: 'A Place to Put on the Map',
  introHeading: 'A distinctly local destination in the American Southeast.',
  intro: [
    'Lee County is in Virginia\'s far southwest, where the state meets Kentucky and Tennessee and the Appalachian landscape sets the pace. For visitors from across the United States, it is a compelling place to slow down between larger destinations: a county of mountain roads, historic routes, small towns, outdoor places, and community traditions that are still part of everyday life.',
    'The county is especially well suited to a road trip, a long weekend, a heritage journey, or a scenic detour through the Southeast. Cumberland Gap and Wilderness Road connect Lee County to a larger American story of movement and settlement, while Jonesville, Pennington Gap, local businesses, events, and makers give the visit a present-day sense of place.',
    'LoveLeeVa helps travelers turn interest into a local itinerary. Use the directory to find places to eat, stay, shop, and get services; check the calendar for the day\'s community life; and use the guide to choose an anchor experience before filling in the rest of the route. The goal is simple: make Lee County easier to find and make each visit more meaningful for the people who live here.',
  ],
  asideHeading: 'Why travelers choose Lee County',
  asideItems: [
    'A natural stop in a Virginia, Kentucky, or Tennessee road trip',
    'Cumberland Gap, Wilderness Road, mountain scenery, and outdoor time',
    'Small-town meals, shops, events, makers, and local stories',
    'A slower, more personal alternative to a checklist itinerary',
  ],
  pathsLabel: 'Build Your U.S. Travel Itinerary',
  pathsHeading: 'Start with the kind of trip you are planning.',
  pathsCopy: 'Lee County can be the destination, a regional base, or one memorable stop on a longer American road trip. Begin with one reason to come, then let local places shape the rest of the day.',
  paths: [
    {
      title: 'Plan a Mountain Road Trip',
      description: 'Build a route through Southwest Virginia, eastern Kentucky, and Northeast Tennessee with time for overlooks, historic places, local meals, and an unhurried drive.',
      link: '/directory/',
      cta: 'Find local stops',
    },
    {
      title: 'Follow Appalachian History',
      description: 'Use Cumberland Gap and Wilderness Road as anchors for a trip through the stories of migration, frontier travel, settlement, work, and the communities shaped by these mountains.',
      link: '/lee-county-virginia-guide/',
      cta: 'Read the local guide',
    },
    {
      title: 'Find the Local Calendar',
      description: 'Time your visit around festivals, music, arts and culture, family activities, outdoor programs, and public gatherings that show what Lee County is doing now.',
      link: '/calendar/',
      cta: 'See what is happening',
    },
    {
      title: 'Make the Visit Personal',
      description: 'Choose a locally owned restaurant, shop, lodging option, service provider, or handmade good. These small decisions turn a pass-through stop into a connection with Lee County.',
      link: '/shop/',
      cta: 'Shop local goods',
    },
  ],
  featureLabel: 'Tourism With Local Value',
  featureHeading: 'The best U.S. travel stories are connected to real places.',
  featureCopy: [
    'Travelers are looking for more than a photograph and a highway exit. Lee County offers the kind of American destination that rewards curiosity: a landscape with depth, historic places with context, small towns with their own rhythm, and people whose work gives the visit its character.',
    'That value grows when tourism reaches beyond a single attraction. Staying nearby, eating locally, attending an event, buying from a maker, and sharing a specific business all help keep the benefits of travel close to the county. LoveLeeVa is building the local connections that make a Lee County visit easier to plan and harder to forget.',
  ],
  featureLinks: [
    { to: '/directory/', label: 'Browse local businesses' },
    { to: '/calendar/', label: 'Find community events' },
    { to: '/lee-county-virginia-guide/', label: 'Read the Lee County guide' },
  ],
  faqs: [
    {
      question: 'Where is Lee County, Virginia, for U.S. travelers?',
      answer: 'Lee County is in the far southwestern corner of Virginia, in the Appalachian region where Virginia meets Kentucky and Tennessee. Jonesville is the county seat, and Pennington Gap is the other incorporated town.',
    },
    {
      question: 'Why visit Lee County instead of only passing through?',
      answer: 'Lee County combines mountain scenery, Cumberland Gap and Wilderness Road history, small-town culture, community events, local food, shops, and makers. A visit gives travelers a closer look at a living Appalachian community rather than only a roadside view.',
    },
    {
      question: 'How should I include Lee County in a U.S. road trip?',
      answer: 'Treat Lee County as a destination for a full day or weekend, or pair it with a larger route through Southwest Virginia, eastern Kentucky, or Northeast Tennessee. Choose one anchor experience, confirm current hours and conditions, then add a local meal, shop, event, or scenic stop.',
    },
    {
      question: 'How many days do I need in Lee County?',
      answer: 'A focused first visit can fit into one day, but two or three days allow more time for Cumberland Gap, Wilderness Road, local businesses, community events, and the slower pace of mountain roads. Build in flexibility because rural travel takes time between stops.',
    },
    {
      question: 'What season is best for visiting Lee County?',
      answer: 'Every season offers a different reason to come. Spring and summer are useful for outdoor time and community events, autumn brings changing mountain color, and winter can make for a quieter history-and-town visit. Check weather, trail conditions, event dates, and business hours before traveling.',
    },
    {
      question: 'What can I discover through LoveLeeVa before I travel?',
      answer: 'LoveLeeVa connects visitors and residents with Lee County businesses, community events, handmade goods, custom work, and locally rooted ideas and experiences. Use the directory, calendar, shop, and local guide together to shape a current itinerary.',
    },
    {
      question: 'How can my trip support Lee County?',
      answer: 'Choose locally owned restaurants, shops, lodging, and services; attend community events; buy from area makers; follow park and property guidance; and share specific local places with other travelers. Those choices help keep more attention and spending in the local economy.',
    },
  ],
  ctaLabel: 'Keep Lee County in the Conversation',
  ctaHeading: 'Help travelers find the local story.',
  ctaCopy: 'Add a Lee County business, submit a community event, or tell LoveLeeVa about a local experience worth planning a trip around.',
  ctaLinks: [
    { to: '/directory/#submit-a-business', label: 'Add a Business' },
    { to: '/calendar/#submit-an-event', label: 'Submit an Event' },
  ],
}

export default function ExploreLeeCounty() {
  return <FocusPage page={page} />
}
