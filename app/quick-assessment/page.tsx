import Link from 'next/link';

export default function QuickAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-6">🚧</div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          クイック診断
        </h1>

        <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
          準備中
        </div>

        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          24問の質問に答えるだけで、あなたに向いているカテゴリを診断する<br />
          「クイック診断」機能は現在開発中です。
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            🎯 実装予定の機能
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>約5分で完了する24問の質問</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>MBTIスタイルの診断フロー</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>「あなたは〜タイプ！」形式の結果表示</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>向いているカテゴリのトップ3を推薦</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 mb-6">
            現在は詳細診断をご利用いただけます
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/categories"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              詳細診断を始める
            </Link>
            <Link
              href="/"
              className="inline-block bg-white text-gray-700 border-2 border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
