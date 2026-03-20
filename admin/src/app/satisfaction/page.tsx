"use client";

import { MOCK_USERS, getSatisfactionKPIs } from "@/lib/mock-data";

const satisfaction = getSatisfactionKPIs(MOCK_USERS);
const maxWeeklyActive = Math.max(...satisfaction.weeklyTrend.map(w => w.active), 1);

export default function SatisfactionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">満足度</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ユーザーがアプリに満足しているかの指標</p>
      </div>

      {/* Section 1: Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`rounded-xl border p-5 ${satisfaction.dauMauRatio >= 0.2 ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"}`}>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">毎日使ってる率</p>
          <p className={`text-3xl font-bold mt-1 ${satisfaction.dauMauRatio >= 0.2 ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}>
            {satisfaction.dauMauRatio.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">今日 {satisfaction.dau}人 / 月間 {satisfaction.mau}人</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{satisfaction.dauMauRatio >= 0.2 ? "良好" : "0.2以上が目標"}</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">7日後も続けてる率</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{satisfaction.retention7d}%</p>
          <div className="mt-3 w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${satisfaction.retention7d}%` }} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{satisfaction.retainedCount} / {satisfaction.eligibleCount} 人が継続</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">唱題を始めた率</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{satisfaction.coreFeatureRate}%</p>
          <div className="mt-3 w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${satisfaction.coreFeatureRate}%` }} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">登録後に唱題した人</p>
        </div>
      </div>

      {/* Section 2: Retention Curve */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">リテンションカーブ</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">登録からN日後にまだ使っている人の割合</p>
        <div className="flex items-end gap-3 h-40">
          {satisfaction.retentionCurve.map(r => (
            <div key={r.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-900 dark:text-white">{r.rate}%</span>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-md overflow-hidden" style={{ height: "100%" }}>
                <div
                  className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-md transition-all"
                  style={{ height: `${r.rate}%`, marginTop: `${100 - r.rate}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{r.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          {satisfaction.retentionCurve.map(r => (
            <div key={r.day} className="flex-1 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">{r.retained}/{r.eligible}人</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: User Segments */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">セグメント別の健康度</h2>
        <div className="grid grid-cols-3 gap-4">
          {satisfaction.segments.map(seg => (
            <div key={seg.name} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{seg.name}</p>
                <span className={`text-lg font-bold ${
                  seg.color === "green" ? "text-green-600 dark:text-green-400" :
                  seg.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                  "text-red-600 dark:text-red-400"
                }`}>{seg.count}人</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">平均セッション数</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{seg.avgSessions}回/月</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">平均唱題時間</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{seg.avgMinutes}分/回</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">平均非アクティブ</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{seg.avgInactiveDays}日</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Weekly Trend */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">週次アクティブユーザー推移</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">過去8週間のアクティブユーザー数</p>
        <div className="flex items-end gap-2 h-32">
          {satisfaction.weeklyTrend.map(w => {
            const heightPct = (w.active / maxWeeklyActive) * 100;
            return (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{w.active}</span>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-md" style={{ height: "100%" }}>
                  <div
                    className="w-full bg-indigo-500 dark:bg-indigo-400 rounded-t-md"
                    style={{ height: `${heightPct}%`, marginTop: `${100 - heightPct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{w.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: At-Risk */}
      <div className={`rounded-xl border p-5 ${satisfaction.atRiskCount > 0 ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" : "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">離脱リスク</p>
            <p className={`text-3xl font-bold mt-1 ${satisfaction.atRiskCount > 0 ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}>
              {satisfaction.atRiskCount}人
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">7日以上アプリを開いていないユーザー</p>
          </div>
          <div className="w-48">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">全体の</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {satisfaction.totalUsers > 0 ? Math.round((satisfaction.atRiskCount / satisfaction.totalUsers) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-3 bg-white/50 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${satisfaction.atRiskCount > 0 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${satisfaction.totalUsers > 0 ? (satisfaction.atRiskCount / satisfaction.totalUsers) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
