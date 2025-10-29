'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadAssessmentData } from '@/lib/storage';

interface CategoryRecommendation {
  category: string;
  slug: string;
  description: string;
  skillCount: number;
  isCompleted: boolean;
}

interface RecommendationsClientProps {
  categorySkillCounts: { [key: string]: number };
}

export default function RecommendationsClient({ categorySkillCounts }: RecommendationsClientProps) {
  const router = useRouter();
  const [userType, setUserType] = useState<'science' | 'liberal-arts' | null>(null);
  const [scienceType, setScienceType] = useState<'engineering' | 'operations' | null>(null);
  const [recommendations, setRecommendations] = useState<CategoryRecommendation[]>([]);

  useEffect(() => {
    // ローカルストレージから選択を復元
    const savedUserType = localStorage.getItem('sssa_user_type') as 'science' | 'liberal-arts' | null;
    const savedScienceType = localStorage.getItem('sssa_science_type') as 'engineering' | 'operations' | null;

    // 選択がない場合はホームに戻す
    if (!savedUserType) {
      router.push('/');
      return;
    }

    setUserType(savedUserType);
    setScienceType(savedScienceType);

    // 評価データを読み込んで完了状況を確認
    const assessmentData = loadAssessmentData();
    const completedCategories = Object.keys(assessmentData.assessments);

    // おすすめカテゴリを取得
    const recs = getRecommendations(savedUserType, savedScienceType, completedCategories);
    setRecommendations(recs);
  }, [router, categorySkillCounts]);

  const getRecommendations = (
    userType: 'science' | 'liberal-arts',
    scienceType: 'engineering' | 'operations' | null,
    completedCategories: string[]
  ): CategoryRecommendation[] => {
    const checkCompleted = (category: string) => completedCategories.includes(category);
    const getSkillCount = (categoryName: string) => categorySkillCounts[categoryName] || 0;

    if (userType === 'liberal-arts') {
      return [
        {
          category: 'プログラム創造・組成',
          slug: 'program-creation',
          description: '新しいプログラムの企画・立案に必要なスキル',
          skillCount: getSkillCount('プログラム創造・組成'),
          isCompleted: checkCompleted('プログラム創造・組成'),
        },
        {
          category: 'プロジェクトマネジメント',
          slug: 'project-management',
          description: 'プロジェクトの計画・管理・実行に必要なスキル',
          skillCount: getSkillCount('プロジェクトマネジメント'),
          isCompleted: checkCompleted('プロジェクトマネジメント'),
        },
        {
          category: 'コーポレート',
          slug: 'corporate',
          description: '法務・財務・人事・総務など企業運営に必要なスキル',
          skillCount: getSkillCount('コーポレート'),
          isCompleted: checkCompleted('コーポレート'),
        },
      ];
    }

    if (scienceType === 'engineering') {
      return [
        {
          category: 'プログラム創造・組成',
          slug: 'program-creation',
          description: '新しいプログラムの企画・立案に必要なスキル',
          skillCount: getSkillCount('プログラム創造・組成'),
          isCompleted: checkCompleted('プログラム創造・組成'),
        },
        {
          category: '基盤技術',
          slug: 'foundation-technology',
          description: 'ソフトウェア・AI・データサイエンスなどの技術スキル',
          skillCount: getSkillCount('基盤技術'),
          isCompleted: checkCompleted('基盤技術'),
        },
        {
          category: '設計・解析',
          slug: 'design-analysis',
          description: '構造・電気・熱・機構設計などのエンジニアリングスキル',
          skillCount: getSkillCount('設計・解析'),
          isCompleted: checkCompleted('設計・解析'),
        },
        {
          category: 'プロジェクトマネジメント',
          slug: 'project-management',
          description: 'プロジェクトの計画・管理・実行に必要なスキル',
          skillCount: getSkillCount('プロジェクトマネジメント'),
          isCompleted: checkCompleted('プロジェクトマネジメント'),
        },
      ];
    }

    if (scienceType === 'operations') {
      return [
        {
          category: 'プロジェクトマネジメント',
          slug: 'project-management',
          description: 'プロジェクトの計画・管理・実行に必要なスキル',
          skillCount: getSkillCount('プロジェクトマネジメント'),
          isCompleted: checkCompleted('プロジェクトマネジメント'),
        },
        {
          category: '試験',
          slug: 'testing',
          description: '機能試験・環境試験などの検証スキル',
          skillCount: getSkillCount('試験'),
          isCompleted: checkCompleted('試験'),
        },
        {
          category: '製造・加工',
          slug: 'manufacturing',
          description: '組立・加工などの製造スキル',
          skillCount: getSkillCount('製造・加工'),
          isCompleted: checkCompleted('製造・加工'),
        },
        {
          category: '打上げ・衛星運用',
          slug: 'launch-operations',
          description: '打上げ管制・衛星運用などのオペレーションスキル',
          skillCount: getSkillCount('打上げ・衛星運用'),
          isCompleted: checkCompleted('打上げ・衛星運用'),
        },
      ];
    }

    return [];
  };

  const handleReset = () => {
    if (confirm('選択をリセットしてトップページに戻りますか？')) {
      localStorage.removeItem('sssa_user_type');
      localStorage.removeItem('sssa_science_type');
      router.push('/');
    }
  };

  const getPathLabel = () => {
    if (userType === 'liberal-arts') return '文系（ビジネス系）';
    if (scienceType === 'engineering') return '理系 > エンジニアリング・開発系';
    if (scienceType === 'operations') return '理系 > 運用・製造・現場系';
    return '';
  };

  const completedCount = recommendations.filter(r => r.isCompleted).length;
  const totalCount = recommendations.length;

  if (!userType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          あなたにおすすめのカテゴリ
        </h1>
        <p className="text-xl text-gray-600 mb-2">{getPathLabel()}</p>
        <p className="text-gray-500 mb-4">
          以下のカテゴリから評価を始めましょう。興味のあるカテゴリだけ選んでOKです。
        </p>

        {/* 進捗表示 */}
        {completedCount > 0 && (
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>評価済み</span>
              <span className="font-semibold">{completedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {recommendations.map((rec) => (
          <div
            key={rec.slug}
            className={`bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all ${
              rec.isCompleted ? 'border-2 border-green-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-2xl text-gray-900 flex-1">
                {rec.category}
              </h3>
              {rec.isCompleted && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold ml-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  完了
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-4 text-lg">{rec.description}</p>
            <p className="text-gray-500 mb-6">{rec.skillCount}スキル</p>
            <Link
              href={`/assessment/${rec.slug}`}
              className={`inline-block px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all ${
                rec.isCompleted
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {rec.isCompleted ? '再評価する' : 'このカテゴリを評価する'}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 評価のコツ</h2>
        <ul className="space-y-3 text-gray-700 text-lg">
          <li className="flex gap-3">
            <span className="text-indigo-600">✓</span>
            <span>すべてのカテゴリを評価する必要はありません</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600">✓</span>
            <span>興味のあるカテゴリだけ選んで評価してください</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600">✓</span>
            <span>複数のカテゴリを評価すると、レーダーチャートで比較できます</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600">✓</span>
            <span>評価は自動保存されるので、途中で中断しても大丈夫です</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handleReset}
          className="text-gray-600 hover:text-gray-900 hover:underline font-semibold"
        >
          ← 最初に戻る
        </button>
        <Link
          href="/skills"
          className="text-indigo-600 hover:text-purple-600 hover:underline font-semibold"
        >
          すべてのカテゴリを見る →
        </Link>
      </div>

      {/* 評価結果を見るボタン */}
      {completedCount > 0 && (
        <div className="flex justify-center">
          <Link
            href="/results"
            className="inline-block bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-teal-700 hover:shadow-xl transform hover:scale-105 transition-all"
          >
            評価結果を見る →
          </Link>
        </div>
      )}
    </div>
  );
}
