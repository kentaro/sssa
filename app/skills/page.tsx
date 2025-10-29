import Link from 'next/link';
import { loadSpaceSkillStandard, getCategories, getSkillsByCategory, getCategorySlug } from '@/lib/data-loader';

export default function SkillsPage() {
  const data = loadSpaceSkillStandard();
  const categories = getCategories(data);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          スキル一覧
        </h1>
        <p className="text-gray-600">
          宇宙産業で求められる95のスキル項目をカテゴリ別に確認できます。
          各カテゴリを評価するには「このカテゴリを評価する」ボタンをクリックしてください。
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const skills = getSkillsByCategory(data, category);
          const categorySlug = getCategorySlug(category);

          return (
            <div
              key={category}
              id={category}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* カテゴリヘッダー */}
              <div className="bg-blue-600 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{category}</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {skills.length}スキル
                    </p>
                  </div>
                  <Link
                    href={`/assessment/${categorySlug}`}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                  >
                    このカテゴリを評価する
                  </Link>
                </div>
              </div>

              {/* スキルリスト */}
              <div className="divide-y divide-gray-200">
                {skills.map((skill) => (
                  <div key={skill.number} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                        {skill.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {skill.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {skill.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* フローティングアクションボタン */}
      <div className="fixed bottom-8 right-8">
        <Link
          href="/"
          className="bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
