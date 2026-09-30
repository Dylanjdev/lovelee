import assert from 'node:assert/strict'
import test from 'node:test'
import { isRandomizedScraperProduct } from './products.js'

test('identifies only the randomized seven-dollar scraper product', () => {
  assert.equal(isRandomizedScraperProduct({ name: 'Board Scraper', price: 7 }), true)
  assert.equal(isRandomizedScraperProduct({ name: 'Board Scarper', price: 7 }), true)
  assert.equal(isRandomizedScraperProduct({ name: 'Board Scraper', price: 8 }), false)
  assert.equal(isRandomizedScraperProduct({ name: 'Cherry Pipe', price: 7 }), false)
})
