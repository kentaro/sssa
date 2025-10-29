'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center mb-16 py-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          宇宙スキル標準アセスメント
        </h1>
        <p className="text-2xl text-gray-600 mb-10 leading-relaxed">
          あなたのスキルを評価し、宇宙産業でのキャリアパスを見つけましょう
        </p>
      </section>

      {/* 診断モード選択 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          診断モードを選択してください
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* クイック診断 */}
          <button
            onClick={() => router.push('/quick-assessment')}
            className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl hover:scale-105 transition-all text-left border-2 border-transparent hover:border-indigo-600 group"
          >
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              クイック診断
            </h3>
            <p className="text-gray-600 text-lg mb-4">
              24問の質問に答えるだけで、あなたに向いているカテゴリを診断
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
              <span>所要時間：約5分</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* 詳細診断 */}
          <button
            onClick={() => router.push('/categories')}
            className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl hover:scale-105 transition-all text-left border-2 border-transparent hover:border-purple-600 group"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              詳細診断
            </h3>
            <p className="text-gray-600 text-lg mb-4">
              6つのカテゴリから選んで、詳しく自己評価
            </p>
            <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
              <span>所要時間：カテゴリごとに10-20分</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* 宇宙スキル標準とは */}
      <section className="bg-white rounded-2xl shadow-lg p-10 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          宇宙スキル標準とは
        </h2>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          内閣府宇宙開発戦略推進事務局が公開している、宇宙産業で求められるスキルを体系化した標準です。
          本アプリケーションでは、この標準に基づいて自己評価を行い、自身のスキルレベルを可視化できます。
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
          <li>67の評価可能なスキル項目</li>
          <li>6つの評価可能なスキルカテゴリ</li>
          <li>4つの評価軸（業務範囲・自立性・資格・経験年数）</li>
          <li>5段階のスキルレベル定義</li>
        </ul>
      </section>
    </div>
  );
}
