const pendingPaymentStorageKey = 'loveleeva-pending-payment-v1'
const pendingPaymentLifetime = 24 * 60 * 60 * 1_000
const completionTimeout = 15 * 60 * 1_000
const paymentIntentIdPattern = /^pi_[A-Za-z0-9]+$/

function paymentIntentIdIsValid(value) {
  return typeof value === 'string' && paymentIntentIdPattern.test(value) && value.length <= 255
}

function retryDelay(attempt) {
  if (attempt < 2) return 1_000
  if (attempt < 4) return 3_000
  return 10_000
}

function wait(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason || new DOMException('The request was cancelled.', 'AbortError'))
      return
    }

    function handleAbort() {
      globalThis.clearTimeout(timeoutId)
      reject(signal.reason || new DOMException('The request was cancelled.', 'AbortError'))
    }

    const timeoutId = globalThis.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, milliseconds)

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

export function rememberPendingCheckoutPayment(paymentIntentId) {
  if (!paymentIntentIdIsValid(paymentIntentId) || typeof window === 'undefined') return

  try {
    window.localStorage.setItem(pendingPaymentStorageKey, JSON.stringify({
      paymentIntentId,
      createdAt: Date.now(),
    }))
  } catch {
    // Checkout can continue even when browser storage is unavailable.
  }
}

export function readPendingCheckoutPayment() {
  if (typeof window === 'undefined') return ''

  try {
    const pendingPayment = JSON.parse(window.localStorage.getItem(pendingPaymentStorageKey) || 'null')
    const isCurrent = Number.isFinite(pendingPayment?.createdAt)
      && Date.now() - pendingPayment.createdAt < pendingPaymentLifetime

    if (!isCurrent || !paymentIntentIdIsValid(pendingPayment?.paymentIntentId)) {
      window.localStorage.removeItem(pendingPaymentStorageKey)
      return ''
    }

    return pendingPayment.paymentIntentId
  } catch {
    return ''
  }
}

export function forgetPendingCheckoutPayment() {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(pendingPaymentStorageKey)
  } catch {
    // There is nothing else to clean up when browser storage is unavailable.
  }
}

export async function completeCheckoutOrder(paymentIntentId, { signal } = {}) {
  if (!paymentIntentIdIsValid(paymentIntentId)) {
    throw new Error('The payment confirmation is invalid.')
  }

  const deadline = Date.now() + completionTimeout
  let attempt = 0
  let lastMessage = ''

  while (Date.now() < deadline) {
    let response
    let payload

    try {
      response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
        signal,
      })
      payload = await response.json().catch(() => null)
    } catch (error) {
      if (signal?.aborted) throw error
      lastMessage = 'Your payment was received, but the order service is temporarily unavailable.'
    }

    if (response?.ok && payload?.reference) return payload

    const canRetry = !response
      || payload?.code === 'payment_processing'
      || response.status === 429
      || response.status >= 500

    if (!canRetry) {
      throw new Error(
        payload?.error
        || 'Your payment was received, but we could not confirm the order automatically.',
      )
    }

    lastMessage = payload?.error || lastMessage
    const delay = retryDelay(attempt)
    attempt += 1

    if (Date.now() + delay >= deadline) break
    await wait(delay, signal)
  }

  throw new Error(
    lastMessage
    || 'Your payment was received, but the order confirmation is taking longer than expected.',
  )
}
