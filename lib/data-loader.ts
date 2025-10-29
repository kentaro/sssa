/**
 * 宇宙スキル標準データのロードとパース
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { SpaceSkillStandard, Skill, SkillLevel } from './types';

let cachedData: SpaceSkillStandard | null = null;

/**
 * YAMLファイルから宇宙スキル標準データを読み込む
 */
export function loadSpaceSkillStandard(): SpaceSkillStandard {
  if (cachedData) {
    return cachedData;
  }

  const dataPath = path.join(process.cwd(), 'data', 'space_skill_standard_complete.yaml');
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const data = yaml.load(fileContents) as SpaceSkillStandard;

  cachedData = data;
  return data;
}

/**
 * スキルカテゴリの一覧を取得
 */
export function getCategories(data: SpaceSkillStandard): string[] {
  const categories = new Set<string>();
  data.skills.forEach(skill => {
    // カテゴリ名の改行を除去して正規化
    const normalizedCategory = skill.category.replace(/\n/g, '').trim();
    categories.add(normalizedCategory);
  });
  return Array.from(categories).filter(cat => cat !== '*'); // '*'カテゴリを除外
}

/**
 * カテゴリ名を正規化（改行除去）
 */
export function normalizeCategory(category: string): string {
  return category.replace(/\n/g, '').trim();
}

/**
 * カテゴリ名と英語スラッグのマッピング
 */
const CATEGORY_SLUG_MAP: { [key: string]: string } = {
  'プログラム創造・組成': 'program-creation',
  'プロジェクトマネジメント': 'project-management',
  '基盤技術': 'foundation-technology',
  '設計・解析': 'design-analysis',
  '試験': 'testing',
  '製造・加工': 'manufacturing',
  '打上げ・衛星運用': 'launch-operations',
  'コーポレート': 'corporate',
};

/**
 * スラッグからカテゴリ名のマッピング（逆引き）
 */
const SLUG_CATEGORY_MAP: { [key: string]: string } = Object.entries(CATEGORY_SLUG_MAP).reduce(
  (acc, [category, slug]) => {
    acc[slug] = category;
    return acc;
  },
  {} as { [key: string]: string }
);

/**
 * カテゴリのURLスラッグを生成
 */
export function getCategorySlug(category: string): string {
  const normalized = normalizeCategory(category);
  return CATEGORY_SLUG_MAP[normalized] || encodeURIComponent(normalized);
}

/**
 * スラッグからカテゴリ名を復元
 */
export function getCategoryFromSlug(slug: string): string {
  return SLUG_CATEGORY_MAP[slug] || decodeURIComponent(slug);
}

/**
 * 指定カテゴリのスキル一覧を取得
 */
export function getSkillsByCategory(
  data: SpaceSkillStandard,
  category: string
): Skill[] {
  const normalizedCategory = normalizeCategory(category);
  return data.skills.filter(
    skill => normalizeCategory(skill.category) === normalizedCategory
  );
}

/**
 * 指定スキルのスキルレベル定義を取得
 */
export function getSkillLevels(
  data: SpaceSkillStandard,
  skillNumber: number
): SkillLevel[] {
  return data.skill_levels.filter(
    level => level.skill_number === skillNumber
  );
}

/**
 * カテゴリに関連するロールを取得
 */
export function getRelatedRoles(
  data: SpaceSkillStandard,
  category: string
) {
  const normalizedCategory = normalizeCategory(category);
  return data.roles.filter(
    role => normalizeCategory(role.category) === normalizedCategory
  );
}

/**
 * カテゴリのスキル数を取得
 */
export function getSkillCountByCategory(
  data: SpaceSkillStandard
): Map<string, number> {
  const counts = new Map<string, number>();

  data.skills.forEach(skill => {
    const normalized = normalizeCategory(skill.category);
    if (normalized !== '*') {
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }
  });

  return counts;
}

/**
 * スキル番号からスキル情報を取得
 */
export function getSkillByNumber(
  data: SpaceSkillStandard,
  skillNumber: number
): Skill | undefined {
  return data.skills.find(skill => skill.number === skillNumber);
}
