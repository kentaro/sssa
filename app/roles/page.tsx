import { loadSpaceSkillStandard } from '@/lib/data-loader';
import RolesListClient from './RolesListClient';

export default function RolesListPage() {
  const data = loadSpaceSkillStandard();

  // ロールをカテゴリ別にグループ化
  const rolesByCategory = data.roles.reduce((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {} as Record<string, typeof data.roles>);

  return <RolesListClient rolesByCategory={rolesByCategory} />;
}
