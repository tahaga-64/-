import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getServerStripe, PLANS } from '@/lib/stripe'

async function createCheckoutSession(formData: FormData) {
  'use server'
  const plan = formData.get('plan') as keyof typeof PLANS
  if (!PLANS[plan]) return

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const planConfig = PLANS[plan]
  const session = await getServerStripe().checkout.sessions.create({
    mode: plan === 'season_pass' ? 'payment' : 'subscription',
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: user.email,
    metadata: { user_id: user.id, plan },
  })

  if (session.url) redirect(session.url)
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <a href="/" className="font-bold text-[#2563EB] text-lg">確定申告AI</a>
        <a href="/chat" className="text-sm text-gray-600 hover:text-[#2563EB]">チャットに戻る</a>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold mb-2">料金プラン</h1>
          <p className="text-gray-500 text-sm">確定申告シーズンを、AIと一緒に乗り越えましょう</p>
        </div>

        {/* Free plan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">無料プラン</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">現在のプラン</span>
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold">無料</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            <li>✅ 5回/月まで質問可能</li>
            <li>✅ テキスト・画像・PDF対応</li>
            <li>✅ ステップ形式の回答</li>
          </ul>
          <a
            href="/chat"
            className="block text-center border border-gray-200 text-gray-600 rounded-xl py-3 text-sm font-medium hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
          >
            無料で使う
          </a>
        </div>

        {/* Paid plans */}
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.entries(PLANS) as [keyof typeof PLANS, (typeof PLANS)[keyof typeof PLANS]][]).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`bg-white rounded-2xl border-2 p-6 ${
                  key === 'standard' ? 'border-[#2563EB]' : 'border-gray-200'
                }`}
              >
                {key === 'standard' && (
                  <div className="text-xs text-[#2563EB] font-medium mb-3">⭐ おすすめ</div>
                )}
                <div className="text-sm font-medium text-gray-700 mb-3">{plan.name}</div>
                <div className="mb-2">
                  <span className="text-3xl font-bold">¥{plan.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm ml-1">
                    {plan.interval === 'month' ? '/月' : '/3ヶ月（一括）'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✅ 質問回数 無制限</li>
                  <li>✅ テキスト・画像・PDF対応</li>
                  <li>✅ ステップ形式の回答</li>
                  {key === 'season_pass' && <li>✅ 3ヶ月間有効</li>}
                </ul>
                <form action={createCheckoutSession}>
                  <input type="hidden" name="plan" value={key} />
                  <button
                    type="submit"
                    className={`w-full rounded-xl py-3 text-sm font-medium transition-colors ${
                      key === 'standard'
                        ? 'bg-[#2563EB] text-white hover:bg-blue-700'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    このプランで始める
                  </button>
                </form>
              </div>
            )
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          ※ 決済はStripeが処理します。カード情報は当サービスに保存されません。
          <br />
          ※ サブスクリプションはいつでもキャンセル可能です。
        </p>
      </div>
    </div>
  )
}
