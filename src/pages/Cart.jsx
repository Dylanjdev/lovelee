import { Link } from 'react-router-dom'
import CartLineItem from '../components/CartLineItem.jsx'
import { useCart } from '../lib/cartContext.js'
import { formatMoney } from '../lib/products.js'

export default function Cart() {
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart()

  return (
    <>
      <section className="page-hero page-hero--cart">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Your selections</p>
          <h1 className="page-hero__headline">Shopping Cart</h1>
          <p className="page-hero__lede">
            Gathered with care. Review quantities before heading to checkout.
          </p>
        </div>
      </section>

      <section className="cart-page">
        <div className="cart-page__inner">
          {items.length ? (
            <div className="cart-page__layout">
              <div className="cart-page__main">
                <div className="cart-page__toolbar">
                  <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
                  <button type="button" onClick={clearCart}>Clear cart</button>
                </div>
                <div className="cart-page__items">
                  {items.map((item) => (
                    <CartLineItem
                      item={item}
                      key={item.productId}
                      onQuantityChange={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
                <Link to="/shop/" className="cart-page__continue">← Continue shopping</Link>
              </div>

              <aside className="order-summary" aria-labelledby="cart-summary-title">
                <p className="section-label">Order overview</p>
                <h2 id="cart-summary-title">Summary</h2>
                <dl>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatMoney(subtotal)}</dd>
                  </div>
                  <div>
                    <dt>UPS shipping</dt>
                    <dd>At checkout</dd>
                  </div>
                  <div>
                    <dt>Sales tax</dt>
                    <dd>At checkout</dd>
                  </div>
                  <div className="order-summary__total">
                    <dt>Current total</dt>
                    <dd>{formatMoney(subtotal)}</dd>
                  </div>
                </dl>
                <Link to="/checkout/" className="btn btn--primary">Continue to checkout</Link>
                <p className="order-summary__note">
                  Live UPS and AvaTax totals will replace these placeholders when the
                  secure Odoo connection is enabled.
                </p>
              </aside>
            </div>
          ) : (
            <div className="commerce-empty">
              <span aria-hidden="true">✦</span>
              <p className="section-label">Nothing here yet</p>
              <h2>Your cart is ready for a local find.</h2>
              <p>Browse the preview collection and choose something made with intention.</p>
              <Link to="/shop/" className="btn btn--primary">Shop the collection</Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
