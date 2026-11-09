import { NextResponse } from 'next/server'

const baseUrl = process.env.PAYPAL_ENVIRONMENT === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

export async function POST(request: Request) {
  try {
    const event = await request.json()
    const headers = Object.fromEntries(request.headers.entries())
    const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials', cache: 'no-store' })
    if (!tokenResponse.ok) return NextResponse.json({ verified: false, error: 'PayPal authentication failed' }, { status: 502 })
    const { access_token: token } = await tokenResponse.json()
    const verifyResponse = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ auth_algo: headers['paypal-auth-algo'], cert_url: headers['paypal-cert-url'], transmission_id: headers['paypal-transmission-id'], transmission_sig: headers['paypal-transmission-sig'], transmission_time: headers['paypal-transmission-time'], webhook_id: process.env.PAYPAL_WEBHOOK_ID, webhook_event: event }) })
    const result = await verifyResponse.json()
    return NextResponse.json({ verified: result.verification_status === 'SUCCESS', eventType: event.event_type ?? null }, { status: verifyResponse.ok ? 200 : verifyResponse.status })
  } catch { return NextResponse.json({ verified: false, error: 'Webhook verification failed' }, { status: 400 }) }
}
