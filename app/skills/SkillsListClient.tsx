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
import type { Skill } from '@/lib/types';

const CATEGORY_BADGES: Record<string, string> = {
  'プログラム創造・組成': 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-200',
  'プロジェクトマネジメント': 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200',
  '基盤技術': 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-200',
  '設計・解析': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200',
  '試験': 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-200',
  '製造・加工': 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-200',
  '打上げ・衛星運用': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-200',
  'コーポレート': 'bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-200',
};

interface SkillsListClientProps {
  categoriesData: Array<{
    category: string;
    skills: Skill[];
  }>;
}

export default function SkillsListClient({ categoriesData }: SkillsListClientProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const totalSkills = useMemo(
    () => categoriesData.reduce((sum, category) => sum + category.skills.length, 0),
    [categoriesData]
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em]">
          Skill Catalogue
        </Badge>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">スキル一覧</h1>
          <p className="text-sm text-muted-foreground">
            宇宙スキル標準に定義された{totalSkills}スキルをカテゴリ別に整理しています。
          </p>
        </div>
      </header>

      <Accordion
        type="multiple"
        value={expanded}
        onValueChange={setExpanded}
        className="space-y-4"
      >
        {categoriesData.map(({ category, skills }) => {
          const badgeClass = CATEGORY_BADGES[category] ?? 'bg-muted text-muted-foreground';

          return (
            <AccordionItem
              key={category}
              value={category}
              className="overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm"
            >
              <AccordionTrigger className="flex-1 px-6 py-4 text-left text-lg font-semibold">
                <div className="flex flex-col gap-1 text-left">
                  <span className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>
                      {category}
                    </span>
                    <span className="text-xs text-muted-foreground">{skills.length}スキル</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    クリックしてスキル詳細を展開
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/20">
                <div className="divide-y divide-border/60">
                  {skills.map((skill) => (
                    <Card key={skill.number} className="rounded-none border-0 border-b border-border/60 shadow-none last:border-b-0">
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
          );
        })}
      </Accordion>
    </div>
  );
}

