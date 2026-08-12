import { useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { formatMoney } from '../lib/products.js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey?.startsWith('pk_test_')
  ? loadStripe(publishableKey)
  : null

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

const completionAttempts = 8
const completionRetryDelay = 1_000

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

function TestPaymentElement({ payment }) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState({ state: 'idle', message: '', order: null })

  async function completeOrder(paymentIntentId) {
    for (let attempt = 0; attempt < completionAttempts; attempt += 1) {
      const response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      })
      const payload = await response.json().catch(() => null)

      if (response.ok && payload?.reference) return payload

      if (payload?.code === 'payment_processing' && attempt < completionAttempts - 1) {
        await wait(completionRetryDelay)
        continue
      }

      throw new Error(
        payload?.error
        || 'Your payment was received, but the order confirmation is still processing.',
      )
    }

    throw new Error('Your payment was received, but the order confirmation is still processing.')
  }

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

    if (paymentIntent?.status === 'succeeded') {
      try {
        const order = await completeOrder(paymentIntent.id)
        setStatus({
          state: 'success',
          message: `Payment approved. Order ${order.reference} is confirmed.`,
          order,
        })
      } catch (completionError) {
        setStatus({
          state: 'processing',
          message: completionError.message,
          order: null,
        })
      }
      return
    }

    setStatus({
      state: 'success',
      message: paymentIntent?.status === 'processing'
        ? 'Your payment is processing. We will confirm your order as soon as it is complete.'
        : 'Your payment was received and is being finalized.',
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

export default function StripePaymentForm({ payment }) {
  if (!stripePromise) {
    return (
      <p className="checkout-form__status checkout-form__status--error" role="alert">
        Secure payment is temporarily unavailable. Please try again shortly.
      </p>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: payment.clientSecret,
        appearance,
      }}
    >
      <TestPaymentElement payment={payment} />
    </Elements>
  )
}
