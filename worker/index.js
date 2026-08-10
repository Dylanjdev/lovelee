function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('Cache-Control', 'no-store')

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse(
        { error: 'API route not found.' },
        { status: 404 },
      )
    }

    return env.ASSETS.fetch(request)
  },
}
