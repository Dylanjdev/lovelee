export const siteOrigin = 'https://loveleeva.com'

export const seoPages = [
  {
    path: '/',
    label: 'Home',
    title: 'LoveLeeVa | Local Goods & Rural Development in Virginia',
    description: 'LoveLeeVa connects local goods, rural development, workforce pathways, and Appalachian discovery in Lee County, Virginia.',
    index: true,
  },
  {
    path: '/about',
    label: 'About LoveLeeVa',
    title: 'About LoveLeeVa | Community Development in Lee County',
    description: 'Meet LoveLeeVa and our local-first approach to goods, talent, infrastructure, tourism, and community development in Lee County, Virginia.',
    index: true,
  },
  {
    path: '/rural-development',
    label: 'Rural Development',
    title: 'Sustainable Rural Development in Virginia | LoveLeeVa',
    description: 'Explore sustainable rural development through infrastructure, workforce development, local products, tourism, and community-led growth in Virginia.',
    index: true,
  },
  {
    path: '/workforce-development',
    label: 'Workforce Development',
    title: 'Workforce Development & Technical Mentorship | LoveLeeVa',
    description: 'Explore technical mentorship, vocational education, and hands-on workforce development pathways for Lee County and rural Virginia.',
    index: true,
  },
  {
    path: '/explore-lee-county',
    label: 'Explore Lee County',
    title: 'Lee County VA Tourism & Local Discovery | LoveLeeVa',
    description: 'Discover Lee County, Virginia through Appalachian events, local businesses, handmade goods, community experiences, and rural tourism.',
    index: true,
  },
  {
    path: '/lee-county-virginia-guide',
    label: 'Lee County, Virginia Guide',
    title: 'Lee County, Virginia Guide: Things to Do | LoveLeeVa',
    description: 'Plan a Lee County, Virginia day with outdoor attractions, Appalachian history, local businesses, events, and practical travel tips from LoveLeeVa.',
    index: true,
  },
  {
    path: '/shop',
    label: 'Shop',
    title: 'Handmade Goods & Local Products in Virginia | LoveLeeVa',
    description: 'Shop handmade goods, homesteading products, woodworking, fiber arts, and local products rooted in Jonesville and rural Virginia.',
    index: true,
  },
  {
    path: '/directory',
    label: 'Lee County Business Directory',
    title: 'Local Businesses in Lee County, Virginia | LoveLeeVa',
    description: 'Discover Lee County shops, restaurants, lodging, services, and local products while supporting the rural Virginia local economy.',
    index: true,
  },
  {
    path: '/calendar',
    label: 'Lee County Community Calendar',
    title: 'Lee County VA Events & Community Calendar | LoveLeeVa',
    description: 'Find Lee County festivals, live music, family activities, meetings, and Appalachian events for residents and rural Virginia visitors.',
    index: true,
    hydrate: false,
  },
  {
    path: '/customized',
    label: 'Customized',
    title: 'Custom Woodworking and Engraving | LoveLeeVa',
    description: 'Request custom engraving, sizing, gift sets, and one-of-a-kind handcrafted work from LoveLeeVa in Jonesville, Virginia.',
    index: true,
  },
  {
    path: '/contact',
    label: 'Contact Us',
    title: 'Contact LoveLeeVa in Jonesville, Virginia',
    description: 'Contact LoveLeeVa in Jonesville, Virginia about local goods, custom work, collaborations, and community ideas.',
    index: true,
  },
  {
    path: '/privacy-policy',
    label: 'Privacy Policy',
    title: 'Privacy Policy | LoveLeeVa',
    description: 'Read the LoveLeeVa Privacy Policy.',
    index: true,
  },
  {
    path: '/terms',
    label: 'Terms of Service',
    title: 'Terms of Service | LoveLeeVa',
    description: 'Read the LoveLeeVa Terms of Service.',
    index: true,
  },
  {
    path: '/cart',
    label: 'Shopping Cart',
    title: 'Shopping Cart | LoveLeeVa',
    description: 'Review the handcrafted LoveLeeVa goods in your shopping cart.',
    index: false,
  },
  {
    path: '/checkout',
    label: 'Checkout',
    title: 'Checkout | LoveLeeVa',
    description: 'Complete your LoveLeeVa order.',
    index: false,
  },
]

const notFoundSeo = {
  label: 'Page Not Found',
  title: 'Page Not Found | LoveLeeVa',
  description: 'The requested LoveLeeVa page could not be found.',
  index: false,
}

export function normalizeRoutePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/'
}

export function getSeoForPath(pathname) {
  const path = normalizeRoutePath(pathname)
  return seoPages.find((page) => page.path === path) ?? { ...notFoundSeo, path }
}

export function canonicalUrlForPath(pathname) {
  const path = normalizeRoutePath(pathname)
  return `${siteOrigin}${path === '/' ? '/' : `${path}/`}`
}
