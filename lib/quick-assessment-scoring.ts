import type {
  QuickAssessmentAnswer,
  QuickAssessmentQuestion,
  QuickAssessmentResult,
  Role,
} from './types';

/**
 * カテゴリ名を正規化（改行除去）
 */
function normalizeCategory(category: string): string {
  return category.replace(/\n/g, '').trim();
}

type NormalizedWeight = Array<[string, number]>;

function normalizeOptionWeights(option: QuickAssessmentQuestion['leftOption']): NormalizedWeight {
  const entries = Object.entries(option.weights ?? {});
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  if (total <= 0) {
    return [];
  }
  return entries.map(([category, weight]) => [normalizeCategory(category), weight / total]);
}

function buildCategoryExposureMap(questions: QuickAssessmentQuestion[]): Map<string, number> {
  const exposure = new Map<string, number>();

  questions.forEach((question) => {
    [question.leftOption, question.rightOption].forEach((option) => {
      normalizeOptionWeights(option).forEach(([category, weight]) => {
        exposure.set(category, (exposure.get(category) ?? 0) + weight);
      });
    });
  });

  return exposure;
}

/**
 * クイック診断の回答からロールスコアを計算する
 */
export function calculateRoleScores(
  answers: QuickAssessmentAnswer[],
  questions: QuickAssessmentQuestion[],
  roles: Role[]
): QuickAssessmentResult {
  const categoryExposure = buildCategoryExposureMap(questions);
  const maxExposure = Math.max(...(categoryExposure.size ? Array.from(categoryExposure.values()) : [1]), 1);

  const applyOptionWeights = (
    normalizedWeights: NormalizedWeight,
    multiplier: number,
    categoryScores: { [category: string]: number }
  ) => {
    normalizedWeights.forEach(([category, weight]) => {
      const exposure = categoryExposure.get(category) ?? maxExposure;
      const exposureAdjustment = maxExposure / exposure;

      categoryScores[category] = (categoryScores[category] ?? 0) + weight * multiplier * exposureAdjustment;
    });
  };

  // 各ロールカテゴリのスコアを集計（正規化されたカテゴリ名で）
  const categoryScores: { [category: string]: number } = {};

  answers.forEach((answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    if (answer.choice === 'neutral') {
      // 「どちらでもない」は左右の選択肢を50%ずつ加点
      applyOptionWeights(normalizeOptionWeights(question.leftOption), 0.5, categoryScores);
      applyOptionWeights(normalizeOptionWeights(question.rightOption), 0.5, categoryScores);
      return;
    }

    const option = answer.choice === 'left'
      ? question.leftOption
      : question.rightOption;

    applyOptionWeights(normalizeOptionWeights(option), 1, categoryScores);
  });

  // カテゴリスコアをロールスコアに変換
  const roleScores: { [roleNumber: number]: number } = {};
  const rolesByCategory: Record<string, Role[]> = {};

  roles.forEach((role) => {
    const normalizedRoleCategory = normalizeCategory(role.category);
    if (!rolesByCategory[normalizedRoleCategory]) {
      rolesByCategory[normalizedRoleCategory] = [];
    }
    rolesByCategory[normalizedRoleCategory].push(role);
  });

  roles.forEach((role) => {
    const normalizedRoleCategory = normalizeCategory(role.category);
    const categoryScore = categoryScores[normalizedRoleCategory] ?? 0;
    const rolesInCategory = rolesByCategory[normalizedRoleCategory]?.length ?? 1;

    roleScores[role.number] = categoryScore / rolesInCategory;
  });

  // スコアでソートしてトップ3を取得
  const sortedRoles = roles
    .map(role => ({
      role,
      score: roleScores[role.number] || 0,
    }))
    .filter(r => r.score > 0) // スコア0のロールは除外
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 最高スコアを100%として正規化
  const maxScore = sortedRoles[0]?.score || 1;
  const topRoles = sortedRoles.map(({ role, score }) => ({
    role,
    score,
    percentage: Math.round((score / maxScore) * 100),
  }));

  return {
    topRoles,
    answers,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 結果をURL用にエンコード（トップ3のロール番号のみ）
 */
export function encodeQuickResult(roleNumbers: number[]): string {
  return roleNumbers.join(',');
}

/**
 * URL文字列からロール番号をデコード
 */
export function decodeQuickResult(encoded: string): number[] {
  return encoded.split(',').map(Number).filter(n => !isNaN(n));
}
