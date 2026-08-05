const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isBusinessDirectoryConfigured = Boolean(supabaseUrl && publishableKey)

const authHeaders = {
  apikey: publishableKey ?? '',
  Authorization: `Bearer ${publishableKey ?? ''}`,
}

async function readResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''
  const responseText = await response.text()
  let body = responseText || null

  if (responseText && contentType.includes('application/json')) {
    try {
      body = JSON.parse(responseText)
    } catch {
      body = responseText
    }
  }

  if (!response.ok) {
    const message = typeof body === 'object' && body !== null
      ? body.message ?? body.error_description ?? body.error
      : body

    throw new Error(message || 'The directory service could not complete the request.')
  }

  return body
}

function requireConfiguration() {
  if (!isBusinessDirectoryConfigured) {
    throw new Error('The business directory is not configured yet.')
  }
}

export async function getApprovedBusinesses({ signal } = {}) {
  requireConfiguration()

  const fields = [
    'id',
    'name',
    'category',
    'description',
    'address',
    'phone',
    'business_email',
    'website_url',
    'logo_path',
  ].join(',')
  const params = new URLSearchParams({
    select: fields,
    status: 'eq.approved',
    order: 'name.asc',
  })
  const response = await fetch(`${supabaseUrl}/rest/v1/businesses?${params}`, {
    headers: authHeaders,
    signal,
  })

  return readResponse(response)
}

async function callRpc(functionName, values) {
  requireConfiguration()

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  return readResponse(response)
}

export function submitBusinessListing(values) {
  return callRpc('submit_business_listing', {
    p_name: values.name,
    p_category: values.category,
    p_description: values.description,
    p_address: values.address,
    p_phone: values.phone,
    p_business_email: values.businessEmail,
    p_website_url: values.websiteUrl,
    p_submitter_name: values.submitterName,
    p_submitter_email: values.submitterEmail,
  })
}

const logoExtensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function uploadBusinessLogo(businessId, file) {
  requireConfiguration()

  const extension = logoExtensions[file.type]
  if (!extension) {
    throw new Error('Choose a JPG, PNG, or WebP logo.')
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('The logo must be 2 MB or smaller.')
  }

  const objectName = `${businessId}/logo-${crypto.randomUUID().replaceAll('-', '')}.${extension}`
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/business-logos/${objectName}`,
    {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: file,
    },
  )

  await readResponse(response)
  return objectName
}

export function attachBusinessLogo(businessId, logoPath) {
  return callRpc('attach_business_logo', {
    p_business_id: businessId,
    p_logo_path: logoPath,
  })
}

export function getBusinessLogoUrl(logoPath) {
  if (!logoPath || !isBusinessDirectoryConfigured) return null

  const encodedPath = logoPath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  return `${supabaseUrl}/storage/v1/object/public/business-logos/${encodedPath}`
}
