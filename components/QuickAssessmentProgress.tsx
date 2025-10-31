import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useKidsMode } from '@/lib/kids-mode-context';

interface QuickAssessmentProgressProps {
  current: number;
  total: number;
  section: string;
  kidsSection?: string;
}

export default function QuickAssessmentProgress({ current, total, section, kidsSection }: QuickAssessmentProgressProps) {
  const { isKidsMode } = useKidsMode();
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            {isKidsMode ? '進み具合' : '進捗'}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {isKidsMode
              ? `だいたい5分・全部で${total}問`
              : `所要時間約5分・全${total}問`}
          </CardDescription>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em]">
          {isKidsMode ? (kidsSection ?? section) : `Section ${section || '—'}`}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={percentage} />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {isKidsMode ? `${current}問目 / ${total}問` : `${current} / ${total} 問`}
          </span>
          <span>{percentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
