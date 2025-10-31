'use client';

import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { useKidsMode } from '@/lib/kids-mode-context';
import type { KidsCategory, Skill } from '@/lib/types';

interface SkillsListClientProps {
  adultCategories: Array<{
    category: string;
    categoryId: string;
    skills: Skill[];
  }>;
  kidsCategories: KidsCategory[];
}

interface DisplayCategory {
  id: string;
  label: string;
  helperText?: string;
  badgeClass: string;
  skills: Array<{
    number: number;
    name: string;
    description: string;
  }>;
}

const CATEGORY_BADGES_BY_ID: Record<string, string> = {
  'program-creation': 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-200',
  'project-management': 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200',
  'foundation-technology': 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-200',
  'design-analysis': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200',
  'testing': 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-200',
  'manufacturing': 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-200',
  'launch-operations': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-200',
  'corporate': 'bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-200',
};

export default function SkillsListClient({ adultCategories, kidsCategories }: SkillsListClientProps) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const { isKidsMode } = useKidsMode();

  const { totalSkills, displayCategories } = useMemo(() => {
    if (isKidsMode) {
      const total = kidsCategories.reduce((sum, category) => sum + category.skills.length, 0);
      const categories: DisplayCategory[] = kidsCategories.map((category) => ({
        id: category.id,
        label: category.name,
        helperText: category.description,
        badgeClass: CATEGORY_BADGES_BY_ID[category.id] ?? 'bg-muted text-muted-foreground',
        skills: category.skills.map((skill) => ({
          number: skill.number,
          name: skill.name,
          description: skill.description,
        })),
      }));
      return { totalSkills: total, displayCategories: categories };
    }

    const total = adultCategories.reduce((sum, category) => sum + category.skills.length, 0);
    const categories: DisplayCategory[] = adultCategories.map((category) => ({
      id: category.categoryId,
      label: category.category,
      helperText: undefined,
      badgeClass: CATEGORY_BADGES_BY_ID[category.categoryId] ?? 'bg-muted text-muted-foreground',
      skills: category.skills.map((skill) => ({
        number: skill.number,
        name: skill.name,
        description: skill.description,
      })),
    }));

    return { totalSkills: total, displayCategories: categories };
  }, [adultCategories, isKidsMode, kidsCategories]);

  return (
    <PageContainer>
      <PageHeader
        badge="Skill Catalogue"
        title={isKidsMode ? 'できること一覧' : 'スキル一覧'}
        description={
          isKidsMode
            ? `宇宙のおしごとの勉強リストで決められた${totalSkills}個のできることを種類別に整理しています。`
            : `宇宙スキル標準に定義された${totalSkills}スキルをカテゴリ別に整理しています。`
        }
      />

      <Accordion type="multiple" value={expanded} onValueChange={setExpanded} className="space-y-4">
        {displayCategories.map(({ id, label, helperText, badgeClass, skills }) => (
          <AccordionItem
            key={id}
            value={id}
            className="overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm"
          >
            <AccordionTrigger className="flex-1 px-6 py-4 text-left text-lg font-semibold">
              <div className="flex flex-col gap-1 text-left">
                <span className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {skills.length}
                    {isKidsMode ? '個' : 'スキル'}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {isKidsMode ? 'クリックしてできることを見る' : 'クリックしてスキル詳細を展開'}
                </span>
                {helperText && (
                  <span className="text-xs text-muted-foreground/80">{helperText}</span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-muted/20">
              <div className="divide-y divide-border/60">
                {skills.map((skill) => (
                  <Card
                    key={skill.number}
                    className="rounded-none border-0 border-b border-border/60 shadow-none last:border-b-0"
                  >
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {skill.number}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {skill.name}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                          {skill.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageContainer>
  );
}
