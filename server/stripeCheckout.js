import Stripe from 'stripe'

const MINIMUM_TEST_PAYMENT_CENTS = 50
const MAXIMUM_TEST_PAYMENT_CENTS = 999_999_99

export class StripeCheckoutError extends Error {
  constructor(message, { status = 502, code = 'payment_setup_error', cause } = {}) {
    super(message, { cause })
    this.name = 'StripeCheckoutError'
    this.status = status
    this.code = code
  }
}

function paymentAmountInCents(total) {
  const amount = Math.round(Number(total) * 100)
  if (
    !Number.isSafeInteger(amount)
    || amount < MINIMUM_TEST_PAYMENT_CENTS
    || amount > MAXIMUM_TEST_PAYMENT_CENTS
  ) {
    throw new StripeCheckoutError('The verified order total cannot be prepared for payment.', {
      code: 'invalid_payment_amount',
    })
  }
  return amount
}

export async function createSandboxPaymentIntent({ secretKey, quotation, email }) {
  if (!secretKey?.startsWith('sk_test_')) {
    throw new StripeCheckoutError('Stripe must use a test secret key for local checkout testing.', {
      status: 503,
      code: 'unsafe_payment_configuration',
    })
  }

  const amount = paymentAmountInCents(quotation.total)
  const currency = String(quotation.currency || 'USD').toLowerCase()
  const stripe = new Stripe(secretKey)

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        capture_method: 'automatic',
        description: `LoveLeeVA sandbox quotation ${quotation.reference}`,
        receipt_email: email,
        metadata: {
          integration: 'loveleeva_headless',
          environment: 'sandbox',
          odoo_quotation_id: String(quotation.quotationId),
          odoo_reference: quotation.reference,
        },
      },
      {
        idempotencyKey: `loveleeva-sandbox-quotation-${quotation.quotationId}`,
      },
    )

    if (intent.livemode || !intent.client_secret) {
      throw new StripeCheckoutError('Stripe did not return a safe test payment session.', {
        code: 'unsafe_payment_configuration',
      })
    }

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: intent.amount,
      currency: intent.currency.toUpperCase(),
      mode: 'test',
    }
  } catch (error) {
    if (error instanceof StripeCheckoutError) throw error
    throw new StripeCheckoutError('Stripe could not prepare the test payment form.', { cause: error })
  }
}
