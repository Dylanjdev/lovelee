import { useCallback, useEffect, useMemo, useState } from 'react'
import { CatalogContext } from '../lib/catalogContext.js'
import { createProductCategories, normalizeStoreProduct } from '../lib/products.js'

export default function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState({
    products: [],
    currency: 'USD',
    status: 'loading',
    error: '',
  })
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCatalog() {
      setCatalog((current) => ({ ...current, status: 'loading', error: '' }))

      try {
        const response = await fetch('/api/products', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        const payload = await response.json().catch(() => null)

        if (!response.ok || !Array.isArray(payload?.products)) {
          throw new Error(payload?.error || 'The product catalog could not be loaded.')
        }

        setCatalog({
          products: payload.products.map(normalizeStoreProduct),
          currency: payload.currency || 'USD',
          status: 'ready',
          error: '',
        })
      } catch (error) {
        if (error.name === 'AbortError') return

        setCatalog((current) => ({
          ...current,
          status: 'error',
          error: 'Live products are temporarily unavailable. Please try again.',
        }))
      }
    }

    loadCatalog()
    return () => controller.abort()
  }, [requestVersion])

  const getProductById = useCallback(
    (productId) => catalog.products.find((product) => product.id === String(productId)),
    [catalog.products],
  )

  const value = useMemo(() => ({
    ...catalog,
    categories: createProductCategories(catalog.products),
    getProductById,
    refreshCatalog() {
      setRequestVersion((version) => version + 1)
    },
  }), [catalog, getProductById])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
