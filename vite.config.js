import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { CheckoutValidationError, validateCartPricing } from './server/checkoutValidation.js'

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.setEncoding('utf8')
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 16_384) reject(new Error('request_too_large'))
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

function localCheckoutValidation() {
  return {
    name: 'lovelee-local-checkout-validation',
    configureServer(server) {
      server.middlewares.use('/api/checkout/validate', async (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        try {
          const [payload, catalogResponse] = await Promise.all([
            readJsonBody(request),
            fetch('https://loveleeva.com/api/products', {
              headers: { Accept: 'application/json' },
            }),
          ])
          const catalog = await catalogResponse.json()

          if (!catalogResponse.ok || !Array.isArray(catalog?.products)) {
            throw new Error('catalog_unavailable')
          }

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
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), localCheckoutValidation()],
  server: {
    proxy: {
      '/api/products': {
        target: 'https://loveleeva.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
