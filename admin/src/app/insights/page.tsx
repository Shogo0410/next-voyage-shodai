"use client";

import { MOCK_USERS, getImprovementKPIs, generatePeriodSessions, generatePeriodKinen } from "@/lib/mock-data";

// This week vs last week
const thisWeekSessions = generatePeriodSessions(MOCK_USERS, 0);
const thisWeekKinen = generatePeriodKinen(MOCK_USERS, 0);
const lastWeekSessions = generatePeriodSessions(MOCK_USERS, 1);
const lastWeekKinen = generatePeriodKinen(MOCK_USERS, 1);

const improvement = getImprovementKPIs(
  MOCK_USERS, thisWeekSessions, thisWeekKinen,
  lastWeekSessions, lastWeekKinen,
);

function TrendBadge({ trend, delta }: { trend: "up" | "down" | "flat"; delta: number }) {
  if (trend === "flat" && delta === 0) return null;
  const isGood = trend === "up";
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${
      isGood ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
    }`}>
      {isGood ? "\u2191" : "\u2193"}
      {Math.abs(delta)}{Math.abs(delta) < 100 ? "pt" : ""}
    </span>
  );
}

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">改善ヒント</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">今週 vs 先週の比較から見えるアプリ改善のヒント</p>
      </div>

      {/* Section 1: Summary 3 cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Onboarding conversion */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">登録→初唱題</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{improvement.onboardingRate}%</p>
          <div className="mt-3 w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${improvement.onboardingRate}%` }} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{improvement.usersConverted} / {MOCK_USERS.length} 人が初唱題済み</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">平均 {improvement.avgDaysToFirst} 日で開始</p>
        </div>

        {/* Feature usage */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">機能べつ利用率</p>
          <div className="space-y-2.5">
            {improvement.featureUsage.map(f => (
              <div key={f.feature}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700 dark:text-gray-300">{f.feature}</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{f.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak drop-off */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">連続記録が途切れる日</p>
          <div className="space-y-2">
            {improvement.streakDropoffs.map(s => (
              <div key={s.day} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-300 w-12">{s.label}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 dark:bg-rose-500 rounded-full" style={{ width: `${s.dropRate}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right">{s.dropRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Conversion Funnel */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">コンバージョンファネル</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">登録から有料化までの各ステップの到達率</p>
        <div className="space-y-3">
          {improvement.funnel.map((f, i) => (
            <div key={f.step} className="flex items-center gap-4">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-24">{f.step}</span>
              <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden relative">
                <div
                  className={`h-full rounded-md transition-all ${
                    i === 0 ? "bg-blue-500 dark:bg-blue-400" :
                    i === 1 ? "bg-cyan-500 dark:bg-cyan-400" :
                    i === 2 ? "bg-teal-500 dark:bg-teal-400" :
                    "bg-emerald-500 dark:bg-emerald-400"
                  }`}
                  style={{ width: `${f.pct}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                  {f.count}人 ({f.pct}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Time of Day + Duration Distribution */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">よく使われる時間帯</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">セッション開始時刻の分布</p>
          <div className="space-y-2.5">
            {improvement.timeOfDay.map(t => (
              <div key={t.range} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 dark:text-gray-300 w-28 shrink-0">{t.label}</span>
                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 dark:bg-amber-400 rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right">{t.count}回</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">セッション時間の分布</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">平均 {improvement.avgDuration}分 / セッション</p>
          <div className="space-y-2.5">
            {improvement.durationDist.map(d => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 dark:text-gray-300 w-20 shrink-0">{d.label}</span>
                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 dark:bg-violet-400 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-16 text-right">{d.count}回 ({d.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Dynamic Improvement Suggestions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">データから見える改善ポイント</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">今週 vs 先週</span>
        </div>
        {improvement.suggestions.length === 0 ? (
          <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-5">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">問題なし</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">すべての指標が先週と同水準以上です</p>
          </div>
        ) : (
          <div className="space-y-3">
            {improvement.suggestions.map((s, i) => (
              <div
                key={i}
                className={`rounded-xl border p-5 ${
                  s.priority === "high"
                    ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                    : s.priority === "medium"
                    ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
                    : "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-0.5 shrink-0 ${
                    s.priority === "high"
                      ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : s.priority === "medium"
                      ? "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                      : "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  }`}>
                    {s.priority === "high" ? "重要" : s.priority === "medium" ? "検討" : "参考"}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 shrink-0">
                        {s.source}
                      </span>
                      <p className={`text-sm font-semibold ${
                        s.priority === "high" ? "text-red-800 dark:text-red-300" :
                        s.priority === "medium" ? "text-amber-800 dark:text-amber-300" :
                        "text-blue-800 dark:text-blue-300"
                      }`}>{s.title}</p>
                      <TrendBadge trend={s.trend} delta={s.delta} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{s.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
