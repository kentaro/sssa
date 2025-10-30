'use client';

import { useState } from 'react';
import type { Role } from '@/lib/types';

interface RolesListClientProps {
  rolesByCategory: Record<string, Role[]>;
}

export default function RolesListClient({ rolesByCategory }: RolesListClientProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // カテゴリをソート（各カテゴリの最初の職種番号順）
  const sortedCategories = Object.entries(rolesByCategory).sort(
    ([, a], [, b]) => a[0].number - b[0].number
  );

  const totalRoles = Object.values(rolesByCategory).reduce((sum, roles) => sum + roles.length, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          職種一覧
        </h1>
        <p className="text-gray-600">
          宇宙スキル標準に定義されている全{totalRoles}職種を16カテゴリ別に表示しています。
        </p>
      </div>

      <div className="space-y-4">
        {sortedCategories.map(([category, roles]) => {
          const isExpanded = expandedCategories.has(category);
          const normalizedCategory = category.replace(/\n/g, ' ');

          return (
            <div
              key={category}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              {/* カテゴリヘッダー */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-900">
                      {normalizedCategory}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {roles.length}職種
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

              {/* 職種一覧 */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6 space-y-4">
                    {roles.map((role) => (
                      <div
                        key={role.number}
                        className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold">
                            {role.number}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                              {role.name}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {role.description}
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
