'use client';

import { useState } from 'react';
import type { Skill, SkillLevel, SkillAssessment } from '@/lib/types';

interface SkillAssessmentFormProps {
  skill: Skill;
  skillLevels: SkillLevel[];
  evaluationAxes: Array<{ number: number; evaluation_axis: string }>;
  initialAssessment?: SkillAssessment;
  onAssessmentChange: (assessment: SkillAssessment) => void;
}

export default function SkillAssessmentForm({
  skill,
  skillLevels,
  evaluationAxes,
  initialAssessment = {},
  onAssessmentChange,
}: SkillAssessmentFormProps) {
  const [assessment, setAssessment] = useState<SkillAssessment>(initialAssessment);
  const [expandedAxis, setExpandedAxis] = useState<number | null>(null);

  const handleLevelChange = (axisNumber: number, level: number) => {
    const newAssessment = {
      ...assessment,
      [axisNumber]: level,
    };
    setAssessment(newAssessment);
    onAssessmentChange(newAssessment);
  };

  const toggleAxisExpansion = (axisNumber: number) => {
    setExpandedAxis(expandedAxis === axisNumber ? null : axisNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* スキル情報 */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
            {skill.number}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {skill.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {skill.description}
            </p>
          </div>
        </div>
      </div>

      {/* 評価軸ごとの評価 */}
      <div className="space-y-6">
        {evaluationAxes.map((axis) => {
          const skillLevel = skillLevels.find(
            (level) => level.evaluation_axis === axis.evaluation_axis
          );
          const selectedLevel = assessment[axis.number];
          const isExpanded = expandedAxis === axis.number;

          return (
            <div key={axis.number} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {axis.evaluation_axis}
                  </h4>
                  {skillLevel && (
                    <button
                      onClick={() => toggleAxisExpansion(axis.number)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      {isExpanded ? '詳細を閉じる' : 'レベル詳細を見る'}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
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
                  )}
                </div>

                {/* レベル詳細説明（展開時） */}
                {isExpanded && skillLevel && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
                    {Object.entries(skillLevel.levels).map(([level, description]) => (
                      <div key={level} className="flex gap-2">
                        <span className="flex-shrink-0 font-bold text-blue-600">
                          Lv{level}:
                        </span>
                        <span className="text-gray-700">{description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* レベル選択 */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(axis.number, level)}
                    className={`flex-1 py-3 px-2 rounded-lg border-2 transition font-semibold ${
                      selectedLevel === level
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="text-xs mb-1">Level</div>
                    <div className="text-lg">{level}</div>
                  </button>
                ))}
              </div>

              {/* 選択されたレベルの説明 */}
              {selectedLevel && skillLevel?.levels[selectedLevel] && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                  <span className="font-semibold">選択中 (Lv{selectedLevel}):</span>{' '}
                  {skillLevel.levels[selectedLevel]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
