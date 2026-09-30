import { Buffer } from 'node:buffer'
import { cwd } from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { CheckoutValidationError, validateCartPricing } from './server/checkoutValidation.js'
import { createCheckoutQuote, OdooCheckoutError } from './server/odooCheckout.js'
import {
  completeCheckoutPaymentTransaction,
  createCheckoutPaymentTransaction,
  OdooPaymentError,
} from './server/odooPayment.js'
import {
  createCheckoutPaymentIntent,
  StripeCheckoutError,
  verifyCheckoutPaymentIntent,
} from './server/stripeCheckout.js'

function readJsonBody(request, maxLength = 32_768) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.setEncoding('utf8')
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > maxLength) reject(new Error('request_too_large'))
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('invalid_json'))
      }
    })
    request.on('error', reject)
  })
}

function sendJson(response, status, body) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(body))
}

function normalizeOdooUrl(value) {
  const url = new URL(value || 'https://lovelee.odoo.com')
  if (url.protocol !== 'https:') throw new Error('ODOO_URL must use HTTPS.')
  return url.origin
}

function createOdooCall(runtimeEnv) {
  return async function odooCall(model, method, body) {
    if (!runtimeEnv.ODOO_API_KEY) throw new Error('ODOO_API_KEY is not configured.')

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const headers = {
        Authorization: `bearer ${runtimeEnv.ODOO_API_KEY}`,
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'LoveLeeVA Local Checkout/1.0',
      }
      if (runtimeEnv.ODOO_DATABASE) headers['X-Odoo-Database'] = runtimeEnv.ODOO_DATABASE

      const response = await fetch(
        `${normalizeOdooUrl(runtimeEnv.ODOO_URL)}/json/2/${model}/${method}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        },
      )
      const responseBody = await response.text()

      if (response.status === 429 && attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1_250 * (attempt + 1)))
        continue
      }

      if (!response.ok) {
        console.error(`Odoo ${model}.${method} failed with HTTP ${response.status}.`)
        throw new Error(`Odoo returned HTTP ${response.status}: ${responseBody.slice(0, 500)}`)
      }

      return JSON.parse(responseBody)
    }

    throw new Error('Odoo rate limit retry failed.')
  }
}

async function getLiveCatalog() {
  const response = await fetch('https://loveleeva.com/api/products', {
    headers: { Accept: 'application/json' },
  })
  const catalog = await response.json()

  if (!response.ok || !Array.isArray(catalog?.products)) {
    throw new Error('catalog_unavailable')
  }

  return catalog
}

function versionLocalProductImages(catalog) {
  return {
    ...catalog,
    products: catalog.products.map((product) => ({
      ...product,
      imageUrl: product.imageUrl
        ? `${product.imageUrl.split('?')[0]}?v=1920-local`
        : null,
    })),
  }
}

function imageContentType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png'
  if (bytes.subarray(0, 4).toString('ascii') === 'RIFF'
    && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp'
  if (bytes.subarray(0, 3).toString('ascii') === 'GIF') return 'image/gif'

  return 'application/octet-stream'
}

function localCheckoutApi(runtimeEnv) {
  const odooCall = createOdooCall(runtimeEnv)
  const checkoutMode = runtimeEnv.CHECKOUT_MODE || 'sandbox'

  return {
    name: 'lovelee-local-checkout-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.method !== 'GET' || !runtimeEnv.ODOO_API_KEY) {
          next()
          return
        }

        const url = new URL(request.url, 'http://localhost')

        if (url.pathname === '/api/products') {
          try {
            sendJson(response, 200, versionLocalProductImages(await getLiveCatalog()))
          } catch (error) {
            console.error('Local Odoo catalog failed', error)
            sendJson(response, 502, { error: 'Live products are temporarily unavailable.' })
          }
          return
        }

        const imageMatch = url.pathname.match(/^\/api\/products\/(\d+)\/image$/)
        if (!imageMatch) {
          next()
          return
        }

        try {
          const productId = Number(imageMatch[1])
          const records = await odooCall('product.product', 'read', {
            ids: [productId],
            fields: ['active', 'sale_ok', 'type', 'image_1920'],
          })
          const product = records[0]
          const encodedImage = product?.image_1920

          if (!product?.active
            || !product.sale_ok
            || product.type === 'service'
            || typeof encodedImage !== 'string') {
            sendJson(response, 404, { error: 'Product image not found.' })
            return
          }

          const imageBytes = Buffer.from(encodedImage, 'base64')
          response.statusCode = 200
          response.setHeader('Content-Type', imageContentType(imageBytes))
          response.setHeader('Content-Length', String(imageBytes.length))
          response.setHeader('Cache-Control', 'no-store')
          response.setHeader('X-Content-Type-Options', 'nosniff')
          response.end(imageBytes)
        } catch (error) {
          console.error('Local Odoo product image failed', error)
          sendJson(response, 502, { error: 'The product image is temporarily unavailable.' })
        }
      })

      server.middlewares.use('/api/checkout/validate', async (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        try {
          const [payload, catalog] = await Promise.all([readJsonBody(request), getLiveCatalog()])

          sendJson(
            response,
            200,
            validateCartPricing(payload?.items, catalog.products, catalog.currency),
          )
        } catch (error) {
          if (error instanceof CheckoutValidationError) {
            sendJson(response, error.status, {
              error: error.message,
              code: error.code,
              details: error.details,
            })
            return
          }

          if (error.message === 'request_too_large') {
            sendJson(response, 413, { error: 'The checkout request is too large.' })
            return
          }

          if (error.message === 'invalid_json') {
            sendJson(response, 400, { error: 'The checkout request is invalid.' })
            return
          }

          sendJson(response, 502, {
            error: 'Live Odoo pricing is temporarily unavailable.',
          })
        }
      })

      server.middlewares.use('/api/checkout/quote', async (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        try {
          const [payload, catalog] = await Promise.all([readJsonBody(request), getLiveCatalog()])
          const quotation = await createCheckoutQuote({
            call: odooCall,
            payload,
            products: catalog.products,
            checkoutMode,
          })
          const odooTransaction = await createCheckoutPaymentTransaction({
            call: odooCall,
            quotation,
          })
          const payment = await createCheckoutPaymentIntent({
            secretKey: runtimeEnv.STRIPE_SECRET_KEY,
            quotation,
            odooTransaction,
            email: payload?.customer?.email,
          })
          sendJson(response, 200, { ...quotation, payment })
        } catch (error) {
          if (
            error instanceof CheckoutValidationError
            || error instanceof OdooCheckoutError
            || error instanceof OdooPaymentError
            || error instanceof StripeCheckoutError
          ) {
            sendJson(response, error.status, {
              error: error.message,
              code: error.code,
              details: error.details || [],
            })
            return
          }

          if (error.message === 'request_too_large') {
            sendJson(response, 413, { error: 'The checkout request is too large.' })
            return
          }

          if (error.message === 'invalid_json') {
            sendJson(response, 400, { error: 'The checkout request is invalid.' })
            return
          }

          console.error('Local Odoo quotation failed', error)
          sendJson(response, 502, {
            error: 'Odoo could not create the checkout quotation. No payment was attempted.',
          })
        }
      })

      server.middlewares.use('/api/checkout/complete', async (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        try {
          const payload = await readJsonBody(request, 4_096)
          const payment = await verifyCheckoutPaymentIntent({
            secretKey: runtimeEnv.STRIPE_SECRET_KEY,
            paymentIntentId: payload?.paymentIntentId,
            checkoutMode,
          })
          const order = await completeCheckoutPaymentTransaction({
            call: odooCall,
            payment,
          })
          sendJson(response, 200, order)
        } catch (error) {
          if (error instanceof OdooPaymentError || error instanceof StripeCheckoutError) {
            sendJson(response, error.status, {
              error: error.message,
              code: error.code,
            })
            return
          }

          if (error.message === 'request_too_large') {
            sendJson(response, 413, { error: 'The payment confirmation is too large.' })
            return
          }

          if (error.message === 'invalid_json') {
            sendJson(response, 400, { error: 'The payment confirmation is invalid.' })
            return
          }

          console.error('Local Odoo payment completion failed', error)
          sendJson(response, 502, {
            error: 'The payment was received, but the order confirmation is still processing.',
            code: 'payment_processing',
          })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const runtimeEnv = loadEnv(mode, cwd(), '')

  return {
    base: '/',
    plugins: [react(), localCheckoutApi(runtimeEnv)],
    server: {
      proxy: {
        '/api/products': {
          target: 'https://loveleeva.com',
          changeOrigin: true,
          secure: true,
        },
        '/api/checkout/config': {
          target: 'https://loveleeva.com',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
