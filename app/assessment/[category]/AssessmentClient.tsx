'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCategoryAssessment, saveSkillAssessment, saveCategoryAssessment } from '@/lib/storage';
import { generatePermalinkUrl } from '@/lib/permalink';
import SkillAssessmentForm from '@/components/SkillAssessmentForm';
import ProgressIndicator from '@/components/ProgressIndicator';
import type { Skill, SkillLevel, EvaluationAxis, CategoryAssessment, SkillAssessment } from '@/lib/types';

interface AssessmentClientProps {
  category: string;
  skills: Skill[];
  skillLevelsMap: Map<number, SkillLevel[]>;
  evaluationAxes: EvaluationAxis[];
}

export default function AssessmentClient({
  category,
  skills,
  skillLevelsMap,
  evaluationAxes,
}: AssessmentClientProps) {
  const router = useRouter();

  const [categoryAssessment, setCategoryAssessment] = useState<CategoryAssessment>({});
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // LocalStorageから既存の評価を読み込む
  useEffect(() => {
    const savedAssessment = getCategoryAssessment(category);
    setCategoryAssessment(savedAssessment);
    setIsLoading(false);
  }, [category]);

  const currentSkill = skills[currentSkillIndex];
  const skillLevels = currentSkill ? skillLevelsMap.get(currentSkill.number) || [] : [];

  // 完了したスキル数を計算
  const completedSkills = Object.keys(categoryAssessment).filter((skillNumber) => {
    const assessment = categoryAssessment[parseInt(skillNumber)];
    return assessment && Object.keys(assessment).length === evaluationAxes.length;
  }).length;

  const handleAssessmentChange = (assessment: SkillAssessment) => {
    if (!currentSkill) return;

    const newCategoryAssessment = {
      ...categoryAssessment,
      [currentSkill.number]: assessment,
    };

    setCategoryAssessment(newCategoryAssessment);
    saveSkillAssessment(category, currentSkill.number, assessment);
  };

  const handleNext = () => {
    if (currentSkillIndex < skills.length - 1) {
      setCurrentSkillIndex(currentSkillIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSkillIndex > 0) {
      setCurrentSkillIndex(currentSkillIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkipToSkill = (index: number) => {
    setCurrentSkillIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    saveCategoryAssessment(category, categoryAssessment);

    // 結果ページへ遷移（URLパラメータで評価データを渡す）
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const permalink = generatePermalinkUrl(baseUrl, {
      [category]: categoryAssessment,
    });

    router.push(permalink.replace(baseUrl, ''));
  };

  const isAllComplete = completedSkills === skills.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/skills" className="hover:text-blue-600">
            スキル一覧
          </Link>
          <span>›</span>
          <span>{category}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category}</h1>
        <p className="text-gray-600">
          {skills.length}スキル × {evaluationAxes.length}評価軸
        </p>
      </div>

      {/* 進捗インジケーター */}
      <ProgressIndicator
        current={completedSkills}
        total={skills.length}
        label="評価完了スキル"
      />

      {/* スキルナビゲーション */}
      <div className="bg-white rounded-lg shadow-md p-4 my-6">
        <h2 className="font-semibold text-gray-900 mb-3">スキル一覧</h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {skills.map((skill, index) => {
            const isComplete =
              categoryAssessment[skill.number] &&
              Object.keys(categoryAssessment[skill.number]).length === evaluationAxes.length;
            const isCurrent = index === currentSkillIndex;

            return (
              <button
                key={skill.number}
                onClick={() => handleSkipToSkill(index)}
                className={`p-2 rounded text-sm font-semibold transition ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isComplete
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={skill.name}
              >
                {skill.number}
              </button>
            );
          })}
        </div>
      </div>

      {/* アセスメントフォーム */}
      {currentSkill && (
        <SkillAssessmentForm
          skill={currentSkill}
          skillLevels={skillLevels}
          evaluationAxes={evaluationAxes}
          initialAssessment={categoryAssessment[currentSkill.number] || {}}
          onAssessmentChange={handleAssessmentChange}
        />
      )}

      {/* ナビゲーションボタン */}
      <div className="flex items-center justify-between gap-4 my-8">
        <button
          onClick={handlePrevious}
          disabled={currentSkillIndex === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
            currentSkillIndex === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          前のスキル
        </button>

        <div className="text-center text-sm text-gray-600">
          {currentSkillIndex + 1} / {skills.length}
        </div>

        {currentSkillIndex < skills.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            次のスキル
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={!isAllComplete}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              isAllComplete
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title={isAllComplete ? '' : 'すべてのスキルを評価してください'}
          >
            結果を見る
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ヘルプ */}
      {!isAllComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">💡 評価のヒント</p>
          <ul className="list-disc list-inside space-y-1">
            <li>各評価軸で「レベル詳細を見る」をクリックすると、レベルごとの詳細説明が表示されます</li>
            <li>自分に最も当てはまるレベルを選択してください</li>
            <li>評価は自動保存されるため、途中で中断しても安心です</li>
          </ul>
        </div>
      )}
    </div>
  );
}
