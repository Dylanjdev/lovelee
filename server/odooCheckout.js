import { CheckoutValidationError, validateCartPricing } from './checkoutValidation.js'

const MAX_TEXT_LENGTH = 160
const MAX_ADDRESS_LENGTH = 200
const DEFAULT_LOCALE = 'en_US'

export class OdooCheckoutError extends Error {
  constructor(message, { status = 400, code = 'checkout_error', cause } = {}) {
    super(message, { cause })
    this.name = 'OdooCheckoutError'
    this.status = status
    this.code = code
  }
}

function cleanText(value, fieldName, { required = true, maxLength = MAX_TEXT_LENGTH } = {}) {
  const text = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''

  if (required && !text) {
    throw new OdooCheckoutError(`${fieldName} is required.`, { code: 'invalid_customer' })
  }

  if (text.length > maxLength) {
    throw new OdooCheckoutError(`${fieldName} is too long.`, { code: 'invalid_customer' })
  }

  return text
}

function normalizeEmail(value) {
  const email = cleanText(value, 'Email address', { maxLength: 254 }).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new OdooCheckoutError('Enter a valid email address.', { code: 'invalid_customer' })
  }
  return email
}

function normalizeCountryCode(value) {
  const code = cleanText(value, 'Country').toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) {
    throw new OdooCheckoutError('Select a valid destination country.', { code: 'invalid_address' })
  }
  return code
}

function normalizeCheckoutDetails(payload) {
  const customer = payload?.customer || {}
  const shippingAddress = payload?.shippingAddress || {}

  return {
    customer: {
      firstName: cleanText(customer.firstName, 'First name'),
      lastName: cleanText(customer.lastName, 'Last name'),
      email: normalizeEmail(customer.email),
      phone: cleanText(customer.phone, 'Phone number', { maxLength: 40 }),
    },
    shippingAddress: {
      street: cleanText(shippingAddress.street, 'Street address', { maxLength: MAX_ADDRESS_LENGTH }),
      street2: cleanText(shippingAddress.street2, 'Apartment or suite', {
        required: false,
        maxLength: MAX_ADDRESS_LENGTH,
      }),
      city: cleanText(shippingAddress.city, 'City'),
      state: cleanText(shippingAddress.state, 'State or province', { maxLength: 100 }),
      postalCode: cleanText(shippingAddress.postalCode, 'Postal code', { maxLength: 24 }),
      countryCode: normalizeCountryCode(shippingAddress.countryCode),
    },
  }
}

function relationId(value) {
  return Array.isArray(value) && Number.isSafeInteger(value[0]) ? value[0] : null
}

function relationName(value, fallback = '') {
  return Array.isArray(value) && typeof value[1] === 'string' ? value[1] : fallback
}

function money(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

function createdRecordId(value, recordName) {
  const id = Array.isArray(value) ? value[0] : value
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new OdooCheckoutError(`Odoo did not create a valid ${recordName}.`, {
      status: 502,
      code: 'quotation_error',
    })
  }
  return id
}

async function findCountry(call, countryCode) {
  const countries = await call('res.country', 'search_read', {
    domain: [['code', '=ilike', countryCode]],
    fields: ['id', 'name', 'code'],
    limit: 2,
    context: { lang: DEFAULT_LOCALE },
  })

  if (countries.length !== 1) {
    throw new OdooCheckoutError('That destination country is not available in Odoo.', {
      code: 'invalid_address',
    })
  }

  return countries[0]
}

async function findState(call, countryId, stateInput) {
  const states = await call('res.country.state', 'search_read', {
    domain: [['country_id', '=', countryId]],
    fields: ['id', 'name', 'code'],
    order: 'name asc',
    limit: 500,
    context: { lang: DEFAULT_LOCALE },
  })
  const normalizedInput = stateInput.trim().toLowerCase()
  const matches = states.filter((state) => (
    state.code?.toLowerCase() === normalizedInput
    || state.name?.toLowerCase() === normalizedInput
  ))

  if (matches.length !== 1) {
    throw new OdooCheckoutError('Enter the full state/province name or its official abbreviation.', {
      code: 'invalid_address',
    })
  }

  return matches[0]
}

