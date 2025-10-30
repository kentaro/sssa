import { loadSpaceSkillStandard, getCategories, getSkillsByCategory } from '@/lib/data-loader';
import SkillsListClient from './SkillsListClient';

export default function SkillsListPage() {
  const data = loadSpaceSkillStandard();
  const categories = getCategories(data);

  // 各カテゴリとそのスキルをまとめる
  const categoriesData = categories.map((category) => ({
    category,
    skills: getSkillsByCategory(data, category),
  }));

  return <SkillsListClient categoriesData={categoriesData} />;
}
