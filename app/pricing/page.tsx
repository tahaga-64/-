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

  const { data: { user } } = await supabase.auth.getUser()
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
    <div className="min-h-screen bg-paper">
      {/* ヘッダー */}
      <header className="bg-tax-navy text-white">
        <div className="h-1 bg-tax-orange" />
        <div className="px-4 py-4 flex items-center justify-between max-w-2xl mx-auto">
          <a href="/" className="font-bold text-white tracking-wide">確定申告AI</a>
          <a href="/chat" className="text-sm text-white/60 hover:text-white transition-colors">
            ← チャットに戻る
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* タイトル：申告書の様式番号風 */}
        <div className="text-center mb-8">
          <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-1">PLAN SELECTION</p>
          <h1 className="text-2xl font-bold text-tax-ink">料金プラン</h1>
          <div className="w-16 h-0.5 bg-tax-orange mx-auto mt-2" />
          <p className="text-tax-ink/60 text-sm mt-3">
            確定申告シーズンを、AIと一緒に乗り越えましょう
          </p>
        </div>

        {/* 無料プラン */}
        <div className="bg-paper-light border border-tax-rule rounded mb-4 overflow-hidden">
          <div className="bg-paper-dark border-b border-tax-rule px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-tax-ink tracking-wider">無料プラン</span>
            <span className="text-[10px] text-tax-ink/50 border border-tax-rule px-2 py-0.5 font-mono">
              現在のプラン
            </span>
          </div>
          <div className="px-5 py-4">
            <div className="mb-3">
              <span className="text-3xl font-bold text-tax-ink">¥0</span>
              <span className="text-tax-ink/50 text-sm ml-1">/月</span>
            </div>
            <ul className="space-y-1.5 text-sm text-tax-ink/70 mb-4 border-b border-tax-rule pb-4">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-tax-rule flex items-center justify-center text-[10px] text-tax-orange">✓</span>
                月5回まで質問可能
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-tax-rule flex items-center justify-center text-[10px] text-tax-orange">✓</span>
                テキスト・画像・PDF対応
              </li>
            </ul>
            <a
              href="/chat"
              className="block text-center border border-tax-rule text-tax-ink/60 rounded py-2.5 text-sm hover:border-tax-orange hover:text-tax-orange transition-colors"
            >
              このまま無料で使う
            </a>
          </div>
        </div>

        {/* 有料プラン */}
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.entries(PLANS) as [keyof typeof PLANS, (typeof PLANS)[keyof typeof PLANS]][]).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`rounded overflow-hidden ${
                  key === 'standard'
                    ? 'border-2 border-tax-orange'
                    : 'border border-tax-rule'
                }`}
              >
                {/* プランヘッダー */}
                <div
                  className={`px-5 py-3 border-b ${
                    key === 'standard'
                      ? 'bg-tax-orange border-tax-orange-dark'
                      : 'bg-tax-navy border-tax-navy'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wider">{plan.name}</span>
                    {key === 'standard' && (
                      <span className="text-[10px] bg-white text-tax-orange font-bold px-2 py-0.5 rounded">
                        おすすめ
                      </span>
                    )}
                  </div>
                </div>

                {/* プラン詳細 */}
                <div className="bg-paper-light px-5 py-4">
                  <div className="mb-1">
                    <span className="text-3xl font-bold text-tax-ink">
                      ¥{plan.price.toLocaleString()}
                    </span>
                    <span className="text-tax-ink/50 text-sm ml-1">
                      {plan.interval === 'month' ? '/月' : '/3ヶ月（一括）'}
                    </span>
                  </div>
                  <p className="text-xs text-tax-ink/50 mb-4 border-b border-tax-rule pb-3">
                    {plan.description}
                  </p>
                  <ul className="space-y-1.5 text-sm text-tax-ink/70 mb-5">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-tax-rule flex items-center justify-center text-[10px] text-tax-orange">✓</span>
                      質問回数 <span className="font-bold text-tax-ink">無制限</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-tax-rule flex items-center justify-center text-[10px] text-tax-orange">✓</span>
                      テキスト・画像・PDF対応
                    </li>
                    {key === 'season_pass' && (
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-tax-rule flex items-center justify-center text-[10px] text-tax-orange">✓</span>
                        3ヶ月間有効
                      </li>
                    )}
                  </ul>
                  <form action={createCheckoutSession}>
                    <input type="hidden" name="plan" value={key} />
                    <button
                      type="submit"
                      className={`w-full rounded py-3 text-sm font-bold transition-colors tracking-wider ${
                        key === 'standard'
                          ? 'bg-tax-orange text-white hover:bg-tax-orange-dark'
                          : 'bg-tax-navy text-white hover:bg-tax-navy-light'
                      }`}
                    >
                      このプランで申し込む
                    </button>
                  </form>
                </div>
              </div>
            )
          )}
        </div>

        {/* 注意事項：申告書の注意書き風 */}
        <div className="mt-8 border border-tax-rule rounded bg-paper-light p-4">
          <p className="text-[10px] text-tax-ink/40 font-mono tracking-widest mb-2">【ご注意事項】</p>
          <p className="text-xs text-tax-ink/50 leading-relaxed">
            ・決済はStripeが処理します。カード情報は当サービスに保存されません。<br />
            ・サブスクリプションはいつでもキャンセル可能です。<br />
            ・シーズンパスはご購入から3ヶ月間有効です。
          </p>
        </div>
      </div>
    </div>
  )
}
