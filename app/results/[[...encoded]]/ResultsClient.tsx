'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Loader2,
  Share2,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { toast } from 'sonner';

import CategoryRadarChart from '@/components/CategoryRadarChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AssessmentResult, CategorySummary, SpaceSkillStandard } from '@/lib/types';
import {
  calculateAllCategorySummaries,
  getTopCategories,
} from '@/lib/assessment-utils';
import { compressAssessmentResult, createAssessmentResult, decodeAssessmentResult, encodeAssessmentResult } from '@/lib/permalink';
import { loadAssessmentData } from '@/lib/storage';

interface ResultsClientProps {
  data: SpaceSkillStandard;
}

const SKILL_TO_ROLE: Record<string, string[]> = {
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

export default function ResultsClient({ data }: ResultsClientProps) {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [summaries, setSummaries] = useState<CategorySummary[]>([]);
  const [permalink, setPermalink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let assessmentResult: AssessmentResult | null = null;

    const hash = window.location.hash.substring(1);
    if (hash) {
      assessmentResult = decodeAssessmentResult(hash);
    }

    if (!assessmentResult) {
      const storedData = loadAssessmentData();
      if (Object.keys(storedData.assessments).length > 0) {
        assessmentResult = createAssessmentResult(storedData.assessments);
      }
    }

    if (!assessmentResult) {
      setResult(null);
      setSummaries([]);
      setPermalink('');
      setIsLoading(false);
      return;
    }

    const calculatedSummaries = calculateAllCategorySummaries(
      data,
      assessmentResult.assessments
    );

    const compressed = compressAssessmentResult(assessmentResult);
    const encoded = encodeAssessmentResult(compressed);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;

    setResult(assessmentResult);
    setSummaries(calculatedSummaries);
    setPermalink(url);
    setIsLoading(false);
  }, [data]);

  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const topCategories = useMemo(() => getTopCategories(summaries, 3), [summaries]);

  const relatedRoles = useMemo(() => {
    return topCategories
      .filter((summary) => summary.averageScore >= 2.0)
      .map((summary) => {
        const categories = SKILL_TO_ROLE[summary.category] ?? [];
        const roles = data.roles.filter((role) =>
          categories.includes(role.category.replace(/\n/g, '').trim())
        );

        const maxRoles = summary.averageScore >= 4 ? 5 : summary.averageScore >= 3 ? 3 : 2;
        return {
          category: summary.category,
          score: summary.averageScore,
          roles: roles.slice(0, maxRoles),
        };
      });
  }, [data.roles, topCategories]);

  const handleShare = async () => {
    if (!permalink || !result) {
      toast.error('共有リンクを生成できませんでした');
      return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    const topThree = topCategories
      .filter((c) => c.averageScore > 0)
      .slice(0, 3)
      .map((c, index) => `${medals[index]} ${index + 1}位「${c.category}」(${c.averageScore.toFixed(1)})`)
      .join('\n');

    const shareText = topThree
      ? `🚀 宇宙スキル標準で詳細診断を完了しました！\n\n【私の強みカテゴリTOP3】\n${topThree}\n\nあなたも宇宙業界でのスキルを診断してみませんか？`
      : '🚀 宇宙スキル標準で詳細診断を完了しました！';

    if (canShare && navigator.share) {
      try {
        await navigator.share({ title: '宇宙スキル標準アセスメント', text: shareText, url: permalink });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('共有に失敗しました');
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${permalink}`);
      toast.success('結果のURLをコピーしました');
    } catch (error) {
      console.error(error);
      toast.error('コピーに失敗しました');
    }
  };

  if (isLoading) {
    return (
      <Card className="mx-auto flex min-h-[320px] max-w-3xl items-center justify-center">
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          結果を計算中…
        </CardContent>
      </Card>
    );
  }

  if (!result || summaries.length === 0) {
    return (
      <Card className="mx-auto max-w-3xl border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <TriangleAlert className="h-5 w-5" />
            評価データが見つかりません
          </CardTitle>
          <CardDescription className="text-amber-800">
            まだ詳細診断を実施していないか、共有リンクが無効です。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/categories">詳細診断を始める</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/quick-assessment">クイック診断に戻る</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em]">
            Assessment Result
          </Badge>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              アセスメント結果
            </h1>
            <p className="text-sm text-muted-foreground">
              評価日時: {new Date(result.timestamp).toLocaleString('ja-JP')}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleShare} className="gap-2">
          {canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {canShare ? '共有する' : 'URLをコピー'}
        </Button>
      </header>

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            評価サマリー
          </CardTitle>
          <CardDescription>
            各カテゴリの平均スコアと評価済みスキル数をまとめています。スコアは5段階で表示されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {summaries.map((summary) => {
              const isEvaluated = summary.assessedSkillCount > 0;
              const completion = Math.round(summary.completionRate);

              return (
                <Card
                  key={summary.category}
                  className="border border-border/60 bg-card/80 shadow-sm"
                >
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                      {summary.category}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {summary.assessedSkillCount} / {summary.skillCount} スキル評価
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-primary">
                        {isEvaluated ? summary.averageScore.toFixed(1) : '—'}
                      </span>
                      <span className="text-sm text-muted-foreground">/ 5.0</span>
                    </div>
                    <Progress value={isEvaluated ? completion : 0} />
                    <p className="text-xs text-muted-foreground">
                      完了率 {completion}%
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        disabled={!CATEGORY_SLUG[summary.category]}
                      >
                        <Link href={`/assessment/${CATEGORY_SLUG[summary.category] ?? ''}`}>
                          詳細診断を続ける
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground"
                      >
                        <Link href={`/categories`}>カテゴリに戻る</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">カテゴリレーダーチャート</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            各カテゴリの平均スコアをレーダーチャートで可視化しています。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryRadarChart summaries={summaries} />
        </CardContent>
      </Card>

      {relatedRoles.some((entry) => entry.roles.length > 0) && (
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">推奨される職種</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              評価が高かったカテゴリに基づき、関連する職種を提案します。スコアが2.0未満のカテゴリは対象外です。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {relatedRoles.map(({ category, score, roles }) =>
              roles.length > 0 ? (
                <div key={category} className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-dashed px-3 py-1 text-xs">
                      {category}
                    </Badge>
                    <span className="text-sm font-semibold text-primary">
                      平均スコア {score.toFixed(1)}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {roles.map((role) => (
                      <Card key={role.number} className="border border-border/60 bg-muted/20 shadow-none">
                        <CardHeader className="space-y-1">
                          <CardTitle className="flex items-baseline justify-between text-sm font-semibold">
                            <span>{role.name}</span>
                            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px]">
                              #{role.number}
                            </Badge>
                          </CardTitle>
                          {role.description && (
                            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                              {role.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>
      )}

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
          <Link href="/skills">
            スキル一覧へ戻る
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">
            トップページへ
          </Link>
        </Button>
      </div>
    </div>
  );
}

