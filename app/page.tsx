import Link from 'next/link';
import { loadSpaceSkillStandard, getCategories, getSkillCountByCategory } from '@/lib/data-loader';

export default function Home() {
  const data = loadSpaceSkillStandard();
  const categories = getCategories(data);
  const skillCounts = getSkillCountByCategory(data);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ヒーローセクション */}
      <section className="text-center mb-16 py-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          宇宙スキル標準アセスメント
        </h1>
        <p className="text-2xl text-gray-600 mb-10 leading-relaxed">
          あなたのスキルを評価し、宇宙産業でのキャリアパスを見つけましょう
        </p>
        <div className="flex gap-6 justify-center">
          <Link
            href="/skills"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all"
          >
            スキル一覧を見る
          </Link>
          <Link
            href="/about"
            className="bg-white text-gray-800 px-10 py-4 rounded-xl font-bold text-lg border-2 border-indigo-300 hover:border-indigo-600 hover:shadow-xl transform hover:scale-105 transition-all"
          >
            詳しく知る
          </Link>
        </div>
      </section>

      {/* 宇宙スキル標準について */}
      <section className="bg-white rounded-2xl shadow-lg p-10 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          宇宙スキル標準とは
        </h2>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          内閣府宇宙開発戦略推進事務局が公開している、宇宙産業で求められるスキルを体系化した標準です。
          本アプリケーションでは、この標準に基づいて自己評価を行い、自身のスキルレベルを可視化できます。
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg">
          <li>95の専門スキル項目</li>
          <li>8つのスキルカテゴリ</li>
          <li>4つの評価軸（業務範囲・自立性・資格・経験年数）</li>
          <li>5段階のスキルレベル定義</li>
        </ul>
      </section>

      {/* スキルカテゴリ概要 */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          スキルカテゴリ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const count = skillCounts.get(category) || 0;
            return (
              <div
                key={category}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all"
              >
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {category}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">{count}スキル</p>
                <Link
                  href={`/skills#${encodeURIComponent(category)}`}
                  className="text-indigo-600 hover:text-purple-600 hover:underline font-semibold text-lg"
                >
                  詳細を見る →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 使い方 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-10 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          使い方
        </h2>
        <ol className="space-y-6 text-gray-700">
          <li className="flex gap-5">
            <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
              1
            </span>
            <span className="text-lg pt-2">
              <strong className="text-gray-900">スキルを知る:</strong> スキル一覧から興味のあるカテゴリを確認
            </span>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
              2
            </span>
            <span className="text-lg pt-2">
              <strong className="text-gray-900">自己評価:</strong> カテゴリごとに4つの評価軸で5段階評価
            </span>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
              3
            </span>
            <span className="text-lg pt-2">
              <strong className="text-gray-900">結果確認:</strong> レーダーチャートで強みを可視化し、推奨ロールを確認
            </span>
          </li>
          <li className="flex gap-5">
            <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
              4
            </span>
            <span className="text-lg pt-2">
              <strong className="text-gray-900">共有:</strong> パーマリンクで結果を他者と共有
            </span>
          </li>
        </ol>
      </section>
    </div>
  );
}
