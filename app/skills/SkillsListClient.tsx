'use client';

import { useState, useRef } from 'react';
import type { Skill } from '@/lib/types';

// カテゴリのアイコンを取得
function getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    'プログラム創造・組成': '🎯',
    'プロジェクトマネジメント': '📊',
    '基盤技術': '💻',
    '設計・解析': '🔧',
    '試験': '🧪',
    '製造・加工': '⚙️',
    '打上げ・衛星運用': '🚀',
    'コーポレート': '💼',
  };
  return icons[category] || '📋';
}

interface SkillsListClientProps {
  categoriesData: Array<{
    category: string;
    skills: Skill[];
  }>;
}

export default function SkillsListClient({ categoriesData }: SkillsListClientProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleCategory = (category: string) => {
    const isExpanding = expandedCategory !== category;
    setExpandedCategory(expandedCategory === category ? null : category);

    // 展開する場合、少し遅延してからスクロール
    if (isExpanding) {
      setTimeout(() => {
        categoryRefs.current[category]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          スキル一覧
        </h1>
        <p className="text-gray-600">
          宇宙スキル標準に定義されている全{categoriesData.reduce((sum, cat) => sum + cat.skills.length, 0)}スキルを8つのカテゴリ別に表示しています。
        </p>
      </div>

      <div className="space-y-4">
        {categoriesData.map(({ category, skills }) => {
          const isExpanded = expandedCategory === category;
          const icon = getCategoryIcon(category);

          return (
            <div
              key={category}
              ref={(el) => { categoryRefs.current[category] = el; }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              {/* カテゴリヘッダー */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{icon}</span>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-900">
                      {category}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {skills.length}スキル項目
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-400 transition-transform ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* スキル一覧 */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6 space-y-4">
                    {skills.map((skill) => (
                      <div
                        key={skill.number}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {skill.number}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">
                              {skill.name}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {skill.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
