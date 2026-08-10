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

function decodeBase64(value) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function detectImageType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'image/png'
  if (bytes[0] === 0x47 && bytes[1] === 0x49) return 'image/gif'
  if (
    bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
  ) return 'image/webp'

  return 'application/octet-stream'
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
  return new Response(bytes, {
    headers: {
      'Content-Type': detectImageType(bytes),
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
