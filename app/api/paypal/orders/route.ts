import { NextResponse } from 'next/server'

const baseUrl = process.env.PAYPAL_ENVIRONMENT === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

async function getAccessToken() {
  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials', cache: 'no-store' })
  if (!response.ok) throw new Error('PayPal authentication failed')
  return (await response.json()).access_token as string
}

export async function POST(request: Request) {
  try {
    const { action = 'create', orderId, amount } = await request.json()
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 100000) return NextResponse.json({ error: 'Invalid pact amount' }, { status: 400 })
    const token = await getAccessToken()
    if (action === 'capture') {
      if (!orderId || !/^[A-Z0-9-]+$/i.test(orderId)) return NextResponse.json({ error: 'Invalid PayPal order ID' }, { status: 400 })
      const response = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' })
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    }
    const response = await fetch(`${baseUrl}/v2/checkout/orders`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': `pact-${crypto.randomUUID()}` }, body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ reference_id: 'paypal-pact-milestone', description: 'PayPal Pact milestone funding', amount: { currency_code: 'USD', value: numericAmount.toFixed(2) } }], application_context: { brand_name: 'PayPal Pact', user_action: 'PAY_NOW', shipping_preference: 'NO_SHIPPING', return_url: 'https://bits2wave-rouge.vercel.app', cancel_url: 'https://bits2wave-rouge.vercel.app' } }) })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'PayPal request failed' }, { status: 500 })
  }
}
