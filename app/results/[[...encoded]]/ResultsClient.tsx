'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadAssessmentData } from '@/lib/storage';
import { decodeAssessmentResult, encodeAssessmentResult, createAssessmentResult } from '@/lib/permalink';
import { calculateAllCategorySummaries, getTopCategories } from '@/lib/assessment-utils';
import CategoryRadarChart from '@/components/CategoryRadarChart';
import type { AssessmentResult, CategorySummary, SpaceSkillStandard, Role } from '@/lib/types';

interface ResultsClientProps {
  encodedParam?: string;
  data: SpaceSkillStandard;
}

export default function ResultsClient({ encodedParam, data }: ResultsClientProps) {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [summaries, setSummaries] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [permalink, setPermalink] = useState('');

  useEffect(() => {
    let assessmentResult: AssessmentResult | null = null;

    // 常にLocalStorageから全カテゴリのデータを読み込む
    if (typeof window !== 'undefined') {
      const storedData = loadAssessmentData();
      if (Object.keys(storedData.assessments).length > 0) {
        assessmentResult = createAssessmentResult(storedData.assessments);
      }
    }

    // LocalStorageにデータがない場合のみ、ハッシュから読み取り（共有URL用）
    if (!assessmentResult && typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1); // '#'を除去
      if (hash) {
        assessmentResult = decodeAssessmentResult(hash);
      }
    }

    if (assessmentResult) {
      setResult(assessmentResult);

      // サマリーを計算
      const calculatedSummaries = calculateAllCategorySummaries(
        data,
        assessmentResult.assessments
      );
      setSummaries(calculatedSummaries);

      // パーマリンク生成
      if (typeof window !== 'undefined') {
        const encoded = encodeAssessmentResult(assessmentResult);
        const basePath = process.env.NODE_ENV === 'production' ? '/sssa' : '';
        const url = `${window.location.origin}${basePath}/results#${encoded}`;
        setPermalink(url);
      }
    }

    setIsLoading(false);
  }, [encodedParam, data]);

  const handleCopyPermalink = async () => {
    if (permalink) {
      try {
        await navigator.clipboard.writeText(permalink);
        alert('パーマリンクをクリップボードにコピーしました！');
      } catch (error) {
        console.error('Failed to copy permalink:', error);
        alert('コピーに失敗しました');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!result || summaries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            評価データがありません
          </h2>
          <p className="text-yellow-700 mb-4">
            まだアセスメントを実施していないか、URLが無効です。
          </p>
          <Link
            href="/skills"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            スキル一覧からアセスメントを開始
          </Link>
        </div>
      </div>
    );
  }

  const topCategories = getTopCategories(summaries, 3);

  // カテゴリに関連するロールを取得
  const getRelatedRolesForCategory = (category: string): Role[] => {
    const normalizedCategory = category.replace(/\n/g, '').trim();

    // role_descriptionはスキル番号を示しているので、
    // そのスキル番号からカテゴリを取得してマッチング
    return data.roles.filter((role) => {
      // role_descriptionをスキル番号として解釈
      const skillNumber = parseInt(role.role_description, 10);
      if (isNaN(skillNumber)) return false;

      // スキル番号に対応するスキルを検索
      const skill = data.skills.find(s => s.number === skillNumber);
      if (!skill) return false;

      // スキルのカテゴリと比較
      return skill.category.replace(/\n/g, '').trim() === normalizedCategory;
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          アセスメント結果
        </h1>
        <p className="text-gray-600">
          評価日時: {new Date(result.timestamp).toLocaleString('ja-JP')}
        </p>
      </div>

      {/* カテゴリ別サマリー */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          カテゴリ別サマリー
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((summary) => {
            const isEvaluated = summary.assessedSkillCount > 0;

            return (
              <div
                key={summary.category}
                className={`rounded-lg shadow-md p-6 ${
                  isEvaluated ? 'bg-white' : 'bg-gray-50 border-2 border-dashed border-gray-300'
                }`}
              >
                <h3 className="font-bold text-gray-900 mb-2">{summary.category}</h3>
                {isEvaluated ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-indigo-600">
                        {summary.averageScore.toFixed(1)}
                      </span>
                      <span className="text-gray-600">/ 5.0</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        評価済み: {summary.assessedSkillCount} / {summary.skillCount}スキル
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${summary.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-400">
                        未評価
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>{summary.skillCount}スキル</p>
                      <p className="mt-2 text-xs">このカテゴリはまだ評価されていません</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* レーダーチャート */}
      <div className="mb-8">
        <CategoryRadarChart summaries={summaries} />
      </div>

      {/* 推奨ロール */}
      {topCategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            推奨ロール
          </h2>
          <p className="text-gray-600 mb-4">
            評価の高いカテゴリに基づいて、以下のロールが推奨されます：
          </p>

          {topCategories.map((category) => {
            const roles = getRelatedRolesForCategory(category.category);

            return (
              <div key={category.category} className="mb-6 last:mb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {category.category}
                  </div>
                  <span className="text-blue-600 font-bold">
                    平均スコア: {category.averageScore.toFixed(1)}
                  </span>
                </div>

                {roles.length > 0 ? (
                  <div className="space-y-3 pl-4 border-l-4 border-blue-200">
                    {roles.map((role, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">
                          {role.role_name}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {role.role_description}
                        </p>
                        {role.required_skills && (
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">必要スキル: </span>
                            {role.required_skills}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm pl-4">
                    このカテゴリに関連するロール情報はありません
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 共有セクション */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">結果を共有</h2>
        <p className="text-gray-700 mb-4">
          以下のURLで、この評価結果を他者と共有できます。
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={permalink}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-mono"
          />
          <button
            onClick={handleCopyPermalink}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            コピー
          </button>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-center gap-4">
        <Link
          href="/skills"
          className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          スキル一覧に戻る
        </Link>
        <Link
          href="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          トップページ
        </Link>
      </div>
    </div>
  );
}