async function assertSandboxConfiguration(call) {
  const [company] = await call('res.company', 'search_read', {
    domain: [],
    fields: [
      'id',
      'avalara_environment',
      'avalara_commit',
      'avalara_connection_method',
      'avalara_iap_connected',
    ],
    limit: 1,
  })

  if (
    !company
    || company.avalara_environment !== 'sandbox'
    || company.avalara_commit
    || (company.avalara_connection_method === 'iap' && !company.avalara_iap_connected)
  ) {
    throw new OdooCheckoutError(
      'Odoo AvaTax must be connected in Sandbox with transaction commits disabled for this test.',
      { status: 503, code: 'unsafe_tax_configuration' },
    )
  }
}

async function findAvaTaxFiscalPosition(call) {
  const positions = await call('account.fiscal.position', 'search_read', {
    domain: [['active', '=', true], ['name', 'ilike', 'AvaTax']],
    fields: ['id', 'name'],
    limit: 10,
  })

  if (positions.length !== 1) {
    throw new OdooCheckoutError('The AvaTax fiscal position is missing or ambiguous in Odoo.', {
      status: 503,
      code: 'tax_configuration_error',
    })
  }

  return positions[0]
}

async function findUpsCarrier(call, countryCode) {
  const carriers = await call('delivery.carrier', 'search_read', {
    domain: [['active', '=', true], ['delivery_type', '=', 'ups_rest']],
    fields: ['id', 'name', 'prod_environment'],
    order: 'sequence asc, id asc',
    limit: 20,
  })

  const expectedName = countryCode === 'US' ? 'domestic' : 'international'
  const carrier = carriers.find((candidate) => candidate.name.toLowerCase().includes(expectedName))

  if (!carrier) {
    throw new OdooCheckoutError(`No UPS ${expectedName} carrier is configured in Odoo.`, {
      status: 503,
      code: 'shipping_configuration_error',
    })
  }

  if (carrier.prod_environment) {
    throw new OdooCheckoutError('UPS must remain in test mode for local checkout testing.', {
      status: 503,
      code: 'unsafe_shipping_configuration',
    })
  }

  return carrier
}

async function findOrCreatePartner(call, details, country, state) {
  const { customer, shippingAddress } = details
  const partners = await call('res.partner', 'search_read', {
    domain: [
      ['email', '=ilike', customer.email],
      ['street', '=', shippingAddress.street],
      ['zip', '=', shippingAddress.postalCode],
      ['country_id', '=', country.id],
    ],
    fields: ['id'],
    limit: 2,
  })

  if (partners.length) return partners[0].id

  const createdIds = await call('res.partner', 'create', {
    vals_list: [{
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      street: shippingAddress.street,
      street2: shippingAddress.street2 || false,
      city: shippingAddress.city,
      state_id: state.id,
      zip: shippingAddress.postalCode,
      country_id: country.id,
      customer_rank: 1,
      comment: 'Created by the LoveLeeVA headless checkout sandbox test.',
    }],
  })
  return createdRecordId(createdIds, 'customer')
}

function quoteOrderLines(validatedItems) {
  return validatedItems.map((item) => [0, 0, {
    product_id: Number(item.productId),
    name: item.name,
    product_uom_qty: item.quantity,
    price_unit: item.unitPrice,
  }])
}

