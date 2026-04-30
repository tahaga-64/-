import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

export function getServerStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
  })
}

let stripePromise: ReturnType<typeof loadStripe>
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export const PLANS = {
  standard: {
    name: 'スタンダード',
    price: 980,
    interval: 'month' as const,
    description: '毎月無制限で使えるプラン',
    priceId: process.env.STRIPE_STANDARD_PRICE_ID ?? '',
  },
  season_pass: {
    name: 'シーズンパス',
    price: 2980,
    interval: 'one-time' as const,
    description: '3ヶ月間有効・申告シーズン向け',
    priceId: process.env.STRIPE_SEASON_PRICE_ID ?? '',
  },
} as const
