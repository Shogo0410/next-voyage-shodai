"use client";

import { MOCK_USERS, getDashboardKPIs } from "@/lib/mock-data";

const kpis = getDashboardKPIs(MOCK_USERS);
const chantingParticipation = 68;

const recentUsers = [...MOCK_USERS]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);

const recentCanceled = MOCK_USERS.filter(u => u.subscriptionStatus === "canceled").slice(0, 5);

function KPICard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800"}`}>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent ? "text-green-700 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">概要</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Shodai 管理画面</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="総ユーザー" value={kpis.total.toLocaleString()} sub={`有料 ${kpis.premium} / 無料 ${kpis.free}`} />
        <KPICard label="今月の売上" value={`¥${kpis.mrr.toLocaleString()}`} sub={`${kpis.premium}人 × ¥500`} accent />
        <KPICard label="今日のアクティブ" value={kpis.activeToday.toLocaleString()} sub={`参加率 ${chantingParticipation}%`} />
        <KPICard label="解約 / BAN" value={`${kpis.canceled} / ${kpis.banned}`} sub="当月" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">最近の登録</h3>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${u.avatarColor}20`, color: u.avatarColor }}>
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${u.plan === "premium" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                    {u.plan === "premium" ? "有料" : "無料"}
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(u.createdAt).toLocaleDateString("ja-JP")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">解約ユーザー</h3>
          {recentCanceled.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">解約ユーザーはいません</p>
          ) : (
            <div className="space-y-3">
              {recentCanceled.map(u => (
                <div key={u.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${u.avatarColor}20`, color: u.avatarColor }}>
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    解約済
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
