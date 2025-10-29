/**
 * 宇宙スキル標準のデータ型定義
 */

// メタデータ
export interface Metadata {
  title: string;
  source: string;
  year: number;
  extracted_at: string;
  description: string;
}

// スキル
export interface Skill {
  category: string;
  number: number;
  name: string;
  description: string;
}

// 業務
export interface Task {
  category: string;
  subcategory: string | null;
  number: number;
  name: string;
  description: string;
}

// スキルディクショナリ（スキルと業務のマッピング）
export interface SkillDictionary {
  task_category: string;
  task_name: string;
  skill_name: string;
}

// 評価軸
export interface EvaluationAxis {
  number: number;
  evaluation_axis: string;
}

// スキルレベル定義
export interface SkillLevel {
  category: string;
  skill_number: number;
  skill_name: string;
  evaluation_axis: string;
  levels: {
    [level: number]: string;
  };
}

// ロール（職種）
export interface Role {
  category: string;      // 職種カテゴリ（16種類）
  number: number;        // ロール番号（1-39）
  name: string;          // 職種名
  description: string;   // 職種の説明（責任・役割を含む）
}

// 参考プログラム
export interface ReferenceProgram {
  category: string;
  program_name: string;
  description: string;
  provider: string;
  url: string;
}

// 参考学問
export interface ReferenceSubject {
  category: string;
  subject_name: string;
  description: string;
}

// 参考資格検定
export interface ReferenceCertification {
  category: string;
  certification_name: string;
  provider: string;
  url: string;
}

// スキル×学問・資格検定
export interface SkillEducationCertification {
  skill_category: string;
  skill_number: number;
  skill_name: string;
  related_items: Array<{
    name: string;
    value: string;
  }>;
}

// 構造情報
export interface StructureInfo {
  description: string[];
  sheet_composition: Array<{
    sheet_name: string;
    content: string;
  }>;
}

// 完全なデータ構造
export interface SpaceSkillStandard {
  metadata: Metadata;
  skills: Skill[];
  tasks: Task[];
  skill_dictionary: SkillDictionary[];
  evaluation_axes: EvaluationAxis[];
  skill_levels: SkillLevel[];
  skill_education_certification: SkillEducationCertification[];
  roles: Role[];
  reference_programs: ReferenceProgram[];
  reference_subjects: ReferenceSubject[];
  reference_certifications: ReferenceCertification[];
  structure_info?: StructureInfo;
}

// アセスメント関連の型

// 単一スキルの評価（評価軸ごとのレベル）
export interface SkillAssessment {
  [axisNumber: number]: number; // 1-5のレベル
}

// カテゴリ内のアセスメント
export interface CategoryAssessment {
  [skillNumber: number]: SkillAssessment;
}

// 全アセスメントデータ
export interface AssessmentData {
  assessments: {
    [category: string]: CategoryAssessment;
  };
  lastUpdated: string;
}

// カテゴリ別のサマリー
export interface CategorySummary {
  category: string;
  averageScore: number;
  skillCount: number;
  assessedSkillCount: number;
  completionRate: number;
}

// 結果データ（パーマリンク用）
export interface AssessmentResult {
  version: string; // データバージョン
  timestamp: string;
  assessments: {
    [category: string]: CategoryAssessment;
  };
}

// クイック診断関連の型

// クイック診断の選択肢
export interface QuickAssessmentOption {
  text: string;
  emoji: string;
  weights: { [roleCategory: string]: number };
}

// クイック診断の質問
export interface QuickAssessmentQuestion {
  id: number;
  section: string;
  sectionNumber: number;
  leftOption: QuickAssessmentOption;
  rightOption: QuickAssessmentOption;
}

// クイック診断の回答
export interface QuickAssessmentAnswer {
  questionId: number;
  choice: 'left' | 'right' | 'neutral'; // neutral = どちらでもない
}

// クイック診断の結果
export interface QuickAssessmentResult {
  topRoles: Array<{
    role: Role;
    score: number;
    percentage: number;
  }>;
  answers: QuickAssessmentAnswer[];
  timestamp: string;
}
