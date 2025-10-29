interface QuickAssessmentProgressProps {
  current: number;
  total: number;
  section: string;
}

export default function QuickAssessmentProgress({
  current,
  total,
  section,
}: QuickAssessmentProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{section}</span>
        <span className="text-sm text-gray-600">
          {current} / {total}問
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
