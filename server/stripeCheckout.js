import Stripe from 'stripe'

const MINIMUM_TEST_PAYMENT_CENTS = 50
const MAXIMUM_TEST_PAYMENT_CENTS = 999_999_99
const PAYMENT_INTENT_ID_PATTERN = /^pi_[A-Za-z0-9]+$/

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

function assertStripeMode(secretKey, checkoutMode) {
  if (!['sandbox', 'live'].includes(checkoutMode)) {
    throw new StripeCheckoutError('Checkout mode is not configured.', {
      status: 503,
      code: 'unsafe_payment_configuration',
    })
  }

  const expectedPrefix = checkoutMode === 'live' ? 'sk_live_' : 'sk_test_'
  if (!secretKey?.startsWith(expectedPrefix)) {
    throw new StripeCheckoutError(`Stripe must use ${checkoutMode} credentials.`, {
      status: 503,
      code: 'unsafe_payment_configuration',
    })
  }
}

export async function createCheckoutPaymentIntent({
  secretKey,
  quotation,
  odooTransaction,
  email,
}) {
  assertStripeMode(secretKey, quotation?.mode)

  const amount = paymentAmountInCents(quotation.total)
  const currency = String(quotation.currency || 'USD').toLowerCase()
  const stripe = new Stripe(secretKey)

  if (
    !Number.isSafeInteger(odooTransaction?.transactionId)
    || !odooTransaction?.reference
    || odooTransaction.state !== 'draft'
    || odooTransaction.mode !== quotation.mode
    || paymentAmountInCents(odooTransaction.amount) !== amount
    || String(odooTransaction.currency).toLowerCase() !== currency
  ) {
    throw new StripeCheckoutError('Odoo did not prepare a matching test payment transaction.', {
      code: 'invalid_payment_transaction',
    })
  }

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        payment_method_types: ['card'],
        capture_method: 'automatic',
        description: odooTransaction.reference,
        receipt_email: email,
        metadata: {
          integration: 'loveleeva_headless',
          environment: quotation.mode,
          odoo_quotation_id: String(quotation.quotationId),
          odoo_reference: quotation.reference,
          odoo_payment_transaction_id: String(odooTransaction.transactionId),
          odoo_payment_transaction_reference: odooTransaction.reference,
        },
      },
      {
        idempotencyKey: `loveleeva-${quotation.mode}-quotation-${quotation.quotationId}`,
      },
    )

    if (intent.livemode !== (quotation.mode === 'live') || !intent.client_secret) {
      throw new StripeCheckoutError('Stripe did not return a payment session for the configured mode.', {
        code: 'unsafe_payment_configuration',
      })
    }

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      amount: intent.amount,
      currency: intent.currency.toUpperCase(),
      mode: quotation.mode,
    }
  } catch (error) {
    if (error instanceof StripeCheckoutError) throw error
    throw new StripeCheckoutError('Stripe could not prepare the test payment form.', { cause: error })
  }
}

export async function verifyCheckoutPaymentIntent({ secretKey, paymentIntentId, checkoutMode }) {
  assertStripeMode(secretKey, checkoutMode)

  if (
    typeof paymentIntentId !== 'string'
    || !PAYMENT_INTENT_ID_PATTERN.test(paymentIntentId)
    || paymentIntentId.length > 255
  ) {
    throw new StripeCheckoutError('The payment confirmation is invalid.', {
      status: 400,
      code: 'invalid_payment_confirmation',
    })
  }

  const stripe = new Stripe(secretKey)
  let intent

  try {
    intent = await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch (error) {
    throw new StripeCheckoutError('Stripe could not verify the payment.', { cause: error })
  }

  const quotationId = Number(intent.metadata?.odoo_quotation_id)
  const transactionId = Number(intent.metadata?.odoo_payment_transaction_id)
  const reference = intent.metadata?.odoo_payment_transaction_reference

  if (
    intent.livemode !== (checkoutMode === 'live')
    || intent.status !== 'succeeded'
    || intent.metadata?.integration !== 'loveleeva_headless'
    || intent.metadata?.environment !== checkoutMode
    || !Number.isSafeInteger(quotationId)
    || quotationId <= 0
    || !Number.isSafeInteger(transactionId)
    || transactionId <= 0
    || typeof reference !== 'string'
    || !reference
    || intent.description !== reference
    || !Number.isSafeInteger(intent.amount)
    || intent.amount <= 0
  ) {
    throw new StripeCheckoutError('The payment has not completed successfully.', {
      status: 409,
      code: 'payment_processing',
    })
  }

  return {
    paymentIntentId: intent.id,
    transactionId,
    quotationId,
    reference,
    amount: intent.amount,
    currency: intent.currency.toUpperCase(),
    mode: checkoutMode,
  }
}
