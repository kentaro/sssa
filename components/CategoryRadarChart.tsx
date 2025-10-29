'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategorySummary } from '@/lib/types';

interface CategoryRadarChartProps {
  summaries: CategorySummary[];
}

export default function CategoryRadarChart({ summaries }: CategoryRadarChartProps) {
  // rechartsのデータ形式に変換
  const data = summaries.map((summary) => ({
    category: summary.category.length > 12 ? summary.category.substring(0, 12) + '...' : summary.category,
    fullCategory: summary.category,
    score: summary.averageScore,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">スキルプロファイル</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={90} domain={[0, 5]} />
          <Radar
            name="平均スコア"
            dataKey="score"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Legend />
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                  <p className="font-semibold text-gray-900">{data.fullCategory}</p>
                  <p className="text-sm text-gray-600">
                    平均スコア: <span className="font-semibold text-blue-600">{data.score.toFixed(2)}</span> / 5.0
                  </p>
                </div>
              );
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
