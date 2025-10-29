'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { quickAssessmentQuestions } from '@/data/quick-assessment-questions';
import {
  loadQuickAssessmentProgress,
  saveQuickAssessmentProgress,
  clearQuickAssessmentProgress,
} from '@/lib/quick-assessment-storage';
import QuickAssessmentQuestionComponent from '@/components/QuickAssessmentQuestion';
import QuickAssessmentProgress from '@/components/QuickAssessmentProgress';
import type { QuickAssessmentAnswer } from '@/lib/types';

export default function QuickAssessmentPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuickAssessmentAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isCompletedRef = useRef(false);

  // 初期化: LocalStorageから進捗を読み込み
  useEffect(() => {
    // 前回の完了した回答をクリア
    localStorage.removeItem('quick-assessment-answers');

    const progress = loadQuickAssessmentProgress();
    if (progress && progress.answers.length > 0) {
      // 続きから再開するか確認
      const shouldResume = confirm(
        '前回の診断が途中で終了しています。続きから再開しますか？\n\nOK → 続きから再開\nキャンセル → 最初から始める'
      );

      if (shouldResume) {
        setAnswers(progress.answers);
        const nextIndex = progress.answers.length;
        setCurrentQuestionIndex(nextIndex);
      } else {
        clearQuickAssessmentProgress();
      }
    }
    setIsLoading(false);
  }, []);

  // 回答が変わったらLocalStorageに保存（完了時は除く）
  useEffect(() => {
    if (!isLoading && answers.length > 0 && !isCompletedRef.current) {
      saveQuickAssessmentProgress(answers, currentQuestionIndex);
    }
  }, [answers, currentQuestionIndex, isLoading]);

  // 全問完了を検知して結果ページへ遷移
  useEffect(() => {
    if (answers.length === quickAssessmentQuestions.length && !isCompletedRef.current) {
      // 完了フラグを立てて自動保存を防ぐ
      isCompletedRef.current = true;
      // 進捗をクリア
      clearQuickAssessmentProgress();
      // 回答をLocalStorageに保存
      localStorage.setItem('quick-assessment-answers', JSON.stringify(answers));
      // 結果ページへ遷移
      router.push('/quick-assessment/results');
    }
  }, [answers, router]);

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleAnswer('left');
      } else if (e.key === 'ArrowRight') {
        handleAnswer('right');
      } else if (e.key === 'ArrowDown') {
        handleAnswer('neutral');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, answers]);

  const handleAnswer = (choice: 'left' | 'right' | 'neutral') => {
    const currentQuestion = quickAssessmentQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    const newAnswer: QuickAssessmentAnswer = {
      questionId: currentQuestion.id,
      choice,
    };

    const newAnswers = [...answers, newAnswer];

    // 回答を保存
    setAnswers(newAnswers);

    // 次の質問へ（最後の質問でない場合のみ）
    if (currentQuestionIndex < quickAssessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  const currentQuestion = quickAssessmentQuestions[currentQuestionIndex];
  const currentSection = currentQuestion?.section || '';
  const totalQuestions = quickAssessmentQuestions.length;

  // セクション切り替えの検出
  const isNewSection =
    currentQuestionIndex > 0 &&
    quickAssessmentQuestions[currentQuestionIndex - 1]?.section !== currentSection;

  return (
    <div className="max-w-5xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          クイック診断
        </h1>
        <p className="text-gray-600">
          24問の質問に答えて、あなたに向いている職種を見つけましょう
        </p>
      </div>

      {/* 進捗バー */}
      <QuickAssessmentProgress
        current={currentQuestionIndex + 1}
        total={totalQuestions}
        section={currentSection}
      />

      {/* セクション切り替え時のメッセージ */}
      {isNewSection && (
        <div className="mb-6 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <p className="text-indigo-800 font-semibold">
            📍 セクション {currentQuestion.sectionNumber}: {currentSection}
          </p>
        </div>
      )}

      {/* 質問 */}
      {currentQuestion && (
        <QuickAssessmentQuestionComponent
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      )}

      {/* 戻るボタン（最初の質問以外） */}
      {currentQuestionIndex > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              // 最後の回答を削除して前の質問に戻る
              setAnswers(answers.slice(0, -1));
              setCurrentQuestionIndex(currentQuestionIndex - 1);
            }}
            className="text-gray-600 hover:text-gray-800 transition underline"
          >
            ← 前の質問に戻る
          </button>
        </div>
      )}

      {/* 診断を終了ボタン */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            if (confirm('診断を終了しますか？進捗は保存されません。')) {
              clearQuickAssessmentProgress();
              router.push('/');
            }
          }}
          className="text-sm text-gray-500 hover:text-gray-700 transition"
        >
          診断を終了
        </button>
      </div>
    </div>
  );
}
