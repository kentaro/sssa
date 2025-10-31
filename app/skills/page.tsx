import { loadSpaceSkillStandard, getCategories, getSkillsByCategory, getCategorySlug } from '@/lib/data-loader';
import { loadKidsSpaceContent } from '@/lib/kids-data-loader';
import SkillsListClient from './SkillsListClient';

export default function SkillsListPage() {
  const data = loadSpaceSkillStandard();
  const categories = getCategories(data);
  const kidsContent = loadKidsSpaceContent();

  // 各カテゴリとそのスキルをまとめる
  const adultCategories = categories.map((category) => ({
    category,
    skills: getSkillsByCategory(data, category),
    categoryId: getCategorySlug(category),
  }));

  return (
    <SkillsListClient
      adultCategories={adultCategories}
      kidsCategories={kidsContent.categories}
    />
  );
}
