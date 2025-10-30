'use client';

import { useEffect, useMemo, useState } from 'react';
import { Info, NotebookPen } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Skill, SkillAssessment, SkillLevel } from '@/lib/types';

interface SkillAssessmentFormProps {
  skill: Skill;
  skillLevels: SkillLevel[];
  evaluationAxes: Array<{ number: number; evaluation_axis: string }>;
  initialAssessment?: SkillAssessment;
  onAssessmentChange: (assessment: SkillAssessment) => void;
}

const LEVELS = [0, 1, 2, 3, 4, 5] as const;

export default function SkillAssessmentForm({
  skill,
  skillLevels,
  evaluationAxes,
  initialAssessment = {},
  onAssessmentChange,
}: SkillAssessmentFormProps) {
  const [assessment, setAssessment] = useState<SkillAssessment>(initialAssessment);
  const [expandedAxes, setExpandedAxes] = useState<Set<string>>(new Set());

  // initialAssessmentが変更されたら内部状態を更新
  useEffect(() => {
    setAssessment(initialAssessment);
  }, [initialAssessment, skill.number]);

  const levelsByAxis = useMemo(() => {
    return skillLevels.reduce<Record<string, SkillLevel>>((acc, level) => {
      acc[level.evaluation_axis] = level;
      return acc;
    }, {});
  }, [skillLevels]);

  const handleLevelChange = (axisNumber: number, level: number) => {
    const next = { ...assessment, [axisNumber]: level };
    setAssessment(next);
    onAssessmentChange(next);
  };

  const handleSetAllToZero = () => {
    const next: SkillAssessment = {};
    evaluationAxes.forEach((axis) => {
      next[axis.number] = 0;
    });
    setAssessment(next);
    onAssessmentChange(next);
    toast.success('すべての評価軸をレベル0に設定しました');
  };

  return (
    <Card className="border-border/80 shadow-md">
      <CardHeader className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary" className="gap-2 pr-3 text-xs">
              <NotebookPen className="h-3.5 w-3.5" />
              スキル {skill.number}
            </Badge>
            <Button variant="destructive" size="sm" onClick={handleSetAllToZero} className="shrink-0">
              このスキルは未経験
            </Button>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold tracking-tight">{skill.name}</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              {skill.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {evaluationAxes.map((axis) => {
          const axisLevel = levelsByAxis[axis.evaluation_axis];
          const selectedLevel = assessment[axis.number];
          const accordionValue = axis.number.toString();

          return (
            <div
              key={axis.number}
              className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      Evaluation Axis
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">{axis.evaluation_axis}</h3>
                  </div>
                  {axisLevel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setExpandedAxes((prev) => {
                          const next = new Set(prev);
                          if (next.has(accordionValue)) {
                            next.delete(accordionValue);
                          } else {
                            next.add(accordionValue);
                          }
                          return next;
                        });
                      }}
                      className="flex-shrink-0 rounded-full bg-muted/40 px-3 py-1 text-xs"
                    >
                      レベル詳細を{expandedAxes.has(accordionValue) ? '非表示' : '表示'}
                    </Button>
                  )}
                </div>
                {axisLevel && expandedAxes.has(accordionValue) && (
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
                    {Object.entries(axisLevel.levels).map(([level, description]) => (
                      <div key={level} className="flex items-start gap-3">
                        <span className="flex h-6 w-10 items-center justify-center rounded-full border border-dashed border-border text-[11px] font-medium text-muted-foreground">
                          Lv{level}
                        </span>
                        <span>{description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {LEVELS.map((level) => {
                  const isActive = selectedLevel === level;
                  const isZero = level === 0;

                  return (
                    <Button
                      key={level}
                      type="button"
                      variant={isActive ? 'default' : isZero ? 'outline' : 'secondary'}
                      className={cn(
                        'h-auto flex-col gap-1 py-4 text-sm font-semibold transition-all',
                        isZero && !isActive && 'border-dashed border-border/80 text-muted-foreground',
                        isActive && 'shadow-lg'
                      )}
                      onClick={() => handleLevelChange(axis.number, level)}
                    >
                      <span className={cn(
                        "text-[11px] uppercase tracking-wide",
                        isActive ? "text-white/90" : "text-muted-foreground/70"
                      )}>
                        Level
                      </span>
                      <span className="text-lg font-bold">{level}</span>
                    </Button>
                  );
                })}
              </div>

              {selectedLevel !== undefined && axisLevel?.levels[selectedLevel] && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                  <Info className="mt-0.5 h-4 w-4 text-primary" />
                  <p>
                    <span className="font-semibold text-foreground">選択中 (Lv{selectedLevel})：</span>
                    {axisLevel.levels[selectedLevel]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

