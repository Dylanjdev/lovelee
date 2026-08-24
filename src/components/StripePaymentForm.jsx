import { useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { formatMoney } from '../lib/products.js'

const stripePromises = new Map()

function stripeForPayment(payment) {
  const publishableKey = payment?.publishableKey
  if (!/^pk_(test|live)_/.test(publishableKey || '')) return null

  if (!stripePromises.has(publishableKey)) {
    stripePromises.set(publishableKey, loadStripe(publishableKey))
  }

  return stripePromises.get(publishableKey)
}

const appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#294237',
    colorBackground: '#fffdf7',
    colorText: '#26332d',
    colorDanger: '#a65325',
    borderRadius: '4px',
    fontFamily: 'system-ui, sans-serif',
  },
}

function CheckoutPaymentElement({ payment, onPaymentPending }) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState({ state: 'idle', message: '', order: null })

  async function handlePayment() {
    if (!stripe || !elements || status.state === 'processing') return

    setStatus({ state: 'processing', message: 'Processing your secure payment…', order: null })
    const { error: validationError } = await elements.submit()

    if (validationError) {
      setStatus({
        state: 'error',
        message: validationError.message || 'Review your card details and try again.',
        order: null,
      })
      return
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: payment.clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/?stripe_return=1`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setStatus({
        state: 'error',
        message: error.message || 'We could not complete your payment. Please try again.',
        order: null,
      })
      return
    }

    if (['succeeded', 'processing'].includes(paymentIntent?.status)) {
      setStatus({
        state: 'processing',
        message: 'Payment received. We are confirming your order…',
        order: null,
      })
      onPaymentPending(paymentIntent.id)
      return
    }

    setStatus({
      state: 'error',
      message: 'Stripe could not finish the payment. Please review your details and try again.',
      order: null,
    })
  }

  return (
    <div className="stripe-test-payment">
      <div className="stripe-test-payment__header">
        <div>
          <p className="section-label">Secure card payment</p>
          <strong>{formatMoney(payment.amount / 100, payment.currency)} due</strong>
        </div>
        <span>Encrypted</span>
      </div>
      <PaymentElement options={{ layout: 'tabs' }} />
      <p className="stripe-test-payment__hint">
        Card details are encrypted and handled securely by Stripe.
      </p>
      <button
        type="button"
        className="btn btn--primary stripe-test-payment__submit"
        onClick={handlePayment}
        disabled={
          !stripe
          || !elements
          || status.state === 'processing'
          || status.state === 'success'
        }
      >
        {status.state === 'processing'
          ? 'Processing payment…'
          : status.state === 'success'
            ? 'Payment complete'
            : `Pay ${formatMoney(payment.amount / 100, payment.currency)} securely`}
      </button>
      {status.message ? (
        <p
          className={`checkout-form__status checkout-form__status--${status.state}`}
          role={status.state === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </p>
      ) : null}
      {status.state === 'success'
      && ['invited', 'available'].includes(status.order?.portal?.status)
      && status.order.portal.url ? (
        <div className="stripe-test-payment__next">
          <p>
            {status.order.portal.status === 'invited'
              ? 'Check your email to finish setting up your order-history account.'
              : 'Sign in anytime to review your confirmed orders and delivery updates.'}
          </p>
          <a className="btn btn--ghost" href={status.order.portal.url}>View my orders</a>
        </div>
      ) : null}
    </div>
  )
}

export default function StripePaymentForm({ payment, onPaymentPending }) {
  const stripePromise = stripeForPayment(payment)

  if (!stripePromise) {
    return (
      <p className="checkout-form__status checkout-form__status--error" role="alert">
        Secure payment is temporarily unavailable. Please try again shortly.
      </p>
    )
  }

  return (
    <Elements
      key={payment.paymentIntentId}
      stripe={stripePromise}
      options={{
        clientSecret: payment.clientSecret,
        appearance,
      }}
    >
      <CheckoutPaymentElement payment={payment} onPaymentPending={onPaymentPending} />
    </Elements>
  )
}
