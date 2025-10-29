import { loadSpaceSkillStandard, getCategories, getSkillsByCategory, getCategorySlug } from '@/lib/data-loader';
import CategoriesClient from './CategoriesClient';

export default function CategoriesPage() {
  const data = loadSpaceSkillStandard();
  const categories = getCategories(data);

  // 各カテゴリとそのスキルをまとめる
  const categoriesData = categories.map((category) => ({
    category,
    categorySlug: getCategorySlug(category),
    skills: getSkillsByCategory(data, category),
  }));

  return (
    <CategoriesClient
      categoriesData={categoriesData}
      evaluationAxes={data.evaluation_axes}
    />
  );
}
