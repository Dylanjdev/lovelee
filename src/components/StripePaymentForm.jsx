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

function TestPaymentElement({ payment, quotationReference }) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  async function handlePayment() {
    if (!stripe || !elements || status.state === 'processing') return

    setStatus({ state: 'processing', message: 'Submitting the Stripe test payment…' })
    const { error: validationError } = await elements.submit()

    if (validationError) {
      setStatus({
        state: 'error',
        message: validationError.message || 'Review the test card details and try again.',
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
        message: error.message || 'Stripe could not complete the test payment.',
      })
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      setStatus({
        state: 'success',
        message: `Stripe test payment succeeded for ${quotationReference}. The Odoo quotation remains a draft until the webhook step is connected.`,
      })
      return
    }

    setStatus({
      state: 'success',
      message: `Stripe accepted the test payment with status: ${paymentIntent?.status || 'processing'}.`,
    })
  }

  return (
    <div className="stripe-test-payment">
      <div className="stripe-test-payment__header">
        <div>
          <p className="section-label">Stripe test mode</p>
          <strong>{formatMoney(payment.amount / 100, payment.currency)} due</strong>
        </div>
        <span>Not live</span>
      </div>
      <PaymentElement options={{ layout: 'tabs' }} />
      <p className="stripe-test-payment__hint">
        Use test card <strong>4242 4242 4242 4242</strong>, any future expiration date, and any three-digit CVC.
      </p>
      <button
        type="button"
        className="btn btn--primary stripe-test-payment__submit"
        onClick={handlePayment}
        disabled={!stripe || !elements || status.state === 'processing'}
      >
        {status.state === 'processing' ? 'Processing test payment…' : 'Pay with Stripe test card'}
      </button>
      {status.message ? (
        <p
          className={`checkout-form__status checkout-form__status--${status.state}`}
          role={status.state === 'error' ? 'alert' : 'status'}
        >
          {status.message}
        </p>
      ) : null}
    </div>
  )
}

export default function StripePaymentForm({ payment, quotationReference }) {
  if (!stripePromise) {
    return (
      <p className="checkout-form__status checkout-form__status--error" role="alert">
        The Stripe test publishable key is not configured.
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
      <TestPaymentElement payment={payment} quotationReference={quotationReference} />
    </Elements>
  )
}
