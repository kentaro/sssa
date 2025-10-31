import { ArrowLeft, ArrowRight, Circle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { QuickAssessmentQuestion } from '@/lib/types';

interface QuickAssessmentQuestionProps {
  question: QuickAssessmentQuestion;
  onAnswer: (choice: 'left' | 'right' | 'neutral') => void;
  isKidsMode?: boolean;
}

export default function QuickAssessmentQuestionComponent({ question, onAnswer, isKidsMode = false }: QuickAssessmentQuestionProps) {
  const sectionName = isKidsMode ? (question.kidsSection ?? question.section) : question.section;
  const leftText = isKidsMode ? (question.leftOption.kidsText ?? question.leftOption.text) : question.leftOption.text;
  const rightText = isKidsMode ? (question.rightOption.kidsText ?? question.rightOption.text) : question.rightOption.text;
  const leftDescription = isKidsMode
    ? (question.leftOption.kidsDescription ?? leftText)
    : (question.leftOption.description ?? question.leftOption.text);
  const rightDescription = isKidsMode
    ? (question.rightOption.kidsDescription ?? rightText)
    : (question.rightOption.description ?? question.rightOption.text);
  
  return (
    <Card className="border-border/70 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {sectionName}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {isKidsMode 
            ? '左か右かを選ぶか、どちらでもなければ真ん中の「どちらでもない」を選んでね。'
            : '左右いずれかを選択するか、どちらでもなければ中央の「中立」を選択してください。'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 sm:gap-4">
        <ChoiceCard
          variant="left"
          title={leftText}
          description={leftDescription}
          emoji={question.leftOption.emoji}
          onSelect={() => onAnswer('left')}
          isKidsMode={isKidsMode}
        />
        <ChoiceCard
          variant="neutral"
          title={isKidsMode ? "どちらでもない" : "どちらでもない"}
          description={isKidsMode ? "どちらにも大きな違いがない、またはわからない場合はこちら" : "どちらにも大きな差がない、あるいは判断できない場合はこちら"}
          emoji="🤷"
          onSelect={() => onAnswer('neutral')}
          isKidsMode={isKidsMode}
        />
        <ChoiceCard
          variant="right"
          title={rightText}
          description={rightDescription}
          emoji={question.rightOption.emoji}
          onSelect={() => onAnswer('right')}
          isKidsMode={isKidsMode}
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
  isKidsMode?: boolean;
}

function ChoiceCard({ variant, title, description, emoji, onSelect, isKidsMode = false }: ChoiceCardProps) {
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
          {isNeutral ? '選択する' : isKidsMode ? `${variant === 'left' ? '左' : '右'}を選ぶ` : `${variant === 'left' ? '左' : '右'}を選ぶ`}
        </Button>
      </div>
    </div>
  );
}
