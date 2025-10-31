'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import SkillAssessmentForm from '@/components/SkillAssessmentForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useKidsMode } from '@/lib/kids-mode-context';
import { getCategoryAssessment, saveCategoryAssessment, saveSkillAssessment } from '@/lib/storage';
import type {
  CategoryAssessment,
  EvaluationAxis,
  Skill,
  SkillAssessment,
  SkillLevel,
} from '@/lib/types';

interface AssessmentClientProps {
  category: string;
  skills: Skill[];
  skillLevelsMap: Map<number, SkillLevel[]>;
  evaluationAxes: EvaluationAxis[];
}

export default function AssessmentClient({
  category,
  skills,
  skillLevelsMap,
  evaluationAxes,
}: AssessmentClientProps) {
  const router = useRouter();
  const { isKidsMode } = useKidsMode();

  useEffect(() => {
    if (isKidsMode) {
      router.push('/');
    }
  }, [isKidsMode, router]);

  const [categoryAssessment, setCategoryAssessment] = useState<CategoryAssessment>({});
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  useEffect(() => {
    setCategoryAssessment(getCategoryAssessment(category));
  }, [category]);

  const totalSkills = skills.length;
  const currentSkill = skills[currentSkillIndex];
  const skillLevels = currentSkill ? skillLevelsMap.get(currentSkill.number) ?? [] : [];

  const { completedCount, completedSet } = useMemo(() => {
    const completed = new Set<number>();

    skills.forEach((skill) => {
      const assessment = categoryAssessment[skill.number];
      if (!assessment) return;

      const filled = evaluationAxes.every((axis) => {
        const value = assessment[axis.number];
        return value !== undefined && value !== null && value >= 0 && value <= 5;
      });

      if (filled) {
        completed.add(skill.number);
      }
    });

    return { completedCount: completed.size, completedSet: completed };
  }, [categoryAssessment, evaluationAxes, skills]);

  const progressValue = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;
  const isAllComplete = totalSkills > 0 && completedCount === totalSkills;

  const handleAssessmentChange = (assessment: SkillAssessment) => {
    if (!currentSkill) return;

    const nextAssessment = {
      ...categoryAssessment,
      [currentSkill.number]: assessment,
    };

    setCategoryAssessment(nextAssessment);
    saveSkillAssessment(category, currentSkill.number, assessment);
  };

  const handleNext = () => {
    if (currentSkillIndex < totalSkills - 1) {
      setCurrentSkillIndex((idx) => idx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSkillIndex > 0) {
      setCurrentSkillIndex((idx) => idx - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkipToSkill = (index: number) => {
    setCurrentSkillIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    saveCategoryAssessment(category, categoryAssessment);

    toast.success(`「${category}」の評価が完了しました`, {
      description: '結果ページで全カテゴリのまとめを確認できます。',
      action: {
        label: '結果を見る',
        onClick: () => router.push('/results'),
      },
    });

    router.push('/categories');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/categories" className="transition hover:text-foreground">
            カテゴリ一覧
          </Link>
          <span>／</span>
          <span className="text-foreground">{category}</span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{category}</h1>
            <p className="text-sm text-muted-foreground">
              {totalSkills}スキル × {evaluationAxes.length}評価軸
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em]">
            Step {currentSkillIndex + 1}/{totalSkills}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">評価進捗</CardTitle>
              <CardDescription>
                全スキルのセルフアセスメントが自動保存されます。完了率 {progressValue}%
              </CardDescription>
            </div>
            {isAllComplete ? (
              <Badge variant="accent" className="flex items-center gap-1 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                全スキル評価済み
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                残り {totalSkills - completedCount} スキル
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <Progress value={progressValue} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                完了 {completedCount} / {totalSkills}
              </span>
              <span>評価軸 {evaluationAxes.length} 件</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {skills.map((skill, index) => {
                const isCurrent = index === currentSkillIndex;
                const isComplete = completedSet.has(skill.number);

                return (
                  <Button
                    key={skill.number}
                    variant={isCurrent ? 'default' : isComplete ? 'secondary' : 'outline'}
                    className={cn(
                      'h-10 rounded-lg text-sm font-semibold',
                      !isCurrent && !isComplete && 'border-dashed'
                    )}
                    onClick={() => handleSkipToSkill(index)}
                    title={skill.name}
                  >
                    {skill.number}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {currentSkill ? (
        <SkillAssessmentForm
          key={currentSkill.number}
          skill={currentSkill}
          skillLevels={skillLevels}
          evaluationAxes={evaluationAxes}
          initialAssessment={categoryAssessment[currentSkill.number] ?? {}}
          onAssessmentChange={handleAssessmentChange}
        />
      ) : (
        <Card>
          <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
            <TriangleAlert className="h-4 w-4 text-amber-500" />
            スキルが見つかりません。
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSkillIndex === 0}
        >
          前のスキル
        </Button>

        <div className="text-xs text-muted-foreground">
          {currentSkillIndex + 1} / {totalSkills}
        </div>

        {currentSkillIndex < totalSkills - 1 ? (
          <Button onClick={handleNext}>
            次のスキル
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!isAllComplete}
            variant={isAllComplete ? 'default' : 'outline'}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            評価を完了
          </Button>
        )}
      </div>
    </div>
  );
}

