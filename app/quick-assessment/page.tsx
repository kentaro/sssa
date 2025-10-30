'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import QuickAssessmentProgress from '@/components/QuickAssessmentProgress';
import QuickAssessmentQuestionComponent from '@/components/QuickAssessmentQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { quickAssessmentQuestions } from '@/data/quick-assessment-questions';
import {
  clearQuickAssessmentProgress,
  loadQuickAssessmentProgress,
  saveQuickAssessmentProgress,
} from '@/lib/quick-assessment-storage';
import type { QuickAssessmentAnswer } from '@/lib/types';

export default function QuickAssessmentPage() {
  const router = useRouter();
  const isCompletedRef = useRef(false);

  const resumeState = useMemo(() => {
    if (typeof window === 'undefined') {
      return { answers: [] as QuickAssessmentAnswer[], index: 0 };
    }

    const progress = loadQuickAssessmentProgress();
    if (progress && progress.answers.length > 0) {
      const shouldResume = window.confirm(
        '前回の診断が途中です。続きから再開しますか？\n\nOK → 続きから再開\nキャンセル → 最初から'
      );

      if (shouldResume) {
        return { answers: progress.answers, index: progress.answers.length };
      }

      clearQuickAssessmentProgress();
    }

    return { answers: [] as QuickAssessmentAnswer[], index: 0 };
  }, []);

  const [answers, setAnswers] = useState<QuickAssessmentAnswer[]>(resumeState.answers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(resumeState.index);

  useEffect(() => {
    if (answers.length > 0 && !isCompletedRef.current) {
      saveQuickAssessmentProgress(answers, currentQuestionIndex);
    }
  }, [answers, currentQuestionIndex]);

  useEffect(() => {
    if (answers.length === quickAssessmentQuestions.length && !isCompletedRef.current) {
      isCompletedRef.current = true;
      clearQuickAssessmentProgress();
      localStorage.setItem('quick-assessment-answers', JSON.stringify(answers));
      router.push('/quick-assessment/results');
    }
  }, [answers, router]);

  const handleAnswer = useCallback(
    (choice: 'left' | 'right' | 'neutral') => {
    const currentQuestion = quickAssessmentQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    const newAnswer: QuickAssessmentAnswer = {
      questionId: currentQuestion.id,
      choice,
    };

      setAnswers((prev) => [...prev, newAnswer]);

    if (currentQuestionIndex < quickAssessmentQuestions.length - 1) {
      setCurrentQuestionIndex((index) => index + 1);
    }
    },
    [currentQuestionIndex]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handleAnswer('left');
      } else if (event.key === 'ArrowRight') {
        handleAnswer('right');
      } else if (event.key === 'ArrowDown') {
        handleAnswer('neutral');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer]);

  const currentQuestion = quickAssessmentQuestions[currentQuestionIndex];
  const currentSection = currentQuestion?.section ?? '';
  const totalQuestions = quickAssessmentQuestions.length;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Quick Assessment</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          クイック診断
        </h1>
        <p className="text-sm text-muted-foreground">
          24問の質問に答えて、向いているカテゴリと職種のヒントを得ましょう。
        </p>
      </div>

      <QuickAssessmentProgress
        current={currentQuestionIndex + 1}
        total={totalQuestions}
        section={currentSection}
      />

      {currentQuestion && (
        <QuickAssessmentQuestionComponent question={currentQuestion} onAnswer={handleAnswer} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setAnswers((prev) => prev.slice(0, -1));
              setCurrentQuestionIndex((index) => Math.max(index - 1, 0));
            }
          }}
          disabled={currentQuestionIndex === 0}
        >
          前の質問に戻る
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => {
            clearQuickAssessmentProgress();
            router.push('/');
          }}
        >
          診断を終了
        </Button>
      </div>

      <div className="flex justify-end">
        <Link
          href="/quick-assessment/results"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          過去の結果を確認する
        </Link>
      </div>
    </div>
  );
}

