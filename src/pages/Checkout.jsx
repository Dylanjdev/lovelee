import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual.jsx'
import StripePaymentForm from '../components/StripePaymentForm.jsx'
import { useCart } from '../lib/cartContext.js'
import { useCatalog } from '../lib/catalogContext.js'
import {
  completeCheckoutOrder,
  forgetPendingCheckoutPayment,
  readPendingCheckoutPayment,
  rememberPendingCheckoutPayment,
} from '../lib/checkoutCompletion.js'
import { formatMoney } from '../lib/products.js'

const customerSafeErrorCodes = new Set([
  'invalid_address',
  'invalid_cart',
  'invalid_customer',
  'cart_changed',
])

const quoteFieldNames = new Set([
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'addressTwo',
  'city',
  'state',
  'postalCode',
  'country',
])

const requiredQuoteFieldNames = [...quoteFieldNames].filter((name) => name !== 'addressTwo')
const automaticQuoteDelay = 1_000

export default function Checkout() {
  const { products } = useCatalog()
  const { items, itemCount, subtotal, addItem, clearCart } = useCart()
  const [billingMatchesShipping, setBillingMatchesShipping] = useState(true)
  const [scraperUpsellDismissed, setScraperUpsellDismissed] = useState(false)
  const [pricingTest, setPricingTest] = useState({
    status: 'idle',
    message: '',
    result: null,
  })
  const [countries, setCountries] = useState([
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
  ])
  const [completedOrder, setCompletedOrder] = useState(null)
  const [returnPayment, setReturnPayment] = useState({
    paymentIntentId: '',
    status: 'idle',
    message: '',
  })
  const checkoutFormRef = useRef(null)
  const automaticQuoteTimerRef = useRef(null)
  const quoteRequestIdRef = useRef(0)
  const scraperUpsellButtonRef = useRef(null)

  const scraperUpsellProduct = products.find((product) => (
    Math.abs(product.price - 7) < 0.001
    && /(?:scraper|scarper)/i.test(product.name)
  ))
  const cartHasScraper = items.some((item) => item.product.id === scraperUpsellProduct?.id)
  const showScraperUpsell = Boolean(
    !scraperUpsellDismissed
    && scraperUpsellProduct?.inventoryCount > 0
    && items.length
    && !cartHasScraper
    && !completedOrder
    && returnPayment.status === 'idle',
  )

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

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const returnedPaymentIntentId = search.get('stripe_return') === '1'
      ? search.get('payment_intent')
      : ''
    const paymentIntentId = returnedPaymentIntentId || readPendingCheckoutPayment()

    if (returnedPaymentIntentId) {
      window.history.replaceState({}, '', '/checkout/')
    }

    if (!paymentIntentId) return undefined

    rememberPendingCheckoutPayment(paymentIntentId)
    const timeoutId = window.setTimeout(() => {
      setReturnPayment({
        paymentIntentId,
        status: 'processing',
        message: 'Your payment was received. We are confirming your order…',
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (!returnPayment.paymentIntentId || returnPayment.status !== 'processing') return undefined

    const controller = new AbortController()

    completeCheckoutOrder(returnPayment.paymentIntentId, { signal: controller.signal })
      .then((order) => {
        forgetPendingCheckoutPayment()
        setCompletedOrder(order)
        clearCart()
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        setReturnPayment({
          paymentIntentId: returnPayment.paymentIntentId,
          status: 'error',
          message: error.message || 'Your payment is taking longer than expected to confirm.',
        })
      })

    return () => controller.abort()
  }, [clearCart, returnPayment.paymentIntentId, returnPayment.status])

  useEffect(() => () => {
    window.clearTimeout(automaticQuoteTimerRef.current)
    quoteRequestIdRef.current += 1
  }, [])

  useEffect(() => {
    if (!showScraperUpsell) return undefined

    const previouslyFocusedElement = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    scraperUpsellButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') setScraperUpsellDismissed(true)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocusedElement?.focus?.()
    }
  }, [showScraperUpsell])

  function quoteFieldsAreReady(form) {
    return requiredQuoteFieldNames.every((name) => {
      const field = form.elements.namedItem(name)
      return field && String(field.value).trim() && field.checkValidity()
    })
  }

  async function calculateQuote(form) {
    const requestId = quoteRequestIdRef.current + 1
    quoteRequestIdRef.current = requestId
    const formData = new FormData(form)
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

      if (requestId !== quoteRequestIdRef.current) return

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
      if (requestId !== quoteRequestIdRef.current) return

      setPricingTest({
        status: 'error',
        message: error.message || 'We could not calculate your order total. Please try again.',
        result: null,
      })
    }
  }

  function scheduleAutomaticQuote(event) {
    if (!quoteFieldNames.has(event.target.name)) return

    const form = event.currentTarget
    window.clearTimeout(automaticQuoteTimerRef.current)
    quoteRequestIdRef.current += 1
    setPricingTest({ status: 'idle', message: '', result: null })

    if (!quoteFieldsAreReady(form)) return

    automaticQuoteTimerRef.current = window.setTimeout(() => {
      calculateQuote(form)
    }, automaticQuoteDelay)
  }

  function handleSubmit(event) {
    event.preventDefault()
    window.clearTimeout(automaticQuoteTimerRef.current)
    quoteRequestIdRef.current += 1

    if (!quoteFieldsAreReady(event.currentTarget)) {
      event.currentTarget.reportValidity()
      return
    }

    calculateQuote(event.currentTarget)
  }

  function retryAutomaticQuote() {
    const form = checkoutFormRef.current
    if (!form || !quoteFieldsAreReady(form)) {
      form?.reportValidity()
      return
    }
    calculateQuote(form)
  }

  function handlePaymentPending(paymentIntentId) {
    rememberPendingCheckoutPayment(paymentIntentId)
    setReturnPayment({
      paymentIntentId,
      status: 'processing',
      message: 'Payment received. We are confirming your order…',
    })
  }

  function addRandomizedScraper() {
    if (!scraperUpsellProduct) return

    addItem(scraperUpsellProduct.id)
    setScraperUpsellDismissed(true)
  }

  function retryReturnedPayment() {
    if (!returnPayment.paymentIntentId) return

    setReturnPayment((current) => ({
      ...current,
      status: 'processing',
      message: 'Checking your confirmed payment…',
    }))
  }

  const verifiedSubtotal = pricingTest.result?.subtotal ?? subtotal
  const shippingTotal = pricingTest.result?.shipping ?? null
  const taxTotal = pricingTest.result?.tax ?? null
  const verifiedTotal = pricingTest.result?.total ?? verifiedSubtotal

  if (completedOrder) {
    return (
      <>
        <section className="page-hero page-hero--checkout">
          <div className="page-hero__noise" aria-hidden="true" />
          <div className="page-hero__content">
            <p className="hero__eyebrow">Order confirmed</p>
            <h1 className="page-hero__headline">Thank You</h1>
          </div>
        </section>
        <section className="checkout-page">
          <div className="checkout-page__inner">
            <div className="order-confirmation">
              <span className="order-confirmation__mark" aria-hidden="true">✓</span>
              <p className="section-label">Payment approved</p>
              <h2>Your order {completedOrder.reference} is confirmed.</h2>
              <p>
                We sent the confirmation to your email. LoveLeeVA will prepare your
                handcrafted goods and send delivery updates as they become available.
              </p>
              <dl>
                <div>
                  <dt>Order</dt>
                  <dd>{completedOrder.reference}</dd>
                </div>
                <div>
                  <dt>Total paid</dt>
                  <dd>{formatMoney(completedOrder.total, completedOrder.currency)}</dd>
                </div>
              </dl>
              <div className="order-confirmation__actions">
                {['invited', 'available'].includes(completedOrder.portal?.status) ? (
                  <a className="btn btn--primary" href={completedOrder.portal.url}>View my orders</a>
                ) : null}
                <Link className="btn btn--ghost" to="/shop/">Continue shopping</Link>
              </div>
              {completedOrder.portal?.status === 'invited' ? (
                <small>Check your email to finish setting up your order-history account.</small>
              ) : null}
            </div>
          </div>
        </section>
      </>
    )
  }

  if (returnPayment.status !== 'idle') {
    return (
      <>
        <section className="page-hero page-hero--checkout">
          <div className="page-hero__noise" aria-hidden="true" />
          <div className="page-hero__content">
            <p className="hero__eyebrow">Secure checkout</p>
            <h1 className="page-hero__headline">Confirming Payment</h1>
          </div>
        </section>
        <section className="checkout-page">
          <div className="checkout-page__inner">
            <div className="order-confirmation">
              <span className="order-confirmation__mark" aria-hidden="true">
                {returnPayment.status === 'processing' ? '…' : '!'}
              </span>
              <p className="section-label">Payment received</p>
              <h2>{returnPayment.message}</h2>
              <p>Do not submit another payment while we finish checking this order.</p>
              {returnPayment.status === 'error' ? (
                <button type="button" className="btn btn--primary" onClick={retryReturnedPayment}>
                  Check order again
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </>
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
      {showScraperUpsell ? (
        <div className="checkout-upsell" role="presentation">
          <div
            className="checkout-upsell__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="scraper-upsell-title"
            aria-describedby="scraper-upsell-description"
          >
            <button
              type="button"
              className="checkout-upsell__close"
              aria-label="No thanks, close scraper offer"
              onClick={() => setScraperUpsellDismissed(true)}
            >
              ×
            </button>
            <ProductVisual
              product={scraperUpsellProduct}
              className="checkout-upsell__visual"
              eager
            />
            <div className="checkout-upsell__content">
              <p className="section-label">A little something extra</p>
              <h2 id="scraper-upsell-title">Do you want a randomized scraper for $7?</h2>
              <p id="scraper-upsell-description">
                Add one handmade scraper, selected at random from the available batch,
                to your order.
              </p>
              <div className="checkout-upsell__actions">
                <button
                  ref={scraperUpsellButtonRef}
                  type="button"
                  className="btn btn--primary"
                  onClick={addRandomizedScraper}
                >
                  Yes, add one — $7
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setScraperUpsellDismissed(true)}
                >
                  No thanks
                </button>
              </div>
              <small>Only one will be added. Shipping and tax update automatically.</small>
            </div>
          </div>
        </div>
      ) : null}
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
          <form
            className="checkout-form"
            ref={checkoutFormRef}
            onSubmit={handleSubmit}
            onChange={scheduleAutomaticQuote}
          >
            <div className="checkout-form__notice" role="note">
              <span>Secure</span>
              <p>
                {pricingTest.result
                  ? 'Your final total is ready. Complete secure payment below.'
                  : pricingTest.status === 'loading'
                    ? 'Calculating shipping, sales tax, and your final total…'
                    : 'Complete your delivery details and your final total will calculate automatically.'}
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
              <div
                className={`shipping-preview${pricingTest.result ? ' shipping-preview--verified' : ''}${pricingTest.status === 'loading' ? ' shipping-preview--loading' : ''}`}
                role="status"
                aria-live="polite"
              >
                <div className="shipping-preview__icon" aria-hidden="true">
                  {pricingTest.status === 'loading' ? <span className="shipping-preview__spinner" /> : pricingTest.result ? '✓' : '↗'}
                </div>
                <div>
                  <strong>{pricingTest.status === 'loading' ? 'Calculating delivery' : 'Live UPS rates'}</strong>
                  <p>
                    {pricingTest.status === 'loading'
                      ? 'Checking available service and destination sales tax.'
                      : pricingTest.result
                        ? `${pricingTest.result.carrier.name} · ${formatMoney(pricingTest.result.shipping, pricingTest.result.currency)}`
                        : 'Your rate appears automatically when the address is complete.'}
                  </p>
                </div>
                <span>
                  {pricingTest.status === 'loading'
                    ? 'Calculating'
                    : pricingTest.result
                      ? 'Ready'
                      : 'Automatic'}
                </span>
              </div>
              {pricingTest.status === 'error' && pricingTest.message ? (
                <>
                  <p
                    className={`checkout-form__status checkout-form__status--${pricingTest.status}`}
                    role="alert"
                  >
                    {pricingTest.message}
                  </p>
                  <button
                    type="button"
                    className="btn btn--ghost checkout-form__submit"
                    onClick={retryAutomaticQuote}
                  >
                    Try calculation again
                  </button>
                </>
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
                <StripePaymentForm
                  payment={pricingTest.result.payment}
                  onPaymentPending={handlePaymentPending}
                />
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
