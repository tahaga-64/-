import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 確定申告書インスパイア
        paper: {
          DEFAULT: '#F5F2EB',
          dark: '#EAE6DC',
          light: '#FAF8F4',
        },
        tax: {
          orange: '#EA6B0A',   // 確定申告書のフレーム色（オレンジ）
          'orange-light': '#FEF0E4',
          'orange-dark': '#C45508',
          navy: '#1A3A5C',     // 公印・見出し
          'navy-light': '#264D76',
          stamp: '#B91C1C',    // 朱印（重要事項）
          'stamp-light': '#FEE2E2',
          ink: '#1C1A18',      // 万年筆インク色
          rule: '#C8BEA8',     // 罫線色
          'rule-dark': '#A89E88',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "repeating-linear-gradient(0deg, transparent, transparent 23px, #C8BEA820 24px)",
      },
    },
  },
  plugins: [],
}

export default config
