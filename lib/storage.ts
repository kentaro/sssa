/**
 * LocalStorage管理ユーティリティ
 */

import type { AssessmentData, CategoryAssessment, SkillAssessment } from './types';

const STORAGE_KEY = 'sssa_assessment_data';

/**
 * LocalStorageが利用可能かチェック
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * アセスメントデータを初期化
 */
function initializeAssessmentData(): AssessmentData {
  return {
    assessments: {},
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * LocalStorageからアセスメントデータを読み込む
 */
export function loadAssessmentData(): AssessmentData {
  if (!isLocalStorageAvailable()) {
    return initializeAssessmentData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initializeAssessmentData();
    }

    const data = JSON.parse(stored) as AssessmentData;
    return data;
  } catch (error) {
    console.error('Failed to load assessment data:', error);
    return initializeAssessmentData();
  }
}

/**
 * アセスメントデータをLocalStorageに保存
 */
export function saveAssessmentData(data: AssessmentData): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save assessment data:', error);
    return false;
  }
}

/**
 * 特定カテゴリのアセスメントデータを取得
 */
export function getCategoryAssessment(category: string): CategoryAssessment {
  const data = loadAssessmentData();
  return data.assessments[category] || {};
}

/**
 * 特定カテゴリのアセスメントデータを保存
 */
export function saveCategoryAssessment(
  category: string,
  assessment: CategoryAssessment
): boolean {
  const data = loadAssessmentData();
  data.assessments[category] = assessment;
  return saveAssessmentData(data);
}

/**
 * 特定スキルの評価を保存
 */
export function saveSkillAssessment(
  category: string,
  skillNumber: number,
  assessment: SkillAssessment
): boolean {
  const data = loadAssessmentData();

  if (!data.assessments[category]) {
    data.assessments[category] = {};
  }

  data.assessments[category][skillNumber] = assessment;
  return saveAssessmentData(data);
}

/**
 * 特定スキルの特定評価軸の値を保存
 */
export function saveSkillAxisValue(
  category: string,
  skillNumber: number,
  axisNumber: number,
  level: number
): boolean {
  const data = loadAssessmentData();

  if (!data.assessments[category]) {
    data.assessments[category] = {};
  }

  if (!data.assessments[category][skillNumber]) {
    data.assessments[category][skillNumber] = {};
  }

  data.assessments[category][skillNumber][axisNumber] = level;
  return saveAssessmentData(data);
}

/**
 * 特定スキルの評価を取得
 */
export function getSkillAssessment(
  category: string,
  skillNumber: number
): SkillAssessment {
  const categoryAssessment = getCategoryAssessment(category);
  return categoryAssessment[skillNumber] || {};
}

/**
 * カテゴリの完了率を計算
 */
export function calculateCategoryCompletion(
  category: string,
  totalSkills: number,
  evaluationAxesCount: number
): number {
  const categoryAssessment = getCategoryAssessment(category);
  const assessedSkills = Object.keys(categoryAssessment).length;

  if (assessedSkills === 0) {
    return 0;
  }

  // 各スキルの評価軸の完了率を計算
  let totalCompletedAxes = 0;
  Object.values(categoryAssessment).forEach(skillAssessment => {
    totalCompletedAxes += Object.keys(skillAssessment).length;
  });

  const totalRequiredAxes = totalSkills * evaluationAxesCount;
  return Math.round((totalCompletedAxes / totalRequiredAxes) * 100);
}

/**
 * アセスメントデータをクリア
 */
export function clearAssessmentData(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear assessment data:', error);
    return false;
  }
}

/**
 * 特定カテゴリのアセスメントをクリア
 */
export function clearCategoryAssessment(category: string): boolean {
  const data = loadAssessmentData();
  delete data.assessments[category];
  return saveAssessmentData(data);
}
