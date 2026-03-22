"use client";

import { MOCK_USERS } from "@/lib/mock-data";

const premium = MOCK_USERS.filter(u => u.plan === "premium" && u.subscriptionStatus === "active");
const free = MOCK_USERS.filter(u => u.plan === "free");
const canceled = MOCK_USERS.filter(u => u.subscriptionStatus === "canceled");
const mrr = premium.length * 500;
const premiumPct = Math.round((premium.length / MOCK_USERS.length) * 100);

// Mock monthly data
const monthlyData = [
  { month: "2025/10", newPremium: 8, canceled: 1, net: 7, mrr: 12000 },
  { month: "2025/11", newPremium: 12, canceled: 2, net: 10, mrr: 17000 },
  { month: "2025/12", newPremium: 15, canceled: 3, net: 12, mrr: 23000 },
  { month: "2026/01", newPremium: 18, canceled: 2, net: 16, mrr: 31000 },
  { month: "2026/02", newPremium: 22, canceled: 4, net: 18, mrr: 40000 },
  { month: "2026/03", newPremium: premium.length - 40, canceled: canceled.length, net: premium.length - 40 - canceled.length, mrr },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">課金管理</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">月額 ¥500 / 毎月1日課金</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MRR</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">¥{mrr.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">月次経常収益</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">有料ユーザー</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{premium.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">全体の {premiumPct}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">無料ユーザー</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{free.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">全体の {100 - premiumPct}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">解約（当月）</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{canceled.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">チャーン率 {MOCK_USERS.length > 0 ? ((canceled.length / MOCK_USERS.length) * 100).toFixed(1) : 0}%</p>
        </div>
      </div>

      {/* Conversion Bar */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">有料 / 無料 比率</h3>
        <div className="w-full h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-green-500 flex items-center justify-center text-xs font-bold text-white" style={{ width: `${premiumPct}%` }}>
            {premiumPct}%
          </div>
          <div className="h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300" style={{ width: `${100 - premiumPct}%` }}>
            {100 - premiumPct}%
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>有料 {premium.length}人</span>
          <span>無料 {free.length}人</span>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">月次推移</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">月</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">新規課金</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">解約</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">純増</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">MRR</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map(d => (
              <tr key={d.month} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{d.month}</td>
                <td className="px-4 py-3 text-sm text-right text-green-600 dark:text-green-400">+{d.newPremium}</td>
                <td className="px-4 py-3 text-sm text-right text-red-600 dark:text-red-400">-{d.canceled}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                  <span className={d.net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {d.net >= 0 ? "+" : ""}{d.net}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono text-gray-900 dark:text-white">¥{d.mrr.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Canceled Users */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">解約済ユーザー</h3>
        {canceled.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">解約ユーザーはいません</p>
        ) : (
          <div className="space-y-3">
            {canceled.map(u => (
              <div key={u.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {u.userId.slice(-2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">{u.userId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">解約済</span>
                  <p className="text-xs text-gray-400 mt-0.5">期間終了: {u.currentPeriodEnd ? new Date(u.currentPeriodEnd).toLocaleDateString("ja-JP") : "—"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
