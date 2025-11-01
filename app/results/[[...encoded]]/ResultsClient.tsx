'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Loader2,
  Share2,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageContainer } from '@/components/PageContainer';
import { useKidsMode } from '@/lib/kids-mode-context';
import type { AssessmentResult, CategorySummary, KidsSpaceContent, SpaceSkillStandard } from '@/lib/types';
import {
  calculateAllCategorySummaries,
  getTopCategories,
} from '@/lib/assessment-utils';
import { compressAssessmentResult, createAssessmentResult, decodeAssessmentResult, encodeAssessmentResult } from '@/lib/permalink';
import { loadAssessmentData } from '@/lib/storage';

interface ResultsClientProps {
  data: SpaceSkillStandard;
  kidsContent: KidsSpaceContent;
}

type ResultsState = {
  result: AssessmentResult | null;
  summaries: CategorySummary[];
  permalink: string;
  isLoading: boolean;
};

type ResultsAction = {
  type: 'set';
  payload: {
    result: AssessmentResult | null;
    summaries: CategorySummary[];
    permalink: string;
  };
};

const INITIAL_RESULTS_STATE: ResultsState = {
  result: null,
  summaries: [],
  permalink: '',
  isLoading: true,
};

function resultsReducer(state: ResultsState, action: ResultsAction): ResultsState {
  switch (action.type) {
    case 'set':
      return {
        result: action.payload.result,
        summaries: action.payload.summaries,
        permalink: action.payload.permalink,
        isLoading: false,
      };
    default:
      return state;
  }
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

function getLevelLabel(score: number): string {
  if (score >= 4.0) return 'EXPERT';
  if (score >= 3.0) return 'ADVANCED';
  if (score >= 2.0) return 'INTERMEDIATE';
  if (score > 0.0) return 'BEGINNER';
  return 'NOT STARTED';
}

function getLevelEmoji(score: number): string {
  if (score >= 4.0) return '🥇';
  if (score >= 3.0) return '🥈';
  if (score >= 2.0) return '🥉';
  if (score > 0.0) return '⚪';
  return '⚫';
}

export default function ResultsClient({ data, kidsContent }: ResultsClientProps) {
  const [state, dispatch] = useReducer(resultsReducer, INITIAL_RESULTS_STATE);
  const { result, summaries, permalink, isLoading } = state;
  const { isKidsMode } = useKidsMode();
  const [showShareButton, setShowShareButton] = useState(false);
  const kidsCategoryMap = useMemo(() => {
    const map = new Map<string, { name: string }>();
    kidsContent.categories.forEach((category) => {
      map.set(category.id, { name: category.name });
    });
    return map;
  }, [kidsContent.categories]);
  const kidsRoleMap = useMemo(() => {
    const map = new Map<number, { name: string; description: string }>();
    kidsContent.roles.forEach((role) => {
      map.set(role.number, { name: role.name, description: role.description });
    });
    return map;
  }, [kidsContent.roles]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      dispatch({
        type: 'set',
        payload: {
          result: null,
          summaries: [],
          permalink: '',
        },
      });
      return;
    }

    let cancelled = false;

    const compute = () => {
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
        if (!cancelled) {
          dispatch({
            type: 'set',
            payload: {
              result: null,
              summaries: [],
              permalink: '',
            },
          });
        }
        return;
      }

      const calculatedSummaries = calculateAllCategorySummaries(
        data,
        assessmentResult.assessments
      );

      const compressed = compressAssessmentResult(assessmentResult);
      const encoded = encodeAssessmentResult(compressed);
      const url = `${window.location.origin}${window.location.pathname}#${encoded}`;

      if (!cancelled) {
        dispatch({
          type: 'set',
          payload: {
            result: assessmentResult,
            summaries: calculatedSummaries,
            permalink: url,
          },
        });
      }
    };

    compute();

    return () => {
      cancelled = true;
    };
  }, [data]);

  // スクロール検知で共有ボタンの表示/非表示を制御
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowShareButton(true);
      } else {
        setShowShareButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  // 診断済みカテゴリのみをフィルタリング
  const assessedSummaries = useMemo(
    () => summaries.filter((s) => s.assessedSkillCount > 0).sort((a, b) => b.averageScore - a.averageScore),
    [summaries]
  );

  const topCategories = useMemo(() => getTopCategories(assessedSummaries, 3), [assessedSummaries]);

  const relatedRoles = useMemo(() => {
    return topCategories
      .filter((summary) => summary.averageScore >= 2.0)
      .map((summary) => {
        const categories = SKILL_TO_ROLE[summary.category] ?? [];
        const roles = data.roles.filter((role) =>
          categories.includes(role.category.replace(/\n/g, '').trim())
        );

        const maxRoles = summary.averageScore >= 4 ? 5 : summary.averageScore >= 3 ? 3 : 2;
        const categoryId = CATEGORY_SLUG[summary.category];
        return {
          category: summary.category,
          categoryId,
          score: summary.averageScore,
          roles: roles.slice(0, maxRoles).map((role) => {
            const kidsRole = kidsRoleMap.get(role.number);
            return {
              number: role.number,
              adultName: role.name,
              adultDescription: role.description,
              kidsName: kidsRole?.name,
              kidsDescription: kidsRole?.description,
            };
          }),
        };
      });
  }, [data.roles, topCategories, kidsRoleMap]);

  const handleShare = async () => {
    if (!permalink || !result) {
      toast.error(isKidsMode ? 'リンクを作れませんでした' : '共有リンクを生成できませんでした');
      return;
    }

    const formatCategoryLabel = (category: string) => {
      if (!isKidsMode) {
        return category;
      }
      const slug = CATEGORY_SLUG[category];
      if (slug) {
        return kidsCategoryMap.get(slug)?.name ?? category;
      }
      return category;
    };

    const medals = ['🥇', '🥈', '🥉'];
    const topThree = topCategories
      .filter((c) => c.averageScore > 0)
      .slice(0, 3)
      .map((c, index) => `${medals[index]} ${index + 1}位「${formatCategoryLabel(c.category)}」(${c.averageScore.toFixed(1)})`)
      .join('\n');

    const shareText = topThree
      ? isKidsMode
        ? `🚀 宇宙のしごと診断を終えたよ！\n\n【自分が強い種類TOP3】\n${topThree}\n\nあなたも宇宙のしごと診断をしてみない？`
        : `🚀 宇宙スキル標準で詳細診断を完了しました！\n\n【私の強みカテゴリTOP3】\n${topThree}\n\nあなたも宇宙業界でのスキルを診断してみませんか？`
      : isKidsMode
      ? '🚀 宇宙のしごと診断を終えたよ！'
      : '🚀 宇宙スキル標準で詳細診断を完了しました！';

    if (canShare && navigator.share) {
      try {
        await navigator.share({ title: isKidsMode ? '宇宙のしごと診断' : '宇宙スキル標準アセスメント', text: shareText, url: permalink });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error(isKidsMode ? 'みんなに見せることができませんでした' : '共有に失敗しました');
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${permalink}`);
      toast.success(isKidsMode ? '結果のリンクをコピーしたよ！' : '結果のURLをコピーしました');
    } catch (error) {
      console.error(error);
      toast.error(isKidsMode ? 'コピーできませんでした' : 'コピーに失敗しました');
    }
  };

  if (isLoading) {
    return (
      <Card className="mx-auto flex min-h-[320px] max-w-3xl items-center justify-center">
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {isKidsMode ? '診断結果を計算中…' : '結果を計算中…'}
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
            {isKidsMode ? '診断データが見つかりません' : '評価データが見つかりません'}
          </CardTitle>
          <CardDescription className="text-amber-800">
            {isKidsMode
              ? 'まだ診断をしていないか、共有リンクが正しくありません。'
              : 'まだ詳細診断を実施していないか、共有リンクが無効です。'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {!isKidsMode && (
            <Button asChild>
              <Link href="/categories">詳細診断を始める</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/quick-assessment">{isKidsMode ? '宇宙のしごと診断に戻る' : 'クイック診断に戻る'}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <PageContainer>
      {/* スクロール連動型共有ボタン */}
      <button
        onClick={handleShare}
        className={`fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full shadow-2xl backdrop-blur-md bg-primary/90 hover:bg-primary hover:scale-110 transition-all duration-300 no-print flex items-center justify-center ${
          showShareButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label={canShare ? '共有する' : 'URLをコピー'}
      >
        {canShare ? <Share2 className="h-7 w-7 text-primary-foreground" /> : <Copy className="h-7 w-7 text-primary-foreground" />}
      </button>

      <header className="space-y-2 no-print">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-wider">
          Assessment Result
        </Badge>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {isKidsMode ? '宇宙のしごと診断の結果' : 'アセスメント結果'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isKidsMode ? '診断した日時' : '評価日時'}: {new Date(result.timestamp).toLocaleString('ja-JP')}
          </p>
        </div>
      </header>

      {/* 診断済みカテゴリ一覧 */}
      {assessedSummaries.length > 0 && (
        <Card className="border-border/70 shadow-sm print:border-2">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              {isKidsMode ? 'あなたの診断結果 🏅' : 'あなたの強みカテゴリ'}
            </CardTitle>
            <CardDescription>
              {isKidsMode
                ? `診断したできることを、スコアが高い順に表示しています。（${assessedSummaries.length}種類）`
                : `評価したスキルを、平均スコアが高い順に表示しています。（${assessedSummaries.length}カテゴリ）`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {assessedSummaries.map((summary, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              const rankColors = [
                'text-yellow-600 dark:text-yellow-400',
                'text-slate-500 dark:text-slate-400',
                'text-orange-600 dark:text-orange-400',
              ];
              const isTopThree = idx < 3;
              return (
                <div key={summary.category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={isTopThree ? "text-4xl" : "text-2xl"}>
                        {isTopThree ? medals[idx] : getLevelEmoji(summary.averageScore)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {isKidsMode && CATEGORY_SLUG[summary.category]
                            ? kidsCategoryMap.get(CATEGORY_SLUG[summary.category])?.name ?? summary.category
                            : summary.category}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <Badge variant="secondary" className={isTopThree ? rankColors[idx] : ''}>
                            {getLevelLabel(summary.averageScore)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {summary.assessedSkillCount} / {summary.skillCount}{' '}
                            {isKidsMode ? 'できること' : 'スキル'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{summary.averageScore.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">/ 5.0</div>
                    </div>
                  </div>
                  <Progress value={summary.averageScore * 20} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {isKidsMode ? '完了率' : '評価完了率'}: {Math.round(summary.completionRate)}%
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* 他のカテゴリも診断する動線 */}
      {!isKidsMode && (
        <Card className="border-border/70 bg-muted/30 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">他のカテゴリも診断してみませんか？</h3>
              <p className="text-sm text-muted-foreground">
                全8カテゴリの診断で、あなたの宇宙業界でのスキルをより詳しく把握できます。
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/categories">カテゴリ一覧へ</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {relatedRoles.some((entry) => entry.roles.length > 0) && (
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {isKidsMode ? 'おすすめのしごとの種類' : '推奨される職種'}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isKidsMode
                ? '診断スコアが高かった種類に基づいて、関係するしごとの種類を提案します。スコアが2.0未満の種類は対象外です。'
                : '評価が高かったカテゴリに基づき、関連する職種を提案します。スコアが2.0未満のカテゴリは対象外です。'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {relatedRoles.map(({ category, categoryId, score, roles }) =>
              roles.length > 0 ? (
                <div key={category} className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-dashed px-3 py-1 text-xs">
                      {isKidsMode && categoryId
                        ? kidsCategoryMap.get(categoryId)?.name ?? category
                        : category}
                    </Badge>
                    <span className="text-sm font-semibold text-primary">
                      {isKidsMode ? '平均スコア' : '平均スコア'} {score.toFixed(1)}
                    </span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {roles.map((role) => {
                      const displayName = isKidsMode
                        ? role.kidsName ?? role.adultName
                        : role.adultName;
                      const displayDescription = isKidsMode
                        ? role.kidsDescription
                        : role.adultDescription;

                      return (
                        <Card key={role.number} className="border border-border/60 bg-muted/20 shadow-none">
                          <CardHeader className="space-y-1">
                            <CardTitle className="flex items-baseline justify-between text-sm font-semibold">
                              <span>{displayName}</span>
                              <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px]">
                                #{role.number}
                              </Badge>
                            </CardTitle>
                            {displayDescription && (
                              <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                                {displayDescription}
                              </CardDescription>
                            )}
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>
      )}

      {/* 職種一覧への動線 */}
      {!isKidsMode && (
        <Card className="border-border/70 bg-muted/30 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">他の職種も見てみませんか？</h3>
              <p className="text-sm text-muted-foreground">
                宇宙スキル標準に掲載されている職種を一覧で確認できます。
              </p>
            </div>
            <Button asChild size="lg" variant="outline">
              <Link href="/roles">職種一覧へ</Link>
            </Button>
          </CardContent>
        </Card>
      )}


      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/skills">
            {isKidsMode ? 'できること一覧へ戻る' : 'スキル一覧へ戻る'}
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">
            トップページへ
          </Link>
        </Button>
      </div>
    </PageContainer>
  );
}
