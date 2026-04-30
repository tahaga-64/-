'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="font-bold text-lg mb-2">エラーが発生しました</h2>
        <p className="text-gray-500 text-sm mb-6">もう一度お試しください</p>
        <button
          onClick={reset}
          className="bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          再試行
        </button>
      </div>
    </div>
  )
}
