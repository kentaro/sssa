'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategoryAssessment } from '@/lib/storage';
import type { Skill, EvaluationAxis } from '@/lib/types';

// 評価可能なカテゴリかどうかを判定
function isCategoryAssessable(category: string): boolean {
  const nonAssessableCategories = ['打上げ・衛星運用', 'コーポレート'];
  return !nonAssessableCategories.includes(category);
}

// カテゴリの説明文を取得
function getCategoryDescription(category: string): string {
  const descriptions: { [key: string]: string } = {
    'プログラム創造・組成': '宇宙プログラムの企画立案から組成まで、戦略的な視点でプロジェクトを創造するスキル',
    'プロジェクトマネジメント': 'プロジェクトの計画、実行、監視、制御を通じて目標を達成するマネジメントスキル',
    '基盤技術': 'ソフトウェア開発やデータ処理など、宇宙システムを支える基盤となる技術スキル',
    '設計・解析': '構造、推進、熱、電気など各種システムの設計と解析を行う専門技術スキル',
    '試験': '宇宙機器やシステムの機能・性能を検証するための試験技術スキル',
    '製造・加工': '宇宙機器の製造、加工、組立、品質管理に関する技術スキル',
    '打上げ・衛星運用': 'ロケット打上げや衛星の運用・管制に関する専門スキル',
    'コーポレート': '事業企画、法務、知財、人事など企業経営を支えるビジネススキル',
  };
  return descriptions[category] || '';
}

// カテゴリのアイコンを取得
function getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    'プログラム創造・組成': '🎯',
    'プロジェクトマネジメント': '📊',
    '基盤技術': '💻',
    '設計・解析': '🔧',
    '試験': '🧪',
    '製造・加工': '⚙️',
    '打上げ・衛星運用': '🚀',
    'コーポレート': '💼',
  };
  return icons[category] || '📋';
}

interface CategoriesClientProps {
  categoriesData: Array<{
    category: string;
    categorySlug: string;
    skills: Skill[];
  }>;
  evaluationAxes: EvaluationAxis[];
}

export default function CategoriesClient({ categoriesData, evaluationAxes }: CategoriesClientProps) {
  const [completionStatus, setCompletionStatus] = useState<{ [category: string]: boolean }>({});

  // 各カテゴリの完了状態をチェック
  useEffect(() => {
    const status: { [category: string]: boolean } = {};

    categoriesData.forEach(({ category, skills }) => {
      if (!isCategoryAssessable(category)) {
        status[category] = false;
        return;
      }

      const categoryAssessment = getCategoryAssessment(category);

      // すべてのスキルが完全に評価されているかチェック
      const allComplete = skills.every((skill) => {
        const assessment = categoryAssessment[skill.number];
        if (!assessment) return false;

        // すべての評価軸に対して値が設定されているかチェック
        return evaluationAxes.every((axis) => {
          const value = assessment[axis.number];
          return value !== undefined && value !== null && value >= 0 && value <= 5;
        });
      });

      status[category] = allComplete;
    });

    setCompletionStatus(status);
  }, [categoriesData, evaluationAxes]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          カテゴリから選択
        </h1>
        <p className="text-gray-600">
          評価したいスキルカテゴリを選んで診断を開始してください。6つのカテゴリが評価可能です。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesData.map(({ category, categorySlug, skills }) => {
          const isAssessable = isCategoryAssessable(category);
          const isCompleted = completionStatus[category] || false;
          const icon = getCategoryIcon(category);
          const description = getCategoryDescription(category);

          return (
            <div
              key={category}
              className={`rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg ${
                isAssessable ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className={`p-6 ${
                isAssessable
                  ? isCompleted
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50'
                    : 'bg-gradient-to-br from-indigo-50 to-purple-50'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{icon}</div>
                  {isCompleted && (
                    <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      診断済み
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {category}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{skills.length}スキル項目</span>
                </div>
              </div>

              <div className="p-6">
                {isAssessable ? (
                  <Link
                    href={`/assessment/${categorySlug}`}
                    className={`block w-full text-white text-center px-6 py-3 rounded-lg font-semibold transition ${
                      isCompleted
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isCompleted ? '再診断する' : '診断を開始'}
                  </Link>
                ) : (
                  <div>
                    <div className="bg-gray-200 text-gray-500 text-center px-6 py-3 rounded-lg font-semibold cursor-not-allowed mb-3">
                      評価基準未定義
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <p className="text-xs text-yellow-800 flex items-start gap-1">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>現在評価基準が未定義のため診断できません</span>
                      </p>
                    </div>
                  </div>
                )}
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
