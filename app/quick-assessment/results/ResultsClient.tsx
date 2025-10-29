'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { quickAssessmentQuestions } from '@/data/quick-assessment-questions';
import {
  calculateRoleScores,
  encodeQuickResult,
  decodeQuickResult,
} from '@/lib/quick-assessment-scoring';
import type { QuickAssessmentAnswer, QuickAssessmentResult, Role } from '@/lib/types';

// カテゴリ名からスラッグを生成
function getCategorySlug(category: string): string {
  const slugMap: { [key: string]: string } = {
    'プログラム創造・組成': 'program-creation',
    'プロジェクトマネジメント': 'project-management',
    '基盤技術': 'foundation-technology',
    '設計・解析': 'design-analysis',
    '試験': 'testing',
    '製造・加工': 'manufacturing',
    '打上げ・衛星運用': 'launch-operations',
    'コーポレート': 'corporate',
  };
  return slugMap[category] || 'categories';
}

interface ResultsClientProps {
  roles: Role[];
}

function ResultsContent({ roles }: ResultsClientProps) {
  const router = useRouter();
  const [result, setResult] = useState<QuickAssessmentResult | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ハッシュからロール番号を取得（共有URL経由）
    let rolesParam: string | null = null;
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1); // '#'を除去
      if (hash) {
        rolesParam = hash;
      }
    }

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

        // 共有URL生成（ハッシュ形式）
        const roleNumbers = calculatedResult.topRoles.map(r => r.role.number);
        const encoded = encodeQuickResult(roleNumbers);
        // 現在のパスからbasePathを取得してURLを生成
        const currentPath = window.location.pathname;
        const basePath = currentPath.includes('/sssa/') ? '/sssa' : '';
        const url = `${window.location.origin}${basePath}/quick-assessment/results/#${encoded}`;
        setShareUrl(url);

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to calculate results:', error);
        router.push('/quick-assessment');
      }
    }
  }, [router, roles]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShare = async () => {
    if (!shareUrl || !result) return;

    // Web Share API対応チェック
    if (navigator.share) {
      try {
        // トップ3の役割名を取得
        const topRoleNames = result.topRoles.slice(0, 3).map(r => r.role.name);
        const rolesList = topRoleNames.length >= 3
          ? `1位「${topRoleNames[0]}」、2位「${topRoleNames[1]}」、3位「${topRoleNames[2]}」`
          : topRoleNames.length === 2
          ? `1位「${topRoleNames[0]}」、2位「${topRoleNames[1]}」`
          : `1位「${topRoleNames[0]}」`;

        const shareText = `宇宙業界での私の適性診断結果\n\n${rolesList}\n\nあなたはどのタイプ？診断してみよう！`;

        await navigator.share({
          title: '宇宙スキル標準アセスメント',
          text: shareText,
          url: shareUrl,
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
        // トップ3の役割名を取得
        const topRoleNames = result.topRoles.slice(0, 3).map(r => r.role.name);
        const rolesList = topRoleNames.length >= 3
          ? `1位「${topRoleNames[0]}」、2位「${topRoleNames[1]}」、3位「${topRoleNames[2]}」`
          : topRoleNames.length === 2
          ? `1位「${topRoleNames[0]}」、2位「${topRoleNames[1]}」`
          : `1位「${topRoleNames[0]}」`;

        const copyText = `宇宙業界での私の適性診断結果\n\n${rolesList}\n\nあなたはどのタイプ？診断してみよう！\n\n${shareUrl}`;

        await navigator.clipboard.writeText(copyText);
        alert('結果をクリップボードにコピーしました！');
      } catch (error) {
        alert('コピーに失敗しました。手動でコピーしてください。');
      }
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
          あなたに向いている役割 TOP3
        </p>
      </div>

      {/* トップ3の役割 */}
      <div className="space-y-6 mb-8">
        {result.topRoles.map((roleResult, index) => (
          <div
            key={roleResult.role.number}
            className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 ${
              index === 0
                ? 'border-yellow-400'
                : index === 1
                ? 'border-gray-300'
                : 'border-orange-300'
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

            {/* 役割情報 */}
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
                href={`/categories/${getCategorySlug(roleResult.role.category)}`}
                className="flex-1 bg-indigo-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                この役割に必要なスキルを診断
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
