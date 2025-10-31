import { loadSpaceSkillStandard } from '@/lib/data-loader';
import { loadKidsSpaceContent } from '@/lib/kids-data-loader';
import RolesListClient from './RolesListClient';

export default function RolesListPage() {
  const data = loadSpaceSkillStandard();
  const kidsContent = loadKidsSpaceContent();

  // ロールをカテゴリ別にグループ化（番号順にソート）
  const rolesByCategory = data.roles.reduce((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {} as Record<string, typeof data.roles>);

  // 各カテゴリ内のロールを番号順にソート
  Object.values(rolesByCategory).forEach((roles) => {
   roles.sort((a, b) => a.number - b.number);
 });

  return (
    <RolesListClient
      adultRolesByCategory={rolesByCategory}
      kidsContent={kidsContent}
    />
  );
}
