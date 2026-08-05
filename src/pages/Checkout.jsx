import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCart } from '../lib/cartContext.js'
import { formatMoney } from '../lib/products.js'

export default function Checkout() {
  const { items, itemCount, subtotal } = useCart()
  const [billingMatchesShipping, setBillingMatchesShipping] = useState(true)
  const [previewStatus, setPreviewStatus] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setPreviewStatus(
      'Your checkout details are ready. Live UPS rates, AvaTax, and secure payment will activate when the Odoo connection is complete.',
    )
  }

  if (!items.length) {
    return (
      <>
        <section className="page-hero page-hero--checkout">
          <div className="page-hero__noise" aria-hidden="true" />
          <div className="page-hero__content">
            <p className="hero__eyebrow">Secure checkout</p>
            <h1 className="page-hero__headline">Checkout</h1>
          </div>
        </section>
        <section className="checkout-page">
          <div className="checkout-page__inner">
            <div className="commerce-empty">
              <span aria-hidden="true">✦</span>
              <p className="section-label">Your cart is empty</p>
              <h2>Add a handcrafted good before checking out.</h2>
              <Link to="/shop/" className="btn btn--primary">Browse the shop</Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="page-hero page-hero--checkout">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Secure checkout</p>
          <h1 className="page-hero__headline">Almost Yours</h1>
          <p className="page-hero__lede">
            Contact, delivery, and payment in one calm, straightforward flow.
          </p>
        </div>
      </section>

      <section className="checkout-page">
        <div className="checkout-page__inner checkout-page__layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-form__notice" role="note">
              <span>Preview mode</span>
              <p>No order or payment will be submitted while backend connections are pending.</p>
            </div>

            <fieldset className="checkout-section">
              <legend>
                <span>01</span>
                Contact
              </legend>
              <div className="checkout-form__row">
                <div className="contact-form__field">
                  <label htmlFor="checkout-first-name">First name</label>
                  <input id="checkout-first-name" name="firstName" autoComplete="given-name" required />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="checkout-last-name">Last name</label>
                  <input id="checkout-last-name" name="lastName" autoComplete="family-name" required />
                </div>
              </div>
              <div className="checkout-form__row">
                <div className="contact-form__field">
                  <label htmlFor="checkout-email">Email</label>
                  <input id="checkout-email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="checkout-phone">Phone</label>
                  <input id="checkout-phone" name="phone" type="tel" autoComplete="tel" required />
                </div>
              </div>
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>02</span>
                Delivery address
              </legend>
              <div className="contact-form__field">
                <label htmlFor="checkout-address">Street address</label>
                <input id="checkout-address" name="address" autoComplete="shipping street-address" required />
              </div>
              <div className="contact-form__field">
                <label htmlFor="checkout-address-two">Apartment, suite, etc. <span>(optional)</span></label>
                <input id="checkout-address-two" name="addressTwo" autoComplete="shipping address-line2" />
              </div>
              <div className="checkout-form__row checkout-form__row--address">
                <div className="contact-form__field">
                  <label htmlFor="checkout-city">City</label>
                  <input id="checkout-city" name="city" autoComplete="shipping address-level2" required />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="checkout-state">State</label>
                  <input id="checkout-state" name="state" autoComplete="shipping address-level1" required />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="checkout-postal">ZIP code</label>
                  <input id="checkout-postal" name="postalCode" autoComplete="shipping postal-code" required />
                </div>
              </div>
              <div className="contact-form__field">
                <label htmlFor="checkout-country">Country</label>
                <select id="checkout-country" name="country" defaultValue="US" autoComplete="shipping country" required>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="other">Other destination</option>
                </select>
              </div>
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>03</span>
                Shipping
              </legend>
              <div className="shipping-preview">
                <div className="shipping-preview__icon" aria-hidden="true">↗</div>
                <div>
                  <strong>Live UPS rates</strong>
                  <p>Available services and delivery estimates will appear after address validation.</p>
                </div>
                <span>Pending</span>
              </div>
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>04</span>
                Billing & payment
              </legend>
              <label className="checkout-check">
                <input
                  type="checkbox"
                  checked={billingMatchesShipping}
                  onChange={(event) => setBillingMatchesShipping(event.target.checked)}
                />
                <span>Billing address is the same as delivery address</span>
              </label>
              {!billingMatchesShipping ? (
                <div className="checkout-form__billing">
                  <div className="contact-form__field">
                    <label htmlFor="billing-address">Billing street address</label>
                    <input id="billing-address" name="billingAddress" autoComplete="billing street-address" required />
                  </div>
                  <div className="checkout-form__row checkout-form__row--address">
                    <div className="contact-form__field">
                      <label htmlFor="billing-city">City</label>
                      <input id="billing-city" name="billingCity" autoComplete="billing address-level2" required />
                    </div>
                    <div className="contact-form__field">
                      <label htmlFor="billing-state">State</label>
                      <input id="billing-state" name="billingState" autoComplete="billing address-level1" required />
                    </div>
                    <div className="contact-form__field">
                      <label htmlFor="billing-postal">ZIP code</label>
                      <input id="billing-postal" name="billingPostalCode" autoComplete="billing postal-code" required />
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="payment-preview" aria-label="Secure payment placeholder">
                <span aria-hidden="true">◈</span>
                <div>
                  <strong>Secure card payment</strong>
                  <p>Stripe Elements will load here after the server connection is enabled.</p>
                </div>
              </div>
            </fieldset>

            <button type="submit" className="btn btn--primary checkout-form__submit">
              Review checkout setup
            </button>
            {previewStatus ? (
              <p className="checkout-form__status" role="status">{previewStatus}</p>
            ) : null}
            <p className="form-privacy-note">
              By continuing, you acknowledge the{' '}
              <Link to="/privacy-policy/">Privacy Policy</Link> and{' '}
              <Link to="/terms/">Terms of Service</Link>.
            </p>
          </form>

          <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
            <p className="section-label">Your order</p>
            <h2 id="checkout-summary-title">
              {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
            </h2>
            <div className="checkout-summary__items">
              {items.map(({ product, quantity, lineTotal }) => (
                <div className="checkout-summary__item" key={product.id}>
                  <ProductVisual product={product} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>Qty {quantity}</span>
                  </div>
                  <span>{formatMoney(lineTotal)}</span>
                </div>
              ))}
            </div>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatMoney(subtotal)}</dd>
              </div>
              <div>
                <dt>UPS shipping</dt>
                <dd>Pending</dd>
              </div>
              <div>
                <dt>AvaTax</dt>
                <dd>Pending</dd>
              </div>
              <div className="checkout-summary__total">
                <dt>Current total</dt>
                <dd>{formatMoney(subtotal)}</dd>
              </div>
            </dl>
            <p>
              Your final total will be recalculated securely from Odoo before payment.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
