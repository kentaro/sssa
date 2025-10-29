import type {
  QuickAssessmentAnswer,
  QuickAssessmentQuestion,
  QuickAssessmentResult,
  Role,
} from './types';

/**
 * クイック診断の回答からロールスコアを計算する
 */
export function calculateRoleScores(
  answers: QuickAssessmentAnswer[],
  questions: QuickAssessmentQuestion[],
  roles: Role[]
): QuickAssessmentResult {
  // 各ロールカテゴリのスコアを集計
  const categoryScores: { [category: string]: number } = {};

  answers.forEach((answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    // "どちらでもない"は加点しない
    if (answer.choice === 'neutral') {
      return;
    }

    const option = answer.choice === 'left'
      ? question.leftOption
      : question.rightOption;

    // 選択肢の重み付けをカテゴリスコアに加算
    Object.entries(option.weights).forEach(([category, weight]) => {
      categoryScores[category] = (categoryScores[category] || 0) + weight;
    });
  });

  // カテゴリスコアをロールスコアに変換
  // 各カテゴリ内のロールに均等にスコアを分配（ロール数による不利を調整）
  const roleScores: { [roleNumber: number]: number } = {};

  roles.forEach((role) => {
    const categoryScore = categoryScores[role.category] || 0;
    // カテゴリ内のロール数を取得
    const rolesInCategory = roles.filter(r => r.category === role.category).length;

    // ロール数による不利を緩和する調整係数
    // 1ロール: 係数1.0, 3ロール: 係数1.64, 9ロール: 係数2.69
    // これによりロール数が多いカテゴリの不利が軽減される
    const adjustmentFactor = Math.pow(rolesInCategory, 0.45);

    // スコアを均等分配し、調整係数を適用
    roleScores[role.number] = (categoryScore / rolesInCategory) * adjustmentFactor;
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
