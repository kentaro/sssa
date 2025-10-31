import { ArrowLeft, ArrowRight, Circle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { QuickAssessmentQuestion } from '@/lib/types';

interface QuickAssessmentQuestionProps {
  question: QuickAssessmentQuestion;
  onAnswer: (choice: 'left' | 'right' | 'neutral') => void;
}

export default function QuickAssessmentQuestionComponent({ question, onAnswer }: QuickAssessmentQuestionProps) {
  return (
    <Card className="border-border/70 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {question.section}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          左右いずれかを選択するか、どちらでもなければ中央の「中立」を選択してください。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 sm:gap-4">
        <ChoiceCard
          variant="left"
          title={question.leftOption.text}
          description={question.leftOption.text}
          emoji={question.leftOption.emoji}
          onSelect={() => onAnswer('left')}
        />
        <ChoiceCard
          variant="neutral"
          title="どちらでもない"
          description="どちらにも大きな差がない、あるいは判断できない場合はこちら"
          emoji="🤷"
          onSelect={() => onAnswer('neutral')}
        />
        <ChoiceCard
          variant="right"
          title={question.rightOption.text}
          description={question.rightOption.text}
          emoji={question.rightOption.emoji}
          onSelect={() => onAnswer('right')}
        />
      </CardContent>
      <div className="hidden justify-center gap-8 pb-4 text-xs text-muted-foreground md:flex">
        <span className="flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> 左キー
        </span>
        <span className="flex items-center gap-1">
          <Circle className="h-3.5 w-3.5" /> 下キー
        </span>
        <span className="flex items-center gap-1">
          <ArrowRight className="h-3.5 w-3.5" /> 右キー
        </span>
      </div>
    </Card>
  );
}

interface ChoiceCardProps {
  variant: 'left' | 'right' | 'neutral';
  title: string;
  description: string;
  emoji: string;
  onSelect: () => void;
}

function ChoiceCard({ variant, title, description, emoji, onSelect }: ChoiceCardProps) {
  const isNeutral = variant === 'neutral';

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-1 flex-col gap-2 sm:gap-3 p-3 sm:p-6 text-left">
        <span className="text-2xl sm:text-4xl">{emoji}</span>
        <h3 className="text-sm sm:text-lg font-semibold text-foreground min-h-[2.5rem] sm:min-h-[3rem]">{title}</h3>
        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="border-t border-border/70 bg-muted/40 p-2 sm:p-4">
        <Button
          onClick={onSelect}
          variant={isNeutral ? 'outline' : 'default'}
          className="w-full"
        >
          {isNeutral ? '選択する' : `${variant === 'left' ? '左' : '右'}を選ぶ`}
        </Button>
      </div>
    </div>
  );
}

