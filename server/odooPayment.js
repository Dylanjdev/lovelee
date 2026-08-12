const MAX_REFERENCE_LENGTH = 255

export class OdooPaymentError extends Error {
  constructor(message, { status = 502, code = 'odoo_payment_error', cause } = {}) {
    super(message, { cause })
    this.name = 'OdooPaymentError'
    this.status = status
    this.code = code
  }
}

function relationId(value) {
  return Array.isArray(value) && Number.isSafeInteger(value[0]) ? value[0] : null
}

function relationName(value) {
  return Array.isArray(value) && typeof value[1] === 'string' ? value[1] : ''
}

function createdRecordId(value, recordName) {
  const id = Array.isArray(value) ? value[0] : value
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new OdooPaymentError(`Odoo did not create a valid ${recordName}.`)
  }
  return id
}

function money(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

function cents(value) {
  return Math.round(Number(value) * 100)
}

async function readQuotationForPayment(call, quotation) {
  const [order] = await call('sale.order', 'read', {
    ids: [quotation.quotationId],
    fields: [
      'id',
      'name',
      'state',
      'amount_total',
      'currency_id',
      'partner_id',
      'transaction_ids',
    ],
  })

  if (
    !order
    || order.state !== 'draft'
    || order.name !== quotation.reference
    || money(order.amount_total) !== money(quotation.total)
    || !relationId(order.currency_id)
    || !relationId(order.partner_id)
  ) {
    throw new OdooPaymentError('The Odoo quotation is not ready for payment.', {
      code: 'invalid_payment_quotation',
    })
  }

  return order
}

async function findSandboxStripeProvider(call) {
  const providers = await call('payment.provider', 'search_read', {
    domain: [['code', '=', 'stripe'], ['active', '=', true]],
    fields: [
      'id',
      'name',
      'code',
      'active',
      'stripe_publishable_key',
    ],
    limit: 5,
  })

  if (providers.length !== 1 || !providers[0].stripe_publishable_key?.startsWith('pk_test_')) {
    throw new OdooPaymentError('Odoo Stripe must remain connected in test mode.', {
      status: 503,
      code: 'unsafe_payment_configuration',
    })
  }

  return providers[0]
}

async function findCardPaymentMethod(call) {
  const methods = await call('payment.method', 'search_read', {
    domain: [['code', '=', 'card']],
    fields: ['id', 'name', 'code'],
    limit: 5,
  })

  if (methods.length !== 1) {
    throw new OdooPaymentError('The Odoo card payment method is unavailable.', {
      status: 503,
      code: 'payment_configuration_error',
    })
  }

  return methods[0]
}

function validatePaymentTransaction(transaction, order, provider, paymentMethod) {
  if (
    !transaction
    || transaction.state !== 'draft'
    || transaction.operation !== 'online_direct'
    || relationId(transaction.provider_id) !== provider.id
    || relationId(transaction.payment_method_id) !== paymentMethod.id
    || relationId(transaction.currency_id) !== relationId(order.currency_id)
    || money(transaction.amount) !== money(order.amount_total)
    || !transaction.sale_order_ids?.includes(order.id)
    || transaction.is_live
  ) {
    throw new OdooPaymentError('Odoo did not return a valid test payment transaction.', {
      code: 'invalid_payment_transaction',
    })
  }
}

export async function createSandboxPaymentTransaction({ call, quotation }) {
  if (
    quotation?.mode !== 'sandbox'
    || !Number.isSafeInteger(quotation?.quotationId)
    || typeof quotation?.reference !== 'string'
    || !quotation.reference
    || quotation.reference.length > MAX_REFERENCE_LENGTH
  ) {
    throw new OdooPaymentError('A valid sandbox quotation is required for payment.', {
      code: 'invalid_payment_quotation',
    })
  }

  const order = await readQuotationForPayment(call, quotation)
  const provider = await findSandboxStripeProvider(call)
  const paymentMethod = await findCardPaymentMethod(call)
  const createdIds = await call('payment.transaction', 'create', {
    vals_list: [{
      provider_id: provider.id,
      payment_method_id: paymentMethod.id,
      reference: order.name,
      amount: money(order.amount_total),
      currency_id: relationId(order.currency_id),
      partner_id: relationId(order.partner_id),
      operation: 'online_direct',
      sale_order_ids: [[6, 0, [order.id]]],
    }],
  })
  const transactionId = createdRecordId(createdIds, 'payment transaction')
  const [transaction] = await call('payment.transaction', 'read', {
    ids: [transactionId],
    fields: [
      'id',
      'reference',
      'provider_id',
      'provider_reference',
      'payment_method_id',
      'amount',
      'currency_id',
      'state',
      'operation',
      'is_live',
      'sale_order_ids',
      'is_post_processed',
    ],
  })

  validatePaymentTransaction(transaction, order, provider, paymentMethod)

  return {
    transactionId: transaction.id,
    reference: transaction.reference,
    state: transaction.state,
    amount: money(transaction.amount),
    currency: relationName(transaction.currency_id),
    provider: relationName(transaction.provider_id),
    mode: 'test',
  }
}

async function readPaymentAndOrder(call, payment) {
  const [transaction] = await call('payment.transaction', 'read', {
    ids: [payment.transactionId],
    fields: [
      'id',
      'reference',
      'provider_code',
      'provider_reference',
      'amount',
      'currency_id',
      'state',
      'is_live',
      'sale_order_ids',
      'is_post_processed',
    ],
  })
  const [order] = await call('sale.order', 'read', {
    ids: [payment.quotationId],
    fields: [
      'id',
      'name',
      'state',
      'amount_total',
      'amount_paid',
      'currency_id',
      'transaction_ids',
      'picking_ids',
      'invoice_ids',
    ],
  })

  return { transaction, order }
}

function validatePaidTransaction(payment, transaction, order) {
  if (
    payment?.mode !== 'test'
    || !transaction
    || !order
    || transaction.id !== payment.transactionId
    || order.id !== payment.quotationId
    || transaction.reference !== payment.reference
    || order.name !== payment.reference
    || transaction.provider_code !== 'stripe'
    || transaction.is_live
    || !transaction.sale_order_ids?.includes(order.id)
    || !order.transaction_ids?.includes(transaction.id)
    || cents(transaction.amount) !== payment.amount
    || cents(order.amount_total) !== payment.amount
    || relationName(transaction.currency_id) !== payment.currency
    || relationName(order.currency_id) !== payment.currency
    || (
      transaction.provider_reference
      && transaction.provider_reference !== payment.paymentIntentId
    )
  ) {
    throw new OdooPaymentError('The paid order does not match the Odoo transaction.', {
      status: 409,
      code: 'payment_order_mismatch',
    })
  }
}

export async function completeSandboxPaymentTransaction({ call, payment }) {
  let { transaction, order } = await readPaymentAndOrder(call, payment)
  validatePaidTransaction(payment, transaction, order)

  if (transaction.state !== 'done') {
    throw new OdooPaymentError('Odoo is still recording the successful payment.', {
      status: 409,
      code: 'payment_processing',
    })
  }

  if (!transaction.is_post_processed || order.state !== 'sale') {
    await call('payment.transaction', 'action_post_process', {
      ids: [transaction.id],
    })
    const updatedRecords = await readPaymentAndOrder(call, payment)
    transaction = updatedRecords.transaction
    order = updatedRecords.order
    validatePaidTransaction(payment, transaction, order)
  }

  if (
    transaction.state !== 'done'
    || !transaction.is_post_processed
    || order.state !== 'sale'
    || cents(order.amount_paid) < payment.amount
  ) {
    throw new OdooPaymentError('Odoo is still preparing the confirmed order.', {
      status: 409,
      code: 'payment_processing',
    })
  }

  return {
    reference: order.name,
    status: 'confirmed',
    total: money(order.amount_total),
    currency: relationName(order.currency_id),
    deliveryCreated: Boolean(order.picking_ids?.length),
    invoiceCreated: Boolean(order.invoice_ids?.length),
    mode: 'test',
  }
}
