'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Activity,
  ArchiveIcon,
  BriefcaseBusiness,
  CogIcon,
  FlaskConical,
  Orbit,
  Rocket,
  Wrench,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getCategoryAssessment } from '@/lib/storage';
import type { EvaluationAxis, Skill } from '@/lib/types';

const ICONS: Record<string, React.ReactNode> = {
  'プログラム創造・組成': <Activity className="h-5 w-5" />,
  'プロジェクトマネジメント': <ArchiveIcon className="h-5 w-5" />,
  '基盤技術': <Orbit className="h-5 w-5" />,
  '設計・解析': <Wrench className="h-5 w-5" />,
  '試験': <FlaskConical className="h-5 w-5" />,
  '製造・加工': <CogIcon className="h-5 w-5" />,
  '打上げ・衛星運用': <Rocket className="h-5 w-5" />,
  'コーポレート': <BriefcaseBusiness className="h-5 w-5" />,
};

const DESCRIPTIONS: Record<string, string> = {
  'プログラム創造・組成': '戦略構想からプログラム組成までを担う上流工程のスキル群',
  'プロジェクトマネジメント': '計画・実行・制御を通じてゴールを確実に達成するマネジメント能力',
  '基盤技術': 'ソフトウェアやデータ処理など宇宙システムを支える横断的技術',
  '設計・解析': '構造・熱・推進・電気といった各種システムの設計と解析を行う専門技術',
  '試験': '宇宙機器の機能と性能を証明するための試験・検証ノウハウ',
  '製造・加工': '製造・加工・組立・品質管理まで一貫して求められる実装技術',
  '打上げ・衛星運用': 'ロケット打上げや衛星運用・管制の専門オペレーション',
  'コーポレート': '事業企画、法務、知財、人材など経営基盤を支えるコーポレート機能',
};

const NON_ASSESSABLE = new Set(['打上げ・衛星運用', 'コーポレート']);

interface CategoriesClientProps {
  categoriesData: Array<{
    category: string;
    categorySlug: string;
    skills: Skill[];
  }>;
  evaluationAxes: EvaluationAxis[];
}

export default function CategoriesClient({ categoriesData, evaluationAxes }: CategoriesClientProps) {
  const assessableCount = useMemo(
    () => categoriesData.filter(({ category }) => !NON_ASSESSABLE.has(category)).length,
    [categoriesData]
  );

  const completionStatus = useMemo(() => {
    return categoriesData.reduce<Record<string, boolean>>((acc, { category, skills }) => {
      if (NON_ASSESSABLE.has(category)) {
        acc[category] = false;
        return acc;
      }

      const categoryAssessment = getCategoryAssessment(category);
      const allComplete = skills.every((skill) => {
        const assessment = categoryAssessment[skill.number];
        if (!assessment) return false;

        return evaluationAxes.every((axis) => {
          const value = assessment[axis.number];
          return value !== undefined && value !== null && value >= 0 && value <= 5;
        });
      });

      acc[category] = allComplete;
      return acc;
    }, {});
  }, [categoriesData, evaluationAxes]);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em]">
          Category Assessment
        </Badge>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">カテゴリから選択</h1>
            <p className="text-sm text-muted-foreground">
              評価したいカテゴリを選んで詳細診断へ進みます。{assessableCount}カテゴリで評価指標を収録しています。
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              トップに戻る
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categoriesData.map(({ category, categorySlug, skills }) => {
          const icon = ICONS[category] ?? <Activity className="h-5 w-5" />;
          const description = DESCRIPTIONS[category] ?? '';
          const isAssessable = !NON_ASSESSABLE.has(category);
          const isCompleted = completionStatus[category] ?? false;

          return (
            <Card
              key={category}
              className={cn(
                'relative h-full border border-border/70 transition hover:-translate-y-1 hover:shadow-lg',
                !isAssessable && 'opacity-75'
              )}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={isAssessable ? 'default' : 'secondary'} className="flex items-center gap-2">
                    {icon}
                    <span>{category}</span>
                  </Badge>
                  {isCompleted && isAssessable && (
                    <Badge variant="accent" className="text-xs">
                      診断済み
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight">{category}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-full border-dashed px-3 py-1 text-xs">
                    {skills.length}スキル項目
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                    評価軸 {evaluationAxes.length} 件
                  </Badge>
                </div>
                {!isAssessable && (
                  <p className="text-xs leading-relaxed text-amber-600">
                    現時点では評価基準が公開されていないため診断できません。
                  </p>
                )}
              </CardContent>
              <CardFooter>
                {isAssessable ? (
                  <Button asChild className="w-full" variant={isCompleted ? 'secondary' : 'default'}>
                    <Link href={`/assessment/${categorySlug}`}>
                      {isCompleted ? '再診断する' : '診断を開始'}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full">
                    評価基準未定義
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

