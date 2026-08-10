const productTones = ['walnut', 'copper', 'forest', 'sage', 'gold', 'clay']

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function normalizeStoreProduct(product, index) {
  const rawCategoryLabel = product.categoryLabel || 'LoveLeeVA Goods'
  const categoryLabel = /^(loveleeva )?goods$/i.test(rawCategoryLabel.trim())
    ? 'LoveLeeVA Collection'
    : rawCategoryLabel
  const inventoryCount = Math.max(0, Math.floor(Number(product.inventoryCount) || 0))
  const hasDescription = Boolean(product.description?.trim())

  return {
    id: String(product.id),
    odooId: Number(product.odooId),
    sku: product.sku || null,
    name: product.name,
    category: slugify(categoryLabel) || 'goods',
    categoryLabel,
    price: Number(product.price) || 0,
    description: product.description || 'A small-batch piece made in Lee County, Virginia.',
    hasDescription,
    details: product.sku ? `Item ${product.sku}` : 'Handmade in Southwest Virginia',
    badge: inventoryCount === 1 ? 'One available' : null,
    inventoryCount,
    image: product.imageUrl || null,
    imageAlt: product.name,
    tone: productTones[index % productTones.length],
  }
}

export function createProductCategories(products) {
  const categories = new Map()

  products.forEach((product) => {
    if (!categories.has(product.category)) {
      categories.set(product.category, product.categoryLabel)
    }
  })

  return [
    { value: 'all', label: 'All goods' },
    ...Array.from(categories, ([value, label]) => ({ value, label })),
  ]
}

export function formatMoney(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}
