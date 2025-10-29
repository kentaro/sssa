import Link from 'next/link';
import { loadSpaceSkillStandard, getCategories, getSkillCountByCategory } from '@/lib/data-loader';

export default function Home() {
  const data = loadSpaceSkillStandard();
  const categories = getCategories(data);
  const skillCounts = getSkillCountByCategory(data);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヒーローセクション */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          宇宙スキル標準アセスメント
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          あなたのスキルを評価し、宇宙産業でのキャリアパスを見つけましょう
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/skills"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            スキル一覧を見る
          </Link>
          <Link
            href="/about"
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            詳しく知る
          </Link>
        </div>
      </section>

      {/* 宇宙スキル標準について */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          宇宙スキル標準とは
        </h2>
        <p className="text-gray-700 mb-4">
          内閣府宇宙開発戦略推進事務局が公開している、宇宙産業で求められるスキルを体系化した標準です。
          本アプリケーションでは、この標準に基づいて自己評価を行い、自身のスキルレベルを可視化できます。
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>95の専門スキル項目</li>
          <li>8つのスキルカテゴリ</li>
          <li>4つの評価軸（業務範囲・自立性・資格・経験年数）</li>
          <li>5段階のスキルレベル定義</li>
        </ul>
      </section>

      {/* スキルカテゴリ概要 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          スキルカテゴリ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const count = skillCounts.get(category) || 0;
            return (
              <div
                key={category}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {category}
                </h3>
                <p className="text-gray-600 mb-4">{count}スキル</p>
                <Link
                  href={`/skills#${encodeURIComponent(category)}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  詳細を見る →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 使い方 */}
      <section className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          使い方
        </h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <span>
              <strong>スキルを知る:</strong> スキル一覧から興味のあるカテゴリを確認
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <span>
              <strong>自己評価:</strong> カテゴリごとに4つの評価軸で5段階評価
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </span>
            <span>
              <strong>結果確認:</strong> レーダーチャートで強みを可視化し、推奨ロールを確認
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              4
            </span>
            <span>
              <strong>共有:</strong> パーマリンクで結果を他者と共有
            </span>
          </li>
        </ol>
      </section>
    </div>
  );
}
