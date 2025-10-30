'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';

const CATEGORY_GLOSSARY: Record<string, string> = {
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

interface RolesListClientProps {
  rolesByCategory: Record<string, Role[]>;
}

export default function RolesListClient({ rolesByCategory }: RolesListClientProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const sortedCategories = useMemo(() => {
    return Object.entries(rolesByCategory)
      .map(([category, roles]) => ({ category, roles: [...roles].sort((a, b) => a.number - b.number) }))
      .sort((a, b) => a.roles[0].number - b.roles[0].number);
  }, [rolesByCategory]);

  const totalRoles = useMemo(
    () => Object.values(rolesByCategory).reduce((sum, roles) => sum + roles.length, 0),
    [rolesByCategory]
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em]">
          Role Catalogue
        </Badge>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">職種一覧</h1>
          <p className="text-sm text-muted-foreground">
            宇宙スキル標準で定義された{totalRoles}職種をカテゴリ別に閲覧できます。
          </p>
        </div>
      </header>

      <Accordion
        type="multiple"
        value={expanded}
        onValueChange={setExpanded}
        className="space-y-4"
      >
        {sortedCategories.map(({ category, roles }) => {
          const normalized = category.replace(/\n/g, ' ');
          const mappedCategory = CATEGORY_GLOSSARY[normalized];

          return (
            <AccordionItem
              key={category}
              value={category}
              className="overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm"
            >
              <AccordionTrigger className="flex-1 px-6 py-4 text-left">
                <div className="flex flex-col gap-1 text-left">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold text-foreground">{normalized}</CardTitle>
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px]">
                      {roles.length}職種
                    </Badge>
                  </div>
                  {mappedCategory && (
                    <CardDescription className="text-xs text-muted-foreground">
                      関連スキルカテゴリ: {mappedCategory}
                    </CardDescription>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/20">
                <div className="divide-y divide-border/70">
                  {roles.map((role) => (
                    <Card key={role.number} className="rounded-none border-0 border-b border-border/70 shadow-none last:border-b-0">
                      <CardHeader className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground sm:h-14 sm:w-14">
                          {role.number}
                        </div>
                        <div className="flex-1 space-y-1">
                          <CardTitle className="text-lg font-semibold text-foreground">
                            {role.name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                            {role.description}
                          </CardDescription>
                        </div>
                        {mappedCategory && (
                          <Button asChild variant="ghost" size="sm" className="mt-2 whitespace-nowrap">
                            <LinkToCategory category={mappedCategory} />
                          </Button>
                        )}
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

function LinkToCategory({ category }: { category: string }) {
  const slugMap: Record<string, string> = {
    'プログラム創造・組成': 'program-creation',
    'プロジェクトマネジメント': 'project-management',
    '基盤技術': 'foundation-technology',
    '設計・解析': 'design-analysis',
    '試験': 'testing',
    '製造・加工': 'manufacturing',
    '打上げ・衛星運用': 'launch-operations',
    'コーポレート': 'corporate',
  };

  const slug = slugMap[category] ?? 'categories';

  return (
    <Link
      href={`/assessment/${slug}`}
      className={cn('flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80')}
    >
      カテゴリを診断
    </Link>
  );
}

