import { loadSpaceSkillStandard, getSkillsByCategory, getCategoryFromSlug, getSkillLevels, getCategories, getCategorySlug } from '@/lib/data-loader';
import AssessmentClient from './AssessmentClient';
import Link from 'next/link';

interface AssessmentPageProps {
  params: Promise<{ category: string }>;
}

// Static export用のパラメータ生成
export function generateStaticParams() {
  const data = loadSpaceSkillStandard();
  const categories = getCategories(data);

  return categories.map((category) => ({
    category: getCategorySlug(category),
  }));
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const resolvedParams = await params;
  const category = getCategoryFromSlug(resolvedParams.category);

  const data = loadSpaceSkillStandard();
  const skills = getSkillsByCategory(data, category);
  const evaluationAxes = data.evaluation_axes;

  // 各スキルのレベル定義を取得
  const skillLevelsMap = new Map();
  skills.forEach((skill) => {
    const levels = getSkillLevels(data, skill.number);
    skillLevelsMap.set(skill.number, levels);
  });

  if (skills.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            このカテゴリにはスキルが登録されていません。
          </p>
          <Link href="/skills" className="text-blue-600 hover:underline mt-4 inline-block">
            スキル一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AssessmentClient
      category={category}
      skills={skills}
      skillLevelsMap={skillLevelsMap}
      evaluationAxes={evaluationAxes}
    />
  );
}
