import { useEffect, useMemo, useReducer, useRef } from 'react'
import { CartContext } from '../lib/cartContext.js'
import { useCatalog } from '../lib/catalogContext.js'

const storageKey = 'loveleeva-cart-v2'

const initialState = {
  items: [],
  isReady: false,
}

function clampQuantity(product, quantity) {
  const numericQuantity = Number(quantity)
  if (!Number.isFinite(numericQuantity)) return 1
  return Math.max(1, Math.min(Math.floor(numericQuantity), product.inventoryCount))
}

function cartReducer(state, action) {
  if (action.type === 'hydrate') {
    return {
      items: action.items,
      isReady: true,
    }
  }

  if (action.type === 'add') {
    const product = action.product
    if (!product) return state

    const existingItem = state.items.find((item) => item.productId === product.id)
    if (existingItem) {
      return {
        ...state,
        items: state.items.map((item) => (
          item.productId === product.id
            ? {
                ...item,
                quantity: clampQuantity(product, item.quantity + (action.quantity ?? 1)),
              }
            : item
        )),
      }
    }

    return {
      ...state,
      items: [
        ...state.items,
        {
          productId: product.id,
          quantity: clampQuantity(product, action.quantity ?? 1),
        },
      ],
    }
  }

  if (action.type === 'update') {
    const product = action.product
    if (!product) return state

    if (Number(action.quantity) <= 0) {
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.productId),
      }
    }

    return {
      ...state,
      items: state.items.map((item) => (
        item.productId === action.productId
          ? { ...item, quantity: clampQuantity(product, action.quantity) }
          : item
      )),
    }
  }

  if (action.type === 'remove') {
    return {
      ...state,
      items: state.items.filter((item) => item.productId !== action.productId),
    }
  }

  if (action.type === 'clear') {
    return {
      ...state,
      items: [],
    }
  }

  return state
}

function readStoredCart(getProductById) {
  try {
    const storedCart = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(storedCart)) return []

    return storedCart.flatMap((item) => {
      const product = getProductById(item?.productId)
      if (!product) return []

      return [{
        productId: product.id,
        quantity: clampQuantity(product, item.quantity),
      }]
    })
  } catch {
    return []
  }
}

export default function CartProvider({ children }) {
  const { getProductById, status: catalogStatus } = useCatalog()
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const hasHydrated = useRef(false)

  useEffect(() => {
    if (catalogStatus !== 'ready' || hasHydrated.current) return

    hasHydrated.current = true
    dispatch({ type: 'hydrate', items: readStoredCart(getProductById) })
  }, [catalogStatus, getProductById])

  useEffect(() => {
    if (!state.isReady) return
    window.localStorage.setItem(storageKey, JSON.stringify(state.items))
  }, [state.isReady, state.items])

  const value = useMemo(() => {
    const lineItems = state.items.flatMap((item) => {
      const product = getProductById(item.productId)
      if (!product) return []

      return [{
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      }]
    })

    return {
      items: lineItems,
      isReady: state.isReady,
      itemCount: lineItems.reduce((total, item) => total + item.quantity, 0),
      subtotal: lineItems.reduce((total, item) => total + item.lineTotal, 0),
      addItem(productId, quantity = 1) {
        dispatch({
          type: 'add',
          product: getProductById(productId),
          productId: String(productId),
          quantity,
        })
      },
      updateQuantity(productId, quantity) {
        dispatch({
          type: 'update',
          product: getProductById(productId),
          productId: String(productId),
          quantity,
        })
      },
      removeItem(productId) {
        dispatch({ type: 'remove', productId })
      },
      clearCart() {
        dispatch({ type: 'clear' })
      },
      getItemQuantity(productId) {
        return lineItems.find((item) => item.productId === productId)?.quantity ?? 0
      },
    }
  }, [getProductById, state.isReady, state.items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
