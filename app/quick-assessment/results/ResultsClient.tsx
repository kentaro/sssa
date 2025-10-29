'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { quickAssessmentQuestions } from '@/data/quick-assessment-questions';
import {
  calculateRoleScores,
  encodeQuickResult,
  decodeQuickResult,
} from '@/lib/quick-assessment-scoring';
import type { QuickAssessmentAnswer, QuickAssessmentResult, Role } from '@/lib/types';

interface ResultsClientProps {
  roles: Role[];
}

function ResultsContent({ roles }: ResultsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<QuickAssessmentResult | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // URLパラメータからロール番号を取得（共有URL経由）
    const rolesParam = searchParams.get('roles');

    if (rolesParam) {
      // 共有URL経由：ロール番号から結果を復元
      const roleNumbers = decodeQuickResult(rolesParam);

      const topRoles = roleNumbers.map(num => {
        const role = roles.find(r => r.number === num);
        if (!role) return null;
        return {
          role,
          score: 0, // 共有URLからはスコアを復元できない
          percentage: 0,
        };
      }).filter(Boolean) as QuickAssessmentResult['topRoles'];

      setResult({
        topRoles,
        answers: [],
        timestamp: new Date().toISOString(),
      });

      setShareUrl(window.location.href);
      setIsLoading(false);
    } else {
      // LocalStorageから回答を取得して計算
      const answersStr = localStorage.getItem('quick-assessment-answers');
      if (!answersStr) {
        // 回答がない場合はトップページにリダイレクト
        router.push('/quick-assessment');
        return;
      }

      try {
        const answers: QuickAssessmentAnswer[] = JSON.parse(answersStr);

        // スコア計算
        const calculatedResult = calculateRoleScores(
          answers,
          quickAssessmentQuestions,
          roles
        );

        setResult(calculatedResult);

        // 共有URL生成
        const roleNumbers = calculatedResult.topRoles.map(r => r.role.number);
        const encoded = encodeQuickResult(roleNumbers);
        const url = `${window.location.origin}/quick-assessment/results?roles=${encoded}`;
        setShareUrl(url);

        // LocalStorageから回答をクリア
        localStorage.removeItem('quick-assessment-answers');

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to calculate results:', error);
        router.push('/quick-assessment');
      }
    }
  }, [searchParams, router, roles]);

  const handleShare = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('結果のURLをクリップボードにコピーしました！');
    } catch (error) {
      alert('URLのコピーに失敗しました。手動でコピーしてください。');
    }
  };

  if (isLoading || !result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">結果を計算中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          診断結果
        </h1>
        <p className="text-xl text-gray-600">
          あなたに向いているロール TOP3
        </p>
      </div>

      {/* トップ3のロール */}
      <div className="space-y-6 mb-8">
        {result.topRoles.map((roleResult, index) => (
          <div
            key={roleResult.role.number}
            className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 ${
              index === 0
                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50'
                : index === 1
                ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50'
                : 'border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50'
            }`}
          >
            {/* ランクバッジ */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-full ${
                  index === 0
                    ? 'bg-yellow-400 text-yellow-900'
                    : index === 1
                    ? 'bg-gray-400 text-gray-900'
                    : 'bg-orange-400 text-orange-900'
                }`}
              >
                #{index + 1}
              </div>
              {roleResult.percentage > 0 && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {roleResult.percentage}%
                  </div>
                  <div className="text-sm text-gray-600">適合度</div>
                </div>
              )}
            </div>

            {/* ロール情報 */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {roleResult.role.name}
              </h2>
              <div className="text-sm text-gray-600 mb-3">
                {roleResult.role.category}
              </div>
              <p className="text-gray-700 leading-relaxed">
                {roleResult.role.description}
              </p>
            </div>

            {/* アクション */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/categories"
                className="flex-1 bg-indigo-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                このロールに必要なスキルを診断
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* アクションボタン */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          次のステップ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/quick-assessment"
            className="bg-white border-2 border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            もう一度診断する
          </Link>
          <button
            onClick={handleShare}
            className="bg-white border-2 border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            結果を共有
          </button>
          <Link
            href="/categories"
            className="bg-purple-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            詳細診断を受ける
          </Link>
        </div>
      </div>

      {/* トップに戻る */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-800 transition underline"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}

export default function ResultsClient({ roles }: ResultsClientProps) {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">結果を計算中...</div>
        </div>
      </div>
    }>
      <ResultsContent roles={roles} />
    </Suspense>
  );
}
