import rollingTrayImage from '../assets/RollingTrayHomepage.webp'
import wallArtImage from '../assets/wallArtHomepage.webp'
import walnutBoardImage from '../assets/walnut.webp'

export const products = [
  {
    id: 'maple-walnut-board',
    sku: 'MWB-001',
    name: 'Maple & Walnut Board',
    category: 'woodworking',
    categoryLabel: 'Woodworking',
    price: 75,
    description:
      'A versatile cutting, charcuterie, lap, and display board handcrafted from contrasting maple and walnut.',
    details: 'Maple + walnut · Food-safe finish',
    badge: 'Featured',
    inventoryCount: 6,
    image: walnutBoardImage,
    imageAlt: 'Handcrafted maple cutting board with two dark walnut accent strips',
    imageWidth: 433,
    imageHeight: 577,
    tone: 'walnut',
  },
  {
    id: 'engraved-rolling-tray',
    sku: 'ERT-001',
    name: 'Engraved Rolling Tray',
    category: 'woodworking',
    categoryLabel: 'Woodworking',
    price: 58,
    description:
      'A smooth hardwood tray with a deep grain, shaped edges, and room for a personal engraved detail.',
    details: 'Hardwood · Custom engraving ready',
    badge: 'Maker favorite',
    inventoryCount: 8,
    image: rollingTrayImage,
    imageAlt: 'Handcrafted wooden rolling tray with raised edges and an engraved tree detail',
    imageWidth: 433,
    imageHeight: 577,
    tone: 'copper',
  },
  {
    id: 'appalachian-wall-art',
    sku: 'AWA-001',
    name: 'Appalachian Wall Art',
    category: 'art',
    categoryLabel: 'Local Art',
    price: 95,
    description:
      'Warm, dimensional wall art inspired by the ridgelines, stories, and natural textures of Southwest Virginia.',
    details: 'Ready to hang · Small-batch piece',
    inventoryCount: 3,
    image: wallArtImage,
    imageAlt: 'Black-and-white Appalachian woodland landscape painting displayed on an easel',
    imageWidth: 1600,
    imageHeight: 1200,
    tone: 'forest',
  },
  {
    id: 'homegrown-luffa-set',
    sku: 'LFS-001',
    name: 'Homegrown Luffa Set',
    category: 'homestead',
    categoryLabel: 'Homestead Goods',
    price: 24,
    description:
      'A useful set of naturally grown luffa rounds and scrubbers for the kitchen, bath, and everyday home care.',
    details: 'Naturally grown · Set of four',
    badge: 'New',
    inventoryCount: 12,
    image: null,
    tone: 'sage',
  },
  {
    id: 'crocheted-market-basket',
    sku: 'CMB-001',
    name: 'Crocheted Market Basket',
    category: 'fiber',
    categoryLabel: 'Fiber Arts',
    price: 42,
    description:
      'A soft, sturdy carryall made by hand for market mornings, garden harvests, and daily gathering.',
    details: 'Hand-crocheted · Washable fiber',
    inventoryCount: 5,
    image: null,
    tone: 'gold',
  },
  {
    id: 'lee-county-gift-box',
    sku: 'LCG-001',
    name: 'Lee County Gift Box',
    category: 'gifts',
    categoryLabel: 'Gift Sets',
    price: 68,
    description:
      'A thoughtful mix of small-batch LoveLeeVA goods, packed together for housewarmings, hosts, and milestones.',
    details: 'Seasonal assortment · Gift-ready',
    inventoryCount: 7,
    image: null,
    tone: 'clay',
  },
]

export const productCategories = [
  { value: 'all', label: 'All goods' },
  { value: 'woodworking', label: 'Woodworking' },
  { value: 'homestead', label: 'Homestead' },
  { value: 'fiber', label: 'Fiber arts' },
  { value: 'art', label: 'Local art' },
  { value: 'gifts', label: 'Gift sets' },
]

export function getProductById(productId) {
  return products.find((product) => product.id === productId)
}

export function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}
