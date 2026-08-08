import { Award } from 'lucide-react';

interface TopicStats {
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
}

interface MockTestSummaryProps {
  percentage: number;
  scoreMessage: string;
  correct: number;
  wrong: number;
  skipped: number;
  usedTimeFormatted: string;
  topicsBreakdown: Record<string, TopicStats>;
  onRestart: () => void;
}

export default function MockTestSummary({
  percentage,
  scoreMessage,
  correct,
  wrong,
  skipped,
  usedTimeFormatted,
  topicsBreakdown,
  onRestart
}: MockTestSummaryProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-8 p-8 text-center notranslate">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 border-[8px] border-blue-100 dark:border-blue-900/50">
        <Award className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">Your Final Score</h2>
      <div className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">{percentage}%</div>
      <p className="text-lg font-medium text-slate-800 dark:text-white mb-8">{scoreMessage}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correct}</div>
          <div className="text-sm text-green-700 dark:text-green-500 font-medium mt-1">Correct</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{wrong}</div>
          <div className="text-sm text-red-700 dark:text-red-500 font-medium mt-1">Wrong</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{skipped}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Skipped</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{usedTimeFormatted}</div>
          <div className="text-sm text-blue-700 dark:text-blue-500 font-medium mt-1">Time Used</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 text-left">Performance by Topic</h3>
        <div className="space-y-3">
          {Object.entries(topicsBreakdown).map(([topic, stats]) => (
            <div key={topic} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-left gap-4">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex-1">{topic}</div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="text-green-600 dark:text-green-400">{stats.correct} Correct</div>
                <div className="text-red-600 dark:text-red-400">{stats.wrong} Wrong</div>
                <div className="text-slate-500 dark:text-slate-400">{stats.skipped} Skipped</div>
                <div className="text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md min-w-[3rem] text-center">{Math.round((stats.correct / stats.total) * 100)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onRestart} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
        Restart Test
      </button>
    </div>
  );
}
