import type { QuickAssessmentQuestion } from '@/lib/types';

interface QuickAssessmentQuestionProps {
  question: QuickAssessmentQuestion;
  onAnswer: (choice: 'left' | 'right' | 'neutral') => void;
}

export default function QuickAssessmentQuestionComponent({
  question,
  onAnswer,
}: QuickAssessmentQuestionProps) {
  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* 左の選択肢 */}
        <button
          onClick={() => onAnswer('left')}
          className="group bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
            {question.leftOption.emoji}
          </div>
          <p className="text-base md:text-lg font-semibold text-gray-800 leading-relaxed">
            {question.leftOption.text}
          </p>
        </button>

        {/* 真ん中の選択肢（どちらでもない） */}
        <button
          onClick={() => onAnswer('neutral')}
          className="group bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200"
        >
          <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform">
            🤷
          </div>
          <p className="text-base md:text-lg font-semibold text-gray-600 leading-relaxed">
            どちらでもない
          </p>
        </button>

        {/* 右の選択肢 */}
        <button
          onClick={() => onAnswer('right')}
          className="group bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200"
        >
          <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
            {question.rightOption.emoji}
          </div>
          <p className="text-base md:text-lg font-semibold text-gray-800 leading-relaxed">
            {question.rightOption.text}
          </p>
        </button>
      </div>

      {/* キーボードヒント（デスクトップのみ表示） */}
      <div className="hidden md:flex justify-center items-center gap-6 mt-6 text-sm text-gray-500">
        <span>← 左キー</span>
        <span>↓ 真ん中キー</span>
        <span>→ 右キー</span>
      </div>
    </div>
  );
}
