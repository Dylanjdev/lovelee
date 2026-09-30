import FocusPage from './FocusPage.jsx'

const page = {
  slug: 'southwest-virginia-road-trip-guide',
  breadcrumb: 'Southwest Virginia Road Trip Guide',
  eyebrow: 'Mountains, History & Local Stops',
  headline: 'A Southwest Virginia Road Trip Through Lee County',
  lede: 'Follow the Wilderness Road toward Virginia’s western edge for mountain views, living history, small-town stops, and a closer look at the communities around Cumberland Gap.',
  introLabel: 'Start at Virginia’s Western Edge',
  introHeading: 'A two-day route with room to wander.',
  intro: [
    'Lee County makes a natural western anchor for a Southwest Virginia road trip. The drive brings together two nationally significant landscapes—Wilderness Road State Park and Cumberland Gap National Historical Park—with the towns, local businesses, and community life that make this corner of Virginia more than a scenic pass-through.',
    'Give the route at least two unhurried days. Begin around Ewing and the historic Wilderness Road, continue toward Cumberland Gap for overlooks or a trail, then make time for Jonesville and Pennington Gap. Short distances can still take time on mountain roads, and the best stops are often the ones that invite you to slow down.',
    'Use this itinerary as a starting point rather than a rigid schedule. Park programs, tours, trail access, weather, business hours, and local events can change by season. Check current conditions before leaving, then keep enough space in the day for a local meal, a shop, or a conversation you did not plan.',
  ],
  asideHeading: 'Road trip at a glance',
  asideItems: [
    'Best paced over two days or a relaxed long weekend',
    'Anchor stops at Wilderness Road and Cumberland Gap',
    'Local time in Ewing, Jonesville, and Pennington Gap',
    'Mountain roads, limited cell service, and seasonal conditions',
  ],
  pathsLabel: 'A Two-Day Lee County Itinerary',
  pathsHeading: 'Build the drive around four memorable stops.',
  pathsCopy: 'Pair the region’s best-known historic landscapes with present-day Lee County. The order is flexible, so adjust for the weather, opening hours, and the pace of your group.',
  paths: [
    {
      title: 'Day One: Wilderness Road',
      description: 'Begin at Wilderness Road State Park in Ewing. Explore the visitor center, walking paths, picnic grounds, and reconstructed Martin’s Station when programs and seasonal access allow.',
      link: '/lee-county-virginia-guide/',
      cta: 'Explore the Lee County guide',
    },
    {
      title: 'Day One: Cumberland Gap',
      description: 'Continue toward Cumberland Gap National Historical Park. Choose a drive to an overlook, a short walk, or a longer trail that fits the day’s conditions and your available daylight.',
      link: '/cumberland-gap-national-historical-park-guide/',
      cta: 'Plan your park visit',
    },
    {
      title: 'Day Two: Town & Table',
      description: 'Spend time in Jonesville and Pennington Gap. Look for a locally owned meal, shop, service, or place to stay and let the county’s present-day character become part of the route.',
      link: '/directory/',
      cta: 'Browse local businesses',
    },
    {
      title: 'Add Something Local',
      description: 'Check for music, markets, festivals, public programs, and family activities before the trip. A community event can give the itinerary a date, a destination, and a stronger sense of place.',
      link: '/calendar/',
      cta: 'Check the calendar',
    },
  ],
  featureLabel: 'Travel That Stays Local',
  featureHeading: 'The road is better when the community is part of the destination.',
  featureCopy: [
    'Cumberland Gap and the Wilderness Road give this drive its historic shape, but local choices give it texture. A restaurant, a small shop, a community event, or a handmade object can tell you more about Lee County today than a quick stop at an overlook alone.',
    'Plan one major outdoor or historic experience each day, then fill the space around it locally. That pace works well in the mountains, leaves room for changing conditions, and keeps more of the value of the trip in the communities you came to see.',
  ],
  featureLinks: [
    { to: '/directory/', label: 'Find food, shops, and stays' },
    { to: '/calendar/', label: 'See upcoming events' },
    { to: '/shop/', label: 'Browse locally made goods' },
  ],
  faqs: [
    {
      question: 'How many days do I need for a Southwest Virginia road trip through Lee County?',
      answer: 'Two days is a comfortable starting point for Wilderness Road State Park, Cumberland Gap, and local time in Jonesville or Pennington Gap. Add a third day if you want a longer hike, seasonal tour, community event, or a slower drive through the region.',
    },
    {
      question: 'What are the best stops in Lee County, Virginia?',
      answer: 'Wilderness Road State Park and Cumberland Gap National Historical Park are strong anchor experiences. Pair them with Jonesville, Pennington Gap, a local meal or shop, and any community event happening during your visit.',
    },
    {
      question: 'Is Lee County a good family road trip destination?',
      answer: 'Yes. Families can combine visitor centers, picnicking, living history, scenic overlooks, and walks suited to different ages. Review current park information and choose trails and programs that match the group’s ability and the day’s weather.',
    },
    {
      question: 'When is the best time to take this road trip?',
      answer: 'Spring through autumn offers the widest range of outdoor options, while winter can be quieter and more focused on scenic drives and history. Conditions and operating hours vary by season, so confirm park alerts, tours, and business hours shortly before the trip.',
    },
    {
      question: 'What should I know before driving in far Southwest Virginia?',
      answer: 'Allow extra time for curving mountain roads, download directions in advance, keep fuel and water in mind, and expect cell service to vary. Check weather and park conditions, especially before a hike or winter drive.',
    },
    {
      question: 'Can I combine Lee County with Tennessee or Kentucky?',
      answer: 'Yes. Lee County sits where Virginia approaches Kentucky and Tennessee, making it a practical part of a three-state Appalachian itinerary. Cumberland Gap is the natural connection, while Lee County adds Virginia history, towns, businesses, and outdoor stops.',
    },
  ],
  ctaLabel: 'Plan the Local Part of the Trip',
  ctaHeading: 'Choose your stops before you take the road.',
  ctaCopy: 'Find a local business, check the community calendar, and save the detailed Lee County guide for the drive.',
  ctaLinks: [
    { to: '/directory/', label: 'Explore the Directory' },
    { to: '/lee-county-virginia-guide/', label: 'Read the Local Guide' },
  ],
}

export default function SouthwestVirginiaRoadTripGuide() {
  return <FocusPage page={page} />
}
