const completionAttempts = 8
const completionRetryDelay = 1_000

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

export async function completeCheckoutOrder(paymentIntentId) {
  for (let attempt = 0; attempt < completionAttempts; attempt += 1) {
    const response = await fetch('/api/checkout/complete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentIntentId }),
    })
    const payload = await response.json().catch(() => null)

    if (response.ok && payload?.reference) return payload

    if (payload?.code === 'payment_processing' && attempt < completionAttempts - 1) {
      await wait(completionRetryDelay)
      continue
    }

    throw new Error(
      payload?.error
      || 'Your payment was received, but the order confirmation is still processing.',
    )
  }

  throw new Error('Your payment was received, but the order confirmation is still processing.')
}
