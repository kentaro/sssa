import { loadSpaceSkillStandard } from '@/lib/data-loader';
import RecommendationsClient from './RecommendationsClient';

export default function RecommendationsPage() {
  const data = loadSpaceSkillStandard();

  // カテゴリ別のスキル数を計算
  const categorySkillCounts: { [key: string]: number } = {};
  data.skills.forEach(skill => {
    const category = skill.category.replace(/\n/g, '').trim();
    categorySkillCounts[category] = (categorySkillCounts[category] || 0) + 1;
  });

  return <RecommendationsClient categorySkillCounts={categorySkillCounts} />;
}
