import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: 'MoneyWise JP | 税金・年金・保険をかんたん解決',
  description:
    '確定申告・税金・年金・社会保険のあらゆる疑問をAIが解決。損得シミュレーター・申告要否判定・控除チェッカーで日本の社会人を徹底サポート。',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="font-sans bg-paper text-tax-ink antialiased">
        {children}
      </body>
    </html>
  )
}
