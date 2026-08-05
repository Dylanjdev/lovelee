const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isCalendarConfigured = Boolean(supabaseUrl && publishableKey)

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

    throw new Error(message || 'The calendar service could not complete the request.')
  }

  return body
}

function requireConfiguration() {
  if (!isCalendarConfigured) {
    throw new Error('The community calendar is not configured yet.')
  }
}

export async function getPublishedEvents({ rangeStart, rangeEnd, signal } = {}) {
  requireConfiguration()

  const fields = [
    'id',
    'title',
    'description',
    'start_at',
    'end_at',
    'all_day',
    'location_name',
    'address',
    'website_url',
    'category',
  ].join(',')
  const params = new URLSearchParams({
    select: fields,
    is_published: 'eq.true',
    status: 'eq.approved',
    order: 'start_at.asc',
  })

  if (rangeStart) params.append('start_at', `gte.${rangeStart}`)
  if (rangeEnd) params.append('start_at', `lt.${rangeEnd}`)

  const response = await fetch(`${supabaseUrl}/rest/v1/events?${params}`, {
    headers: authHeaders,
    signal,
  })

  return readResponse(response)
}

export async function submitCalendarEvent(values) {
  requireConfiguration()

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/submit_calendar_event`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_title: values.title,
      p_description: values.description,
      p_start_at: values.startAt,
      p_end_at: values.endAt,
      p_all_day: values.allDay,
      p_location_name: values.locationName,
      p_address: values.address,
      p_website_url: values.websiteUrl,
      p_category: values.category,
      p_submitter_name: values.submitterName,
      p_submitter_email: values.submitterEmail,
    }),
  })

  return readResponse(response)
}
