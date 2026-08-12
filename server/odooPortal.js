const DEFAULT_PORTAL_URL = 'https://lovelee.odoo.com/my/orders'

export class OdooPortalError extends Error {
  constructor(message, { cause } = {}) {
    super(message, { cause })
    this.name = 'OdooPortalError'
  }
}

function createdRecordId(value, recordName) {
  const id = Array.isArray(value) ? value[0] : value
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new OdooPortalError(`Odoo did not create a valid ${recordName}.`)
  }
  return id
}

async function readPartnerUsers(call, partnerId) {
  const [partner] = await call('res.partner', 'read', {
    ids: [partnerId],
    fields: ['id', 'name', 'email', 'user_ids'],
  })

  if (!partner || typeof partner.email !== 'string' || !partner.email.trim()) {
    throw new OdooPortalError('The customer does not have an email address for portal access.')
  }

  const users = partner.user_ids?.length
    ? await call('res.users', 'read', {
        ids: partner.user_ids,
        fields: ['id', 'login', 'active', 'share'],
        context: { active_test: false },
      })
    : []

  return { partner, users }
}

function activePortalUser(users) {
  return users.find((user) => user.active && user.share)
}

export async function ensureCustomerPortalAccess({
  call,
  partnerId,
  portalUrl = DEFAULT_PORTAL_URL,
}) {
  if (!Number.isSafeInteger(partnerId) || partnerId <= 0) {
    throw new OdooPortalError('A valid Odoo customer is required for portal access.')
  }

  const { partner, users } = await readPartnerUsers(call, partnerId)
  if (activePortalUser(users)) {
    return { status: 'available', url: portalUrl }
  }

  if (users.some((user) => user.active && !user.share)) {
    return { status: 'manual_review', url: portalUrl }
  }

  const createdWizardIds = await call('portal.wizard', 'create', {
    vals_list: [{
      partner_ids: [[6, 0, [partner.id]]],
      welcome_message: 'Thank you for shopping with LoveLeeVA. Use your account to view your confirmed orders and delivery updates.',
    }],
    context: {
      active_model: 'res.partner',
      active_id: partner.id,
      active_ids: [partner.id],
    },
  })
  const wizardId = createdRecordId(createdWizardIds, 'portal access request')
  const [wizard] = await call('portal.wizard', 'read', {
    ids: [wizardId],
    fields: ['user_ids'],
  })
  const wizardUserIds = wizard?.user_ids?.length
    ? wizard.user_ids
    : await call('portal.wizard.user', 'search', {
        domain: [['wizard_id', '=', wizardId]],
        limit: 10,
      })

  if (wizardUserIds.length !== 1) {
    throw new OdooPortalError('Odoo did not prepare one portal invitation for the customer.')
  }

  const [wizardUser] = await call('portal.wizard.user', 'read', {
    ids: wizardUserIds,
    fields: ['id', 'is_portal', 'is_internal', 'email_state'],
  })

  if (wizardUser?.is_portal) {
    return { status: 'available', url: portalUrl }
  }

  if (!wizardUser || wizardUser.is_internal || wizardUser.email_state !== 'ok') {
    return { status: 'manual_review', url: portalUrl }
  }

  await call('portal.wizard.user', 'action_grant_access', {
    ids: [wizardUser.id],
  })

  const refreshedPartner = await readPartnerUsers(call, partner.id)
  if (!activePortalUser(refreshedPartner.users)) {
    throw new OdooPortalError('Odoo did not activate the customer portal account.')
  }

  return { status: 'invited', url: portalUrl }
}

export async function prepareCustomerPortal(options) {
  try {
    return await ensureCustomerPortalAccess(options)
  } catch (error) {
    console.error('Odoo customer portal setup failed', error)
    return { status: 'unavailable', url: options.portalUrl || DEFAULT_PORTAL_URL }
  }
}