async function applyCarrier(call, orderId, carrierId) {
  const createdIds = await call('choose.delivery.carrier', 'create', {
    vals_list: [{
      order_id: orderId,
      carrier_id: carrierId,
    }],
  })
  const wizardId = createdRecordId(createdIds, 'delivery-rate request')

  await call('choose.delivery.carrier', 'update_price', { ids: [wizardId] })
  const [wizard] = await call('choose.delivery.carrier', 'read', {
    ids: [wizardId],
    fields: ['delivery_price', 'display_price', 'delivery_message'],
  })

  if (!wizard || !Number.isFinite(Number(wizard.delivery_price))) {
    throw new OdooCheckoutError('UPS did not return a valid shipping rate.', {
      status: 502,
      code: 'shipping_rate_error',
    })
  }

  await call('choose.delivery.carrier', 'button_confirm', { ids: [wizardId] })
  return wizard
}

async function readFinalOrder(call, orderId) {
  const [order] = await call('sale.order', 'read', {
    ids: [orderId],
    fields: [
      'id',
      'name',
      'state',
      'amount_untaxed',
      'amount_tax',
      'amount_total',
      'currency_id',
      'fiscal_position_id',
      'carrier_id',
      'order_line',
      'is_tax_computed_externally',
      'is_avatax',
    ],
  })

  if (
    !order
    || order.state !== 'draft'
    || !order.is_tax_computed_externally
    || !order.is_avatax
  ) {
    throw new OdooCheckoutError('Odoo did not return a valid draft quotation.', {
      status: 502,
      code: 'quotation_error',
    })
  }

  return order
}

export async function createSandboxQuote({ call, payload, products }) {
  const details = normalizeCheckoutDetails(payload)
  let validation

  try {
    validation = validateCartPricing(payload?.items, products)
  } catch (error) {
    if (error instanceof CheckoutValidationError) throw error
    throw new OdooCheckoutError('The cart could not be validated.', { cause: error })
  }

  await assertSandboxConfiguration(call)
  const country = await findCountry(call, details.shippingAddress.countryCode)
  const state = await findState(call, country.id, details.shippingAddress.state)
  const fiscalPosition = await findAvaTaxFiscalPosition(call)
  const carrier = await findUpsCarrier(call, details.shippingAddress.countryCode)
  const partnerId = await findOrCreatePartner(call, details, country, state)

  const createdOrderIds = await call('sale.order', 'create', {
    vals_list: [{
      partner_id: partnerId,
      partner_invoice_id: partnerId,
      partner_shipping_id: partnerId,
      fiscal_position_id: fiscalPosition.id,
      client_order_ref: `LoveLeeVA sandbox checkout ${new Date().toISOString()}`,
      origin: 'LoveLeeVA React checkout — sandbox',
      order_line: quoteOrderLines(validation.items),
    }],
    context: { lang: DEFAULT_LOCALE },
  })
  const orderId = createdRecordId(createdOrderIds, 'draft quotation')

  const shippingRate = await applyCarrier(call, orderId, carrier.id)
  await call('sale.order', 'button_external_tax_calculation', { ids: [orderId] })
  const order = await readFinalOrder(call, orderId)
  const total = money(order.amount_total)
  const expectedTotal = money(Number(order.amount_untaxed) + Number(order.amount_tax))

  if (!Number.isFinite(total) || total <= 0 || total !== expectedTotal) {
    throw new OdooCheckoutError('Odoo returned an invalid quotation total.', {
      status: 502,
      code: 'quotation_total_error',
    })
  }

  return {
    quotationId: order.id,
    reference: order.name,
    state: order.state,
    currency: relationName(order.currency_id, validation.currency || 'USD'),
    items: validation.items,
    subtotal: validation.subtotal,
    shipping: money(shippingRate.delivery_price),
    tax: money(order.amount_tax),
    total,
    carrier: {
      id: relationId(order.carrier_id) || carrier.id,
      name: relationName(order.carrier_id, carrier.name),
    },
    fiscalPosition: relationName(order.fiscal_position_id, fiscalPosition.name),
    warning: shippingRate.delivery_message || null,
    mode: 'sandbox',
    quotedAt: new Date().toISOString(),
  }
}
