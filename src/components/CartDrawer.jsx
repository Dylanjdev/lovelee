import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import CartLineItem from './CartLineItem.jsx'
import { useCart } from '../lib/cartContext.js'
import { formatMoney } from '../lib/products.js'

export default function CartDrawer({ isOpen, onClose, triggerRef }) {
  const closeButtonRef = useRef(null)
  const drawerRef = useRef(null)
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart()

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const trigger = triggerRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusableElements = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])',
      )
      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      trigger?.focus()
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  return (
    <div className="cart-drawer" role="presentation" onMouseDown={onClose}>
      <aside
        ref={drawerRef}
        className="cart-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="cart-drawer__header">
          <div>
            <p className="section-label">Your basket</p>
            <h2 id="cart-drawer-title">
              {itemCount ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : 'Cart is empty'}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="cart-drawer__close"
            aria-label="Close shopping cart"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {items.length ? (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <CartLineItem
                  compact
                  item={item}
                  key={item.productId}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              <p>UPS shipping and destination tax are calculated during checkout.</p>
              <Link to="/checkout/" className="btn btn--primary" onClick={onClose}>
                Checkout
              </Link>
              <Link to="/cart/" className="cart-drawer__view-cart" onClick={onClose}>
                View and edit cart
              </Link>
            </div>
          </>
        ) : (
          <div className="cart-drawer__empty">
            <span aria-hidden="true">✦</span>
            <h3>Room for something made with care.</h3>
            <p>Explore handcrafted goods and add a little Lee County to your day.</p>
            <Link to="/shop/" className="btn btn--primary" onClick={onClose}>
              Browse the shop
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
