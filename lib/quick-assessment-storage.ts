import type { QuickAssessmentAnswer } from './types';

const STORAGE_KEY = 'quick-assessment-progress';

export interface QuickAssessmentProgress {
  answers: QuickAssessmentAnswer[];
  currentQuestionIndex: number;
  timestamp: string;
}

/**
 * クイック診断の進捗を保存
 */
export function saveQuickAssessmentProgress(
  answers: QuickAssessmentAnswer[],
  currentQuestionIndex: number
): void {
  if (typeof window === 'undefined') return;

  const progress: QuickAssessmentProgress = {
    answers,
    currentQuestionIndex,
    timestamp: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save quick assessment progress:', error);
  }
}

/**
 * クイック診断の進捗を読み込み
 */
export function loadQuickAssessmentProgress(): QuickAssessmentProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const progress = JSON.parse(data) as QuickAssessmentProgress;

    // 24時間以上古いデータは削除
    const timestamp = new Date(progress.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      clearQuickAssessmentProgress();
      return null;
    }

    return progress;
  } catch (error) {
    console.error('Failed to load quick assessment progress:', error);
    return null;
  }
}

/**
 * クイック診断の進捗をクリア
 */
export function clearQuickAssessmentProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear quick assessment progress:', error);
  }
}
