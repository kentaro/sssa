/**
 * カテゴリフィルタリングロジック
 * ユーザーの専門性に応じて推奨カテゴリを提示
 */

export type UserType = 'science' | 'liberal-arts';
export type ScienceType = 'engineering' | 'operations';

export interface CategoryGroup {
  name: string;
  description: string;
  categories: string[];
}

/**
 * 理系・文系の分類
 */
export const USER_TYPE_OPTIONS = {
  science: {
    label: '理系（技術系）',
    description: 'エンジニアリング、設計、開発、運用などの技術職',
  },
  'liberal-arts': {
    label: '文系（ビジネス系）',
    description: 'マネジメント、経営、法務、財務などのビジネス職',
  },
} as const;

/**
 * 理系の細分化
 */
export const SCIENCE_TYPE_OPTIONS = {
  engineering: {
    label: 'エンジニアリング・開発系',
    description: 'ソフトウェア、設計、解析などの開発業務',
  },
  operations: {
    label: '運用・製造・現場系',
    description: '試験、製造、打上げ、衛星運用などの現場業務',
  },
} as const;

/**
 * カテゴリグループのマッピング
 */
export const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
  'program-creation': {
    name: 'プログラム創造・組成',
    description: '新規事業・プログラムの企画立案',
    categories: ['プログラム創造・組成'],
  },
  'project-management': {
    name: 'プロジェクトマネジメント',
    description: 'プロジェクトの計画・実行・管理',
    categories: ['プロジェクトマネジメント'],
  },
  'foundation-tech': {
    name: '基盤技術',
    description: 'ソフトウェア、AI、データサイエンス',
    categories: ['基盤技術'],
  },
  'design-analysis': {
    name: '設計・解析',
    description: '構造、電気、熱、機構などの設計・解析',
    categories: ['設計・解析'],
  },
  'testing': {
    name: '試験',
    description: '機能試験、環境試験など',
    categories: ['試験'],
  },
  'manufacturing': {
    name: '製造・加工',
    description: '組立、加工、製造作業',
    categories: ['製造・加工'],
  },
  'launch-operations': {
    name: '打上げ・衛星運用',
    description: '射場管制、衛星運用など',
    categories: ['打上げ・衛星運用'],
  },
  'corporate': {
    name: 'コーポレート',
    description: '法務、財務、人事、総務など',
    categories: ['コーポレート'],
  },
};

/**
 * ユーザータイプに応じた推奨カテゴリを取得
 */
export function getRecommendedCategories(
  userType: UserType,
  scienceType?: ScienceType
): CategoryGroup[] {
  if (userType === 'liberal-arts') {
    // 文系: マネジメントとコーポレート
    return [
      CATEGORY_GROUPS['program-creation'],
      CATEGORY_GROUPS['project-management'],
      CATEGORY_GROUPS['corporate'],
    ];
  }

  // 理系
  if (scienceType === 'engineering') {
    // エンジニアリング系
    return [
      CATEGORY_GROUPS['program-creation'],
      CATEGORY_GROUPS['project-management'],
      CATEGORY_GROUPS['foundation-tech'],
      CATEGORY_GROUPS['design-analysis'],
    ];
  } else if (scienceType === 'operations') {
    // 運用・現場系
    return [
      CATEGORY_GROUPS['project-management'],
      CATEGORY_GROUPS['testing'],
      CATEGORY_GROUPS['manufacturing'],
      CATEGORY_GROUPS['launch-operations'],
    ];
  }

  // デフォルト: すべて
  return Object.values(CATEGORY_GROUPS);
}

/**
 * カテゴリ名からスラッグを取得
 */
export function getCategorySlugFromName(categoryName: string): string {
  const entry = Object.entries(CATEGORY_GROUPS).find(
    ([, group]) => group.categories.includes(categoryName)
  );
  return entry ? entry[0] : '';
}
