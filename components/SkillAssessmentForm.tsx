'use client';

import { useState, useEffect } from 'react';
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

  // スキルが変わったときにassessmentをリセット
  useEffect(() => {
    setAssessment(initialAssessment);
    setExpandedAxis(null);
  }, [skill.number, initialAssessment]);

  const handleLevelChange = (axisNumber: number, level: number) => {
    const newAssessment = {
      ...assessment,
      [axisNumber]: level,
    };
    setAssessment(newAssessment);
    onAssessmentChange(newAssessment);
  };

  const handleSetAllToZero = () => {
    const newAssessment: SkillAssessment = {};
    evaluationAxes.forEach(axis => {
      newAssessment[axis.number] = 0;
    });
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
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
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

        {/* すべてLv.0に設定ボタン */}
        <div className="flex justify-end">
          <button
            onClick={handleSetAllToZero}
            className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            このスキルは経験なし（すべてLv.0に設定）
          </button>
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
            <div key={axis.number} className="border-2 border-gray-300 rounded-lg p-6 bg-white">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {axis.evaluation_axis}
                  </h4>
                  {skillLevel && (
                    <button
                      onClick={() => toggleAxisExpansion(axis.number)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
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
                  <div className="bg-indigo-50 rounded-lg p-4 mb-4 space-y-3 text-sm border border-indigo-200">
                    {Object.entries(skillLevel.levels).map(([level, description]) => (
                      <div key={level} className="flex gap-3">
                        <span className="flex-shrink-0 font-bold text-indigo-700 bg-white px-2 py-1 rounded">
                          Lv{level}
                        </span>
                        <span className="text-gray-800">{description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* レベル選択 */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {[0, 1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(axis.number, level)}
                    className={`py-3 sm:py-4 px-1 sm:px-2 rounded-xl border-2 transition-all font-bold text-center ${
                      selectedLevel === level
                        ? level === 0
                          ? 'border-gray-500 bg-gray-500 text-white shadow-lg transform scale-105'
                          : 'border-indigo-600 bg-indigo-600 text-white shadow-lg transform scale-105'
                        : level === 0
                        ? 'border-gray-300 bg-white hover:border-gray-400 text-gray-700 hover:bg-gray-100'
                        : 'border-gray-300 bg-white hover:border-indigo-400 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="text-xs mb-1 opacity-75">Level</div>
                    <div className="text-xl sm:text-2xl">{level}</div>
                  </button>
                ))}
              </div>

              {/* 選択されたレベルの説明 */}
              {selectedLevel !== undefined && selectedLevel !== null && skillLevel?.levels[selectedLevel] && (
                <div className={`mt-4 p-4 rounded-lg text-sm text-gray-800 border ${
                  selectedLevel === 0
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
                }`}>
                  <span className={`font-bold ${selectedLevel === 0 ? 'text-gray-700' : 'text-indigo-700'}`}>
                    選択中 (Lv{selectedLevel}):
                  </span>{' '}
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
