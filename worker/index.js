import { CheckoutValidationError, validateCartPricing } from '../server/checkoutValidation.js'
import { createSandboxQuote, OdooCheckoutError } from '../server/odooCheckout.js'
import { createSandboxPaymentTransaction, OdooPaymentError } from '../server/odooPayment.js'
import { createSandboxPaymentIntent, StripeCheckoutError } from '../server/stripeCheckout.js'

const ODOO_PRODUCT_FIELDS = [
  'id',
  'display_name',
  'default_code',
  'lst_price',
  'qty_available',
  'virtual_available',
  'categ_id',
  'description_sale',
  'image_128',
]

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('Cache-Control', 'no-store')

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  })
}

function normalizeOdooUrl(value) {
  if (!value) throw new Error('ODOO_URL is not configured.')

  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error('ODOO_URL must use HTTPS.')

  return url.origin
}

async function odooCall(env, model, method, body) {
  if (!env.ODOO_API_KEY) throw new Error('ODOO_API_KEY is not configured.')

  const headers = {
    Authorization: `bearer ${env.ODOO_API_KEY}`,
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent': 'LoveLeeVA Storefront/1.0',
  }

  if (env.ODOO_DATABASE) headers['X-Odoo-Database'] = env.ODOO_DATABASE

  const response = await fetch(
    `${normalizeOdooUrl(env.ODOO_URL)}/json/2/${model}/${method}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
  )

  if (!response.ok) {
    const message = await response.text()
    console.error('Odoo request failed', response.status, message.slice(0, 1000))
    throw new Error(`Odoo returned HTTP ${response.status}.`)
  }

  return response.json()
}

function relationName(value, fallback) {
  return Array.isArray(value) && typeof value[1] === 'string' ? value[1] : fallback
}

function isStorefrontProduct(product) {
  return Boolean(
    product?.active
    && product.sale_ok
    && product.type !== 'service'
    && product.default_code !== 'TIPS'
    && relationName(product.categ_id, '').toLowerCase() !== 'services',
  )
}

function mapProduct(product) {
  const availableQuantity = Math.max(0, Math.floor(Number(product.qty_available) || 0))

  return {
    id: String(product.id),
    odooId: product.id,
    sku: product.default_code || null,
    name: product.display_name,
    price: Number(product.lst_price) || 0,
    inventoryCount: availableQuantity,
    forecastInventoryCount: Math.max(0, Math.floor(Number(product.virtual_available) || 0)),
    categoryLabel: relationName(product.categ_id, 'LoveLeeVA Goods'),
    description: product.description_sale || '',
    hasImage: Boolean(product.image_128),
    imageUrl: product.image_128 ? `/api/products/${product.id}/image` : null,
  }
}

async function getProducts(env) {
  const products = await odooCall(env, 'product.product', 'search_read', {
    domain: [
      ['active', '=', true],
      ['sale_ok', '=', true],
      ['type', '!=', 'service'],
      ['default_code', '!=', 'TIPS'],
    ],
    fields: ODOO_PRODUCT_FIELDS,
    order: 'name asc, id asc',
    limit: 250,
    context: {
      lang: 'en_US',
    },
  })

  return products.map(mapProduct)
}

async function getCheckoutConfig(env) {
  const [countriesResult, carriersResult, providersResult] = await Promise.allSettled([
    odooCall(env, 'res.country', 'search_read', {
      domain: [['code', '!=', false]],
      fields: ['id', 'name', 'code'],
      order: 'name asc',
      limit: 300,
      context: { lang: 'en_US' },
    }),
    odooCall(env, 'delivery.carrier', 'search_read', {
      domain: [['active', '=', true]],
      fields: ['id', 'name', 'delivery_type'],
      order: 'sequence asc, name asc',
      limit: 50,
      context: { lang: 'en_US' },
    }),
    odooCall(env, 'payment.provider', 'search_read', {
      domain: [],
      fields: ['id', 'name', 'state'],
      limit: 50,
      context: { lang: 'en_US' },
    }),
  ])

  const countries = countriesResult.status === 'fulfilled' ? countriesResult.value : []
  const carriers = carriersResult.status === 'fulfilled' ? carriersResult.value : []
  const providers = providersResult.status === 'fulfilled' ? providersResult.value : []

  return {
    countries: countries.map((country) => ({
      id: country.id,
      name: country.name,
      code: country.code,
    })),
    shippingMethods: carriers.map((carrier) => ({
      id: carrier.id,
      name: carrier.name,
      provider: carrier.delivery_type,
    })),
    paymentProviders: providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      mode: provider.state,
    })),
    configurationIssues: [
      countriesResult.status === 'rejected' ? 'countries' : null,
      carriersResult.status === 'rejected' ? 'shipping-methods' : null,
      providersResult.status === 'rejected' ? 'payment-providers' : null,
    ].filter(Boolean),
  }
}

function decodeBase64(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function getProductImage(env, productId) {
  const records = await odooCall(env, 'product.product', 'read', {
    ids: [productId],
    fields: [
      'active',
      'sale_ok',
      'type',
      'default_code',
      'categ_id',
      'image_256',
    ],
  })
  const product = records[0]
  const encodedImage = product?.image_256

  if (!isStorefrontProduct(product) || !encodedImage || typeof encodedImage !== 'string') {
    return jsonResponse({ error: 'Product image not found.' }, { status: 404 })
  }

  const bytes = decodeBase64(encodedImage)
  const optimizedImage = (
    await env.IMAGES
      .input(bytes)
      .transform({ width: 640 })
      .output({ format: 'image/webp', quality: 80 })
  ).response()

  return new Response(optimizedImage.body, {
    headers: {
      'Content-Type': optimizedImage.headers.get('Content-Type') || 'image/webp',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

function getProductImageId(pathname) {
  const match = pathname.match(/^\/api\/products\/(\d+)\/image$/)
  if (!match) return null

  const productId = Number(match[1])
  return Number.isSafeInteger(productId) && productId > 0 ? productId : null
}

async function handleApiRequest(request, env, url) {
  if (request.method === 'GET' && url.pathname === '/api/products') {
    const products = await getProducts(env)
    return jsonResponse({
      products,
      currency: 'USD',
      source: 'odoo',
      fetchedAt: new Date().toISOString(),
    })
  }

  if (request.method === 'GET' && url.pathname === '/api/checkout/config') {
    const config = await getCheckoutConfig(env)
    return jsonResponse({
      ...config,
      fetchedAt: new Date().toISOString(),
    })
  }

  if (request.method === 'POST' && url.pathname === '/api/checkout/validate') {
    const requestBody = await request.text()

    if (requestBody.length > 16_384) {
      return jsonResponse({ error: 'The checkout request is too large.' }, { status: 413 })
    }

    let payload
    try {
      payload = JSON.parse(requestBody)
    } catch {
      return jsonResponse({ error: 'The checkout request is invalid.' }, { status: 400 })
    }

    try {
      const products = await getProducts(env)
      const validation = validateCartPricing(payload?.items, products)
      return jsonResponse(validation)
    } catch (error) {
      if (error instanceof CheckoutValidationError) {
        return jsonResponse(
          {
            error: error.message,
            code: error.code,
            details: error.details,
          },
          { status: error.status },
        )
      }

      throw error
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/checkout/quote') {
    if (env.CHECKOUT_ENABLED !== 'true') {
      return jsonResponse(
        { error: 'Checkout quotation creation is not enabled in this environment.' },
        { status: 503 },
      )
    }

    const requestBody = await request.text()
    if (requestBody.length > 32_768) {
      return jsonResponse({ error: 'The checkout request is too large.' }, { status: 413 })
    }

    let payload
    try {
      payload = JSON.parse(requestBody)
    } catch {
      return jsonResponse({ error: 'The checkout request is invalid.' }, { status: 400 })
    }

    try {
      const products = await getProducts(env)
      const quotation = await createSandboxQuote({
        call: (model, method, body) => odooCall(env, model, method, body),
        payload,
        products,
      })
      const odooTransaction = await createSandboxPaymentTransaction({
        call: (model, method, body) => odooCall(env, model, method, body),
        quotation,
      })
      const payment = await createSandboxPaymentIntent({
        secretKey: env.STRIPE_SECRET_KEY,
        quotation,
        odooTransaction,
        email: payload?.customer?.email,
      })
      return jsonResponse({ ...quotation, payment })
    } catch (error) {
      if (
        error instanceof CheckoutValidationError
        || error instanceof OdooCheckoutError
        || error instanceof OdooPaymentError
        || error instanceof StripeCheckoutError
      ) {
        return jsonResponse(
          {
            error: error.message,
            code: error.code,
            details: error.details || [],
          },
          { status: error.status },
        )
      }

      throw error
    }
  }

  const productImageId = getProductImageId(url.pathname)
  if (request.method === 'GET' && productImageId) {
    return getProductImage(env, productImageId)
  }

  return jsonResponse({ error: 'API route not found.' }, { status: 404 })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApiRequest(request, env, url)
      } catch (error) {
        console.error('Storefront API error', error)
        const isConfigurationError = error.message?.includes('not configured')

        return jsonResponse(
          {
            error: isConfigurationError
              ? 'The store connection is not configured.'
              : 'The store is temporarily unavailable.',
          },
          { status: isConfigurationError ? 503 : 502 },
        )
      }
    }

    return env.ASSETS.fetch(request)
  },
}
