'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loadAssessmentData } from '@/lib/storage';
import { calculateCategorySummary } from '@/lib/assessment-utils';

interface CategoryRecommendation {
  category: string;
  slug: string;
  description: string;
  isCompleted: boolean;
}

function AssessmentProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const completedCategory = searchParams.get('completed');

  const [userType, setUserType] = useState<'science' | 'liberal-arts' | null>(null);
  const [scienceType, setScienceType] = useState<'engineering' | 'operations' | null>(null);
  const [recommendations, setRecommendations] = useState<CategoryRecommendation[]>([]);
  const [completionStats, setCompletionStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    // ローカルストレージから選択を復元
    const savedUserType = localStorage.getItem('sssa_user_type') as 'science' | 'liberal-arts' | null;
    const savedScienceType = localStorage.getItem('sssa_science_type') as 'engineering' | 'operations' | null;

    setUserType(savedUserType);
    setScienceType(savedScienceType);

    // 評価データを読み込んで完了状況を確認
    const assessmentData = loadAssessmentData();
    const allCategories = Object.keys(assessmentData.assessments);

    // おすすめカテゴリを取得
    const recs = getRecommendations(savedUserType, savedScienceType, allCategories);
    setRecommendations(recs);

    // 完了統計を計算
    const completed = recs.filter(r => r.isCompleted).length;
    setCompletionStats({ total: recs.length, completed });
  }, []);

  const getRecommendations = (
    userType: 'science' | 'liberal-arts' | null,
    scienceType: 'engineering' | 'operations' | null,
    completedCategories: string[]
  ): CategoryRecommendation[] => {
    const checkCompleted = (category: string) => completedCategories.includes(category);

    if (userType === 'liberal-arts') {
      return [
        {
          category: 'プログラム創造・組成',
          slug: 'program-creation',
          description: '新しいプログラムの企画・立案',
          isCompleted: checkCompleted('プログラム創造・組成'),
        },
        {
          category: 'プロジェクトマネジメント',
          slug: 'project-management',
          description: 'プロジェクトの計画・管理・実行',
          isCompleted: checkCompleted('プロジェクトマネジメント'),
        },
        {
          category: 'コーポレート',
          slug: 'corporate',
          description: '法務・財務・人事・総務など',
          isCompleted: checkCompleted('コーポレート'),
        },
      ];
    }

    if (scienceType === 'engineering') {
      return [
        {
          category: 'プログラム創造・組成',
          slug: 'program-creation',
          description: '新しいプログラムの企画・立案',
          isCompleted: checkCompleted('プログラム創造・組成'),
        },
        {
          category: '基盤技術',
          slug: 'foundation-technology',
          description: 'ソフトウェア・AI・データサイエンス',
          isCompleted: checkCompleted('基盤技術'),
        },
        {
          category: '設計・解析',
          slug: 'design-analysis',
          description: '構造・電気・熱・機構設計',
          isCompleted: checkCompleted('設計・解析'),
        },
        {
          category: 'プロジェクトマネジメント',
          slug: 'project-management',
          description: 'プロジェクトの計画・管理・実行',
          isCompleted: checkCompleted('プロジェクトマネジメント'),
        },
      ];
    }

    if (scienceType === 'operations') {
      return [
        {
          category: 'プロジェクトマネジメント',
          slug: 'project-management',
          description: 'プロジェクトの計画・管理・実行',
          isCompleted: checkCompleted('プロジェクトマネジメント'),
        },
        {
          category: '試験',
          slug: 'testing',
          description: '機能試験・環境試験',
          isCompleted: checkCompleted('試験'),
        },
        {
          category: '製造・加工',
          slug: 'manufacturing',
          description: '組立・加工',
          isCompleted: checkCompleted('製造・加工'),
        },
        {
          category: '打上げ・衛星運用',
          slug: 'launch-operations',
          description: '打上げ管制・衛星運用',
          isCompleted: checkCompleted('打上げ・衛星運用'),
        },
      ];
    }

    return [];
  };

  const getPathLabel = () => {
    if (userType === 'liberal-arts') return '文系（ビジネス系）';
    if (scienceType === 'engineering') return '理系 > エンジニアリング・開発系';
    if (scienceType === 'operations') return '理系 > 運用・製造・現場系';
    return '';
  };

  const nextCategory = recommendations.find(r => !r.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* 完了メッセージ */}
          {completedCategory && (
            <div className="mb-8 p-6 bg-green-500/20 border border-green-400/30 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-white">評価完了！</h2>
              </div>
              <p className="text-white/90 text-lg">
                「{completedCategory}」の評価が完了しました
              </p>
            </div>
          )}

          {/* 進捗状況 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm mb-1">選択したパス</p>
                <p className="text-white font-semibold text-lg">{getPathLabel()}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm mb-1">評価進捗</p>
                <p className="text-white font-bold text-2xl">
                  {completionStats.completed} / {completionStats.total}
                </p>
              </div>
            </div>

            {/* プログレスバー */}
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${(completionStats.completed / completionStats.total) * 100}%` }}
              />
            </div>
          </div>

          {/* おすすめカテゴリ */}
          <div className="mb-8">
            <h3 className="text-white text-xl font-bold mb-4">あなたにおすすめのカテゴリ</h3>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.slug}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    rec.isCompleted
                      ? 'bg-green-500/10 border-green-400/30'
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        {rec.isCompleted ? (
                          <svg className="w-6 h-6 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-white/40 flex-shrink-0" />
                        )}
                        <h4 className="text-white font-bold text-lg">{rec.category}</h4>
                      </div>
                      <p className="text-white/70 text-sm ml-9">{rec.description}</p>
                    </div>
                    {!rec.isCompleted && (
                      <Link
                        href={`/assessment/${rec.slug}`}
                        className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold whitespace-nowrap"
                      >
                        評価する
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            {nextCategory && (
              <Link
                href={`/assessment/${nextCategory.slug}`}
                className="block w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl text-center font-bold text-lg"
              >
                次のカテゴリを評価する（{nextCategory.category}）
              </Link>
            )}

            <Link
              href="/results"
              className="block w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors text-center font-semibold border-2 border-white/30"
            >
              これまでの評価結果を見る
            </Link>

            <Link
              href="/skills"
              className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl transition-colors text-center"
            >
              すべてのカテゴリを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentProgressPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    }>
      <AssessmentProgressContent />
    </Suspense>
  );
}
