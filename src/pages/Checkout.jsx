import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual.jsx'
import StripePaymentForm from '../components/StripePaymentForm.jsx'
import { useCart } from '../lib/cartContext.js'
import { formatMoney } from '../lib/products.js'

const customerSafeErrorCodes = new Set([
  'invalid_address',
  'invalid_cart',
  'invalid_customer',
  'cart_changed',
])

export default function Checkout() {
  const { items, itemCount, subtotal } = useCart()
  const [billingMatchesShipping, setBillingMatchesShipping] = useState(true)
  const [pricingTest, setPricingTest] = useState({
    status: 'idle',
    message: '',
    result: null,
  })
  const [countries, setCountries] = useState([
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
  ])

  useEffect(() => {
    let isActive = true

    fetch('/api/checkout/config', { headers: { Accept: 'application/json' } })
      .then((response) => response.json())
      .then((payload) => {
        if (isActive && Array.isArray(payload?.countries) && payload.countries.length) {
          setCountries(payload.countries)
        }
      })
      .catch(() => {})

    return () => {
      isActive = false
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setPricingTest({
      status: 'loading',
      message: 'Calculating shipping and sales tax…',
      result: null,
    })

    try {
      const response = await fetch('/api/checkout/quote', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
            unitPrice: product.price,
          })),
          customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
          },
          shippingAddress: {
            street: formData.get('address'),
            street2: formData.get('addressTwo'),
            city: formData.get('city'),
            state: formData.get('state'),
            postalCode: formData.get('postalCode'),
            countryCode: formData.get('country'),
          },
        }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok || !payload) {
        throw new Error(
          customerSafeErrorCodes.has(payload?.code)
            ? payload.error
            : 'We could not calculate your order total. Please check your delivery address and try again.',
        )
      }

      setPricingTest({
        status: 'success',
        message: `Shipping and sales tax are calculated. Your order total is ${formatMoney(payload.total, payload.currency)}.`,
        result: payload,
      })
    } catch (error) {
      setPricingTest({
        status: 'error',
        message: error.message || 'We could not calculate your order total. Please try again.',
        result: null,
      })
    }
  }

  const verifiedSubtotal = pricingTest.result?.subtotal ?? subtotal
  const shippingTotal = pricingTest.result?.shipping ?? null
  const taxTotal = pricingTest.result?.tax ?? null
  const verifiedTotal = pricingTest.result?.total ?? verifiedSubtotal

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
        <div className="checkout-page__inner">
          <ol className="checkout-progress" aria-label="Checkout progress">
            <li className="checkout-progress__step checkout-progress__step--active">
              <span>1</span>
              <div>
                <strong>Your details</strong>
                <small>Contact & delivery</small>
              </div>
            </li>
            <li className={pricingTest.result ? 'checkout-progress__step checkout-progress__step--complete' : 'checkout-progress__step'}>
              <span>{pricingTest.result ? '✓' : '2'}</span>
              <div>
                <strong>Shipping & tax</strong>
                <small>Real-time rates</small>
              </div>
            </li>
            <li className={pricingTest.result ? 'checkout-progress__step checkout-progress__step--active' : 'checkout-progress__step'}>
              <span>3</span>
              <div>
                <strong>Secure payment</strong>
                <small>Encrypted card payment</small>
              </div>
            </li>
          </ol>

          <div className="checkout-page__layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-form__notice" role="note">
              <span>Secure</span>
              <p>
                {pricingTest.result
                  ? 'Your final total is ready. Complete secure payment below.'
                  : 'Complete your delivery details to calculate shipping, sales tax, and your final total.'}
              </p>
            </div>

            <fieldset className="checkout-section">
              <legend>
                <span>01</span>
                <span className="checkout-section__title">
                  Contact
                  <small>For order updates and delivery questions</small>
                </span>
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
                <span className="checkout-section__title">
                  Delivery address
                  <small>Used for UPS rates and destination tax</small>
                </span>
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
                  {countries.map((country) => (
                    <option value={country.code} key={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>03</span>
                <span className="checkout-section__title">
                  Shipping & tax
                  <small>Calculated from your delivery address</small>
                </span>
              </legend>
              <div className={`shipping-preview${pricingTest.result ? ' shipping-preview--verified' : ''}`}>
                <div className="shipping-preview__icon" aria-hidden="true">↗</div>
                <div>
                  <strong>Live UPS rates</strong>
                  <p>
                    {pricingTest.result
                      ? `${pricingTest.result.carrier.name} · ${formatMoney(pricingTest.result.shipping, pricingTest.result.currency)}`
                      : 'Enter a complete address to calculate available UPS delivery.'}
                  </p>
                </div>
                <span>{pricingTest.result ? 'Ready' : 'Calculated next'}</span>
              </div>
              <button
                type="submit"
                className={`btn checkout-form__submit${pricingTest.result ? ' btn--ghost' : ' btn--primary'}`}
                disabled={pricingTest.status === 'loading'}
              >
                {pricingTest.status === 'loading'
                  ? 'Getting final total…'
                  : pricingTest.result
                    ? 'Refresh shipping & tax'
                    : 'Calculate shipping & tax'}
              </button>
              {pricingTest.message ? (
                <p
                  className={`checkout-form__status checkout-form__status--${pricingTest.status}`}
                  role={pricingTest.status === 'error' ? 'alert' : 'status'}
                >
                  {pricingTest.message}
                </p>
              ) : null}
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>04</span>
                <span className="checkout-section__title">
                  Billing & payment
                  <small>Your card information is encrypted and protected</small>
                </span>
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
              <div className={`payment-preview${pricingTest.result ? ' payment-preview--ready' : ''}`} aria-label="Secure payment status">
                <span aria-hidden="true">◈</span>
                <div>
                  <strong>Secure card payment</strong>
                  <p>
                    {pricingTest.result
                      ? 'Your final total is ready. Enter your payment details below.'
                      : 'Calculate shipping and sales tax to unlock secure payment.'}
                  </p>
                </div>
              </div>
              {pricingTest.result?.payment ? (
                <StripePaymentForm payment={pricingTest.result.payment} />
              ) : null}
            </fieldset>
            <p className="form-privacy-note">
              By continuing, you acknowledge the{' '}
              <Link to="/privacy-policy/">Privacy Policy</Link> and{' '}
              <Link to="/terms/">Terms of Service</Link>.
            </p>
          </form>

          <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
            <div className="checkout-summary__header">
              <div>
                <p className="section-label">Your order</p>
                <h2 id="checkout-summary-title">
                  {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
                </h2>
              </div>
              <span>{pricingTest.result ? 'Ready to pay' : 'Estimate'}</span>
            </div>
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
                <dd>{formatMoney(verifiedSubtotal)}</dd>
              </div>
              <div>
                <dt>UPS shipping</dt>
                <dd>{shippingTotal === null ? 'Pending' : formatMoney(shippingTotal, pricingTest.result.currency)}</dd>
              </div>
              <div>
                <dt>Sales tax</dt>
                <dd>{taxTotal === null ? 'Pending' : formatMoney(taxTotal, pricingTest.result.currency)}</dd>
              </div>
              <div className="checkout-summary__total">
                <dt>{pricingTest.result ? 'Order total' : 'Estimated total'}</dt>
                <dd>{formatMoney(verifiedTotal, pricingTest.result?.currency)}</dd>
              </div>
            </dl>
            <p>
              {pricingTest.result
                ? 'UPS delivery and destination sales tax are included in the total above.'
                : 'Shipping and sales tax are calculated from your delivery address.'}
            </p>
            <div className="checkout-summary__trust" aria-label="Checkout services">
              <span>Secure checkout</span>
              <span>UPS delivery</span>
              <span>Tax at checkout</span>
              <span>Encrypted payment</span>
            </div>
          </aside>
          </div>
        </div>
      </section>
    </>
  )
}
