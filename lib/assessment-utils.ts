/**
 * アセスメント結果の計算ユーティリティ
 */

import type { CategoryAssessment, CategorySummary, SpaceSkillStandard } from './types';

/**
 * カテゴリ名を正規化（改行除去）
 */
function normalizeCategory(category: string): string {
  return category.replace(/\n/g, '').trim();
}

/**
 * 指定カテゴリのスキル一覧を取得
 */
function getSkillsByCategory(data: SpaceSkillStandard, category: string) {
  const normalizedCategory = normalizeCategory(category);
  return data.skills.filter(
    skill => normalizeCategory(skill.category) === normalizedCategory
  );
}

/**
 * カテゴリのサマリーを計算
 */
export function calculateCategorySummary(
  data: SpaceSkillStandard,
  category: string,
  assessment: CategoryAssessment
): CategorySummary {
  const skills = getSkillsByCategory(data, category);
  const evaluationAxesCount = data.evaluation_axes.length;

  const skillNumbers = Object.keys(assessment).map(Number);
  const assessedSkillCount = skillNumbers.length;

  let totalScore = 0;
  let totalEvaluations = 0;

  skillNumbers.forEach((skillNumber) => {
    const skillAssessment = assessment[skillNumber];
    if (skillAssessment) {
      Object.values(skillAssessment).forEach((level) => {
        totalScore += level;
        totalEvaluations++;
      });
    }
  });

  const averageScore = totalEvaluations > 0 ? totalScore / totalEvaluations : 0;
  const completionRate =
    skills.length > 0
      ? Math.round((assessedSkillCount / skills.length) * 100)
      : 0;

  return {
    category: normalizeCategory(category),
    averageScore,
    skillCount: skills.length,
    assessedSkillCount,
    completionRate,
  };
}

/**
 * すべてのカテゴリのサマリーを計算
 */
export function calculateAllCategorySummaries(
  data: SpaceSkillStandard,
  assessments: { [category: string]: CategoryAssessment }
): CategorySummary[] {
  return Object.entries(assessments).map(([category, assessment]) =>
    calculateCategorySummary(data, category, assessment)
  );
}

/**
 * 評価の高いカテゴリを取得
 */
export function getTopCategories(
  summaries: CategorySummary[],
  count: number = 3
): CategorySummary[] {
  return summaries
    .filter((summary) => summary.averageScore > 0)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, count);
}
