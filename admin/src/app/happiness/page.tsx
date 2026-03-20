"use client";

import { MOCK_USERS, generateMockSessions, generateMockKinen, MOOD_LABELS, MOOD_EMOJI } from "@/lib/mock-data";

const allSessions = MOCK_USERS.flatMap(u => generateMockSessions(u.userId, 5));
const allKinen = MOCK_USERS.flatMap(u => generateMockKinen(u.userId, 4));
const totalKinen = allKinen.length;
const achievedKinen = allKinen.filter(k => k.achievedAt).length;
const kinenRate = totalKinen > 0 ? Math.round((achievedKinen / totalKinen) * 100) : 0;

const moodCounts: Record<string, number> = {};
allSessions.forEach(s => { if (s.mood) moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1; });
const totalMoodEntries = Object.values(moodCounts).reduce((a, b) => a + b, 0);
const moodDist = Object.entries(moodCounts)
  .map(([mood, count]) => ({ mood, count, pct: Math.round((count / totalMoodEntries) * 100) }))
  .sort((a, b) => b.count - a.count);

const avgStreak = 12;

export default function HappinessPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">幸福統計</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ユーザーの信仰活動と心の状態</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">祈念達成率</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{kinenRate}%</p>
          <div className="mt-3 w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${kinenRate}%` }} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{achievedKinen} / {totalKinen} 件達成</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">平均ストリーク</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{avgStreak}日</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">連続唱題の全ユーザー平均</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">ムード分布</p>
          <div className="space-y-2">
            {moodDist.slice(0, 5).map(m => (
              <div key={m.mood} className="flex items-center gap-2">
                <span className="text-sm w-5">{MOOD_EMOJI[m.mood]}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300 w-12">{MOOD_LABELS[m.mood]}</span>
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 dark:bg-blue-400 rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
