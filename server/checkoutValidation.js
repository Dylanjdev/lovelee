const MAX_CART_LINES = 50
const MAX_LINE_QUANTITY = 99

export class CheckoutValidationError extends Error {
  constructor(message, { status = 400, code = 'invalid_cart', details = [] } = {}) {
    super(message)
    this.name = 'CheckoutValidationError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function money(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

function normalizeCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutValidationError('Your cart is empty.')
  }

  if (items.length > MAX_CART_LINES) {
    throw new CheckoutValidationError('Your cart contains too many different items.')
  }

  const seenProductIds = new Set()

  return items.map((item) => {
    const productId = String(item?.productId || '')
    const quantity = Number(item?.quantity)
    const clientUnitPrice = Number(item?.unitPrice)

    if (!/^\d+$/.test(productId) || seenProductIds.has(productId)) {
      throw new CheckoutValidationError('Your cart contains an invalid product.')
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
      throw new CheckoutValidationError('Your cart contains an invalid quantity.')
    }

    seenProductIds.add(productId)

    return {
      productId,
      quantity,
      clientUnitPrice: Number.isFinite(clientUnitPrice) ? money(clientUnitPrice) : null,
    }
  })
}

export function validateCartPricing(items, products, currency = 'USD') {
  const normalizedItems = normalizeCartItems(items)
  const productsById = new Map(products.map((product) => [String(product.id), product]))
  const unavailableItems = []
  const validatedItems = normalizedItems.flatMap((item) => {
    const product = productsById.get(item.productId)

    if (!product) {
      unavailableItems.push({ productId: item.productId, reason: 'not_found' })
      return []
    }

    if (item.quantity > product.inventoryCount) {
      unavailableItems.push({
        productId: item.productId,
        name: product.name,
        reason: 'insufficient_stock',
        availableQuantity: product.inventoryCount,
      })
      return []
    }

    const unitPrice = money(product.price)

    return [{
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal: money(unitPrice * item.quantity),
      inventoryCount: product.inventoryCount,
      priceChanged: item.clientUnitPrice !== null && item.clientUnitPrice !== unitPrice,
      previousUnitPrice: item.clientUnitPrice,
    }]
  })

  if (unavailableItems.length) {
    throw new CheckoutValidationError(
      'One or more items changed in Odoo. Review your cart and try again.',
      {
        status: 409,
        code: 'cart_changed',
        details: unavailableItems,
      },
    )
  }

  return {
    items: validatedItems,
    subtotal: money(validatedItems.reduce((total, item) => total + item.lineTotal, 0)),
    currency,
    hasPriceChanges: validatedItems.some((item) => item.priceChanged),
    validatedAt: new Date().toISOString(),
  }
}
