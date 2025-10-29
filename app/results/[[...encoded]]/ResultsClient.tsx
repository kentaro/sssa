'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadAssessmentData } from '@/lib/storage';
import { decodeAssessmentResult, encodeAssessmentResult, createAssessmentResult, compressAssessmentResult } from '@/lib/permalink';
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
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    let assessmentResult: AssessmentResult | null = null;

    // ハッシュがある場合は共有URLとして扱い、ハッシュのデータを優先
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1); // '#'を除去
      if (hash) {
        assessmentResult = decodeAssessmentResult(hash);
      }
    }

    // ハッシュがない場合のみ、LocalStorageから読み込む（自分の評価結果）
    if (!assessmentResult && typeof window !== 'undefined') {
      const storedData = loadAssessmentData();
      if (Object.keys(storedData.assessments).length > 0) {
        assessmentResult = createAssessmentResult(storedData.assessments);
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

      // パーマリンク生成（圧縮版）
      if (typeof window !== 'undefined') {
        const compressed = compressAssessmentResult(assessmentResult);
        const encoded = encodeAssessmentResult(compressed);
        const basePath = process.env.NODE_ENV === 'production' ? '/sssa' : '';
        const url = `${window.location.origin}${basePath}/results#${encoded}`;
        setPermalink(url);
      }
    }

    setIsLoading(false);
  }, [encodedParam, data]);

  // Web Share API対応チェック
  useEffect(() => {
    if (typeof window !== 'undefined' && 'share' in navigator) {
      setCanShare(true);
    }
  }, []);

  const handleCopyPermalink = async () => {
    if (!permalink || summaries.length === 0) return;

    // Web Share API対応の場合
    if (canShare && navigator.share) {
      try {
        // 評価の高いカテゴリトップ3を取得
        const topCategories = summaries
          .filter(s => s.averageScore > 0)
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 3)
          .map(s => s.category);

        const shareText = topCategories.length > 0
          ? `🚀 宇宙スキル標準で詳細診断を完了！\n\n私の強みは...\n「${topCategories.join('」\n「')}」\n\n✨ あなたも宇宙業界での適性を詳しく診断しませんか？`
          : '🚀 宇宙スキル標準で詳細診断を完了！\n\n✨ あなたも宇宙業界での適性を診断してみませんか？';

        await navigator.share({
          title: '宇宙スキル標準アセスメント',
          text: shareText,
          url: permalink,
        });
      } catch (error) {
        // ユーザーがキャンセルした場合など
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Web Share API非対応の場合はクリップボードにコピー
      try {
        // 評価の高いカテゴリトップ3を取得
        const topCategories = summaries
          .filter(s => s.averageScore > 0)
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 3)
          .map(s => s.category);

        const copyText = topCategories.length > 0
          ? `🚀 宇宙スキル標準で詳細診断を完了！\n\n私の強みは...\n「${topCategories.join('」\n「')}」\n\n✨ あなたも宇宙業界での適性を詳しく診断しませんか？\n\n${permalink}`
          : `🚀 宇宙スキル標準で詳細診断を完了！\n\n✨ あなたも宇宙業界での適性を診断してみませんか？\n\n${permalink}`;

        await navigator.clipboard.writeText(copyText);
        alert('結果をクリップボードにコピーしました！');
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

  // スキルカテゴリからロールカテゴリへのマッピング
  const getRelatedRoleCategoriesForSkillCategory = (skillCategory: string): string[] => {
    const normalized = skillCategory.replace(/\n/g, '').trim();

    // スキルカテゴリとロールカテゴリのマッピング
    const mapping: { [key: string]: string[] } = {
      'プログラム創造・組成': ['全体統括職'],
      'プロジェクトマネジメント': ['全体統括職'],
      '基盤技術': ['ソフトウェア系エンジニア', 'データ処理系エンジニア'],
      '設計・解析': [
        '構造系エンジニア',
        '推進系エンジニア',
        '電気系エンジニア',
        '通信系エンジニア',
        '熱制御系エンジニア',
        '制御系エンジニア',
        '飛行解析エンジニア',
        'データ処理系エンジニア',
        'ソフトウェア系エンジニア',
      ],
      '試験': ['試験エンジニア', '品質保証・品質管理エンジニア'],
      '製造・加工': ['宇宙輸送機・人工衛星製造職'],
      '打上げ・衛星運用': [
        '打上げ管理（宇宙輸送機飛行安全、射場安全、地域の保安）',
        '射場・地上試験設備設計・管理',
      ],
      'コーポレート': ['コーポレート・ビジネス職'],
    };

    return mapping[normalized] || [];
  };

  // カテゴリに関連するロールを取得（スコアに応じて上位のみ表示）
  const getRelatedRolesForCategory = (skillCategory: string, categoryScore: number): Role[] => {
    // スコアが2.0未満の場合は推奨しない
    if (categoryScore < 2.0) {
      return [];
    }

    // スキルカテゴリに対応するロールカテゴリを取得
    const roleCategories = getRelatedRoleCategoriesForSkillCategory(skillCategory);

    // 対応するロールカテゴリのロールをすべて取得
    const relatedRoles = data.roles.filter((role) => {
      const roleCategory = role.category.replace(/\n/g, '').trim();
      return roleCategories.includes(roleCategory);
    });

    // スコアに応じて表示数を決定
    // スコア4.0以上: 最大5件、3.0-3.9: 最大3件、2.0-2.9: 最大2件
    const maxRoles = categoryScore >= 4.0 ? 5 : categoryScore >= 3.0 ? 3 : 2;

    // ロール番号順（データの定義順）で上位のみ返す
    return relatedRoles.slice(0, maxRoles);
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

      {/* 推奨役割 */}
      {topCategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            推奨される役割
          </h2>
          <p className="text-gray-600 mb-4">
            評価の高いカテゴリに基づいて、以下の役割が推奨されます。
            <span className="block text-sm text-gray-500 mt-1">
              ※ スコアが2.0未満のカテゴリは表示されません
            </span>
          </p>

          {topCategories.map((category) => {
            const roles = getRelatedRolesForCategory(category.category, category.averageScore);

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
                          {role.name}
                        </h4>
                        {role.description && (
                          <p className="text-sm text-gray-700 mb-2">
                            {role.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm pl-4">
                    このカテゴリに関連するロールが見つかりません
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
        {!canShare && (
          <>
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
          </>
        )}
        {canShare && (
          <>
            <p className="text-gray-700 mb-4">
              評価結果を共有しましょう。
            </p>
            <button
              onClick={handleCopyPermalink}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              共有
            </button>
          </>
        )}
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
