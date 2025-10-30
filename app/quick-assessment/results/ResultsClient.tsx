'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Loader2,
  Share2,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { quickAssessmentQuestions } from '@/data/quick-assessment-questions';
import {
  calculateRoleScores,
  decodeQuickResult,
  encodeQuickResult,
} from '@/lib/quick-assessment-scoring';
import type {
  QuickAssessmentAnswer,
  QuickAssessmentResult,
  Role,
} from '@/lib/types';

interface ResultsClientProps {
  roles: Role[];
}

const ROLE_TO_CATEGORY: Record<string, string> = {
  '全体統括職': 'プログラム創造・組成',
  '構造系エンジニア': '設計・解析',
  '推進系エンジニア': '設計・解析',
  '電気系エンジニア': '設計・解析',
  '通信系エンジニア': '設計・解析',
  '熱制御系エンジニア': '設計・解析',
  '制御系エンジニア': '設計・解析',
  '飛行解析エンジニア': '設計・解析',
  'データ処理系エンジニア': '基盤技術',
  'ソフトウェア系エンジニア': '基盤技術',
  '試験エンジニア': '試験',
  '品質保証・品質管理エンジニア': '試験',
  '宇宙輸送機・人工衛星製造職': '製造・加工',
  '打上げ管理（宇宙輸送機飛行安全、射場安全、地域の保安）': '打上げ・衛星運用',
  '射場・地上試験設備設計・管理': '打上げ・衛星運用',
  'コーポレート・ビジネス職': 'コーポレート',
};

const CATEGORY_SLUG: Record<string, string> = {
  'プログラム創造・組成': 'program-creation',
  'プロジェクトマネジメント': 'project-management',
  '基盤技術': 'foundation-technology',
  '設計・解析': 'design-analysis',
  '試験': 'testing',
  '製造・加工': 'manufacturing',
  '打上げ・衛星運用': 'launch-operations',
  'コーポレート': 'corporate',
};

function useQuickAssessmentResult(roles: Role[]) {
  const [result, setResult] = useState<QuickAssessmentResult | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      let answers: QuickAssessmentAnswer[] | null = null;

      // まずハッシュから読み込みを試みる（共有URLの場合）
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1);
        if (hash) {
          const roleNumbers = decodeQuickResult(hash);
          const topRoles = roleNumbers
            .map((number) => roles.find((role) => role.number === number))
            .filter((role): role is Role => Boolean(role))
            .map((role) => ({ role, score: 0, percentage: 0 }));

          setResult({ topRoles, answers: [], timestamp: new Date().toISOString() });
          setShareUrl(window.location.href);
          setIsLoading(false);
          return;
        }
      }

      // ハッシュがない場合はlocalStorageから読み込む
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('quick-assessment-answers');
        if (stored) {
          answers = JSON.parse(stored) as QuickAssessmentAnswer[];
        }
      }

      if (!answers || answers.length === 0) {
        setIsLoading(false);
        return;
      }

      const calculated = calculateRoleScores(answers, quickAssessmentQuestions, roles);
      setResult(calculated);

      if (typeof window !== 'undefined') {
        const roleNumbers = calculated.topRoles.map((entry) => entry.role.number);
        const encoded = encodeQuickResult(roleNumbers);
        setShareUrl(`${window.location.origin}${window.location.pathname}#${encoded}`);
      }

      setIsLoading(false);
    };

    loadResult();
  }, [roles]);

  return { result, shareUrl, isLoading };
}

function ResultsContent({ roles }: ResultsClientProps) {
  const { result, shareUrl, isLoading } = useQuickAssessmentResult(roles);

  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const handleShare = async () => {
    if (!shareUrl || !result) {
      toast.error('共有リンクを生成できませんでした');
      return;
    }

    const roleList = result.topRoles
      .slice(0, 3)
      .map((entry, index) => `${index + 1}位「${entry.role.name}」`)
      .join('、');
    const message = roleList
      ? `🚀 宇宙業界適性診断の結果が出ました！私に向いている職種は ${roleList}`
      : '🚀 宇宙業界適性診断の結果が出ました！';

    if (canShare && navigator.share) {
      try {
        await navigator.share({ title: '宇宙スキル標準アセスメント', text: message, url: shareUrl });
        return;
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('共有に失敗しました');
        }
      }
    }

    try {
      await navigator.clipboard.writeText(`${message}\n\n${shareUrl}`);
      toast.success('結果のURLをコピーしました');
    } catch {
      toast.error('コピーに失敗しました');
    }
  };

  const categorizedRoles = useMemo(() => {
    if (!result) return [];
    return result.topRoles.map((entry, index) => {
      const category = ROLE_TO_CATEGORY[entry.role.category.replace(/\n/g, '').trim()] ?? 'カテゴリ不明';
      return {
        rank: index + 1,
        role: entry.role,
        percentage: entry.percentage,
        category,
      };
    });
  }, [result]);

  if (isLoading) {
    return (
      <Card className="mx-auto flex min-h-[320px] max-w-3xl items-center justify-center">
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          診断結果を計算中…
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="mx-auto max-w-3xl border border-border/70 bg-muted/40 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">診断結果が見つかりません</CardTitle>
          <CardDescription>
            診断を完了していないか、保存されている回答が失われています。再度クイック診断を実施してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/quick-assessment">クイック診断に戻る</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">トップページへ</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3 text-center">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em]">
          Quick Assessment
        </Badge>
        <div className="space-y-2">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            <Trophy className="h-8 w-8 text-primary" /> 診断結果
          </h1>
          <p className="text-sm text-muted-foreground">
            あなたに向いている職種の上位候補を表示しています。詳細診断で深掘りしましょう。
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={handleShare} className="gap-2">
            {canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {canShare ? '結果を共有' : '結果URLをコピー'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/quick-assessment">
              もう一度診断する
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6">
        {categorizedRoles.slice(0, 3).map((entry) => {
          const slug = CATEGORY_SLUG[entry.category];
          const percentage = entry.percentage > 0 ? `${entry.percentage}%` : null;

          return (
            <Card key={entry.role.number} className="border border-border/60 shadow-md">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-[11px]">
                    #{entry.rank}
                  </Badge>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {entry.role.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    カテゴリ: {entry.category}
                  </CardDescription>
                </div>
                {percentage && (
                  <div className="text-right">
                    <p className="text-3xl font-semibold text-primary">{percentage}</p>
                    <p className="text-xs text-muted-foreground">適合度</p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {entry.role.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {entry.role.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {slug ? (
                    <Button asChild>
                      <Link href={`/assessment/${slug}`}>関連カテゴリを詳細診断</Link>
                    </Button>
                  ) : null}
                  <Button asChild variant="outline">
                    <Link href="/categories">カテゴリ一覧を見る</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/70 bg-muted/40">
        <CardContent className="flex justify-center py-6">
          <Button variant="default" onClick={handleShare} className="gap-2">
            {canShare ? (
              <>
                <Share2 className="h-4 w-4" />
                結果を共有
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                URLをコピーして共有する
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/">
            トップページへ
          </Link>
        </Button>
        <Button asChild>
          <Link href="/categories">
            詳細診断に進む
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ResultsClient({ roles }: ResultsClientProps) {
  return (
    <Suspense
      fallback={
        <Card className="mx-auto flex min-h-[320px] max-w-3xl items-center justify-center">
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            結果を準備しています…
          </CardContent>
        </Card>
      }
    >
      <ResultsContent roles={roles} />
    </Suspense>
  );
}

