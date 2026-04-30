import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe } from '@/lib/stripe'
import { createSupabaseAdmin } from '@/lib/supabase'
import type Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getServerStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const admin = createSupabaseAdmin()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const plan = session.metadata?.plan

        if (!userId || !plan) break

        const expiresAt =
          plan === 'season_pass'
            ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
            : null

        await admin.from('subscriptions').upsert(
          {
            user_id: userId,
            plan,
            stripe_subscription_id: (session.subscription as string) ?? null,
            stripe_customer_id: session.customer as string,
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await admin
          .from('subscriptions')
          .update({ plan: 'free', stripe_subscription_id: null, updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await admin
            .from('subscriptions')
            .update({ plan: 'free', updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
