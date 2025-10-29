'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategorySummary } from '@/lib/types';

interface CategoryRadarChartProps {
  summaries: CategorySummary[];
}

export default function CategoryRadarChart({ summaries }: CategoryRadarChartProps) {
  // カテゴリ名を短縮（スマホ対応）
  const shortenCategory = (category: string) => {
    const shortNames: { [key: string]: string } = {
      'プログラム創造・組成': 'プログラム',
      'プロジェクトマネジメント': 'PM',
      '基盤技術': '基盤技術',
      '設計・解析': '設計',
      '試験': '試験',
      '製造・加工': '製造',
      '打上げ・衛星運用': '運用',
      'コーポレート': '経営',
    };
    return shortNames[category] || category;
  };

  // rechartsのデータ形式に変換
  const data = summaries.map((summary) => ({
    category: shortenCategory(summary.category),
    fullCategory: summary.category,
    score: summary.averageScore,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">スキルプロファイル</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 5]} />
          <Radar
            name="平均スコア"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
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
