"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  MOCK_USERS, generateMockSessions, generateMockKinen, generateMockJournals, generateMockBadges,
  MOOD_LABELS, CATEGORY_LABELS, BADGE_DEFS, type User
} from "@/lib/mock-data";

function formatDuration(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0 && m > 0) return `${h}時間${m}分`;
  if (h > 0) return `${h}時間`;
  return `${m}分`;
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const user = MOCK_USERS.find(u => u.userId === id);
  const [activeTab, setActiveTab] = useState<"sessions" | "kinen" | "journals" | "badges">("sessions");

  if (!user) {
    return (
      <div className="space-y-4">
        <Link href="/users" className="text-sm text-blue-600 dark:text-blue-400">← ユーザー一覧に戻る</Link>
        <p className="text-gray-500 dark:text-gray-400">ユーザーが見つかりません</p>
      </div>
    );
  }

  const sessions = generateMockSessions(user.userId, 15);
  const kinen = generateMockKinen(user.userId, 8);
  const journals = generateMockJournals(user.userId, 8);
  const badges = generateMockBadges(user.userId);

  const totalDuration = sessions.reduce((a, s) => a + s.duration, 0);
  const totalHen = sessions.reduce((a, s) => a + s.hen, 0);

  function statusBadge(u: User) {
    if (u.isBanned) return <span className="px-2.5 py-1 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">BAN</span>;
    if (u.subscriptionStatus === "canceled") return <span className="px-2.5 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">解約済</span>;
    if (u.plan === "premium") return <span className="px-2.5 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">有料 · Active</span>;
    return <span className="px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">無料</span>;
  }

  const TABS = [
    { key: "sessions" as const, label: "唱題履歴", count: sessions.length },
    { key: "kinen" as const, label: "祈念", count: kinen.length },
    { key: "journals" as const, label: "ジャーナル", count: journals.length },
    { key: "badges" as const, label: "バッジ", count: badges.length },
  ];

  return (
    <div className="space-y-6">
      <Link href="/users" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">← ユーザー一覧に戻る</Link>

      {/* Profile Header */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {user.userId.slice(-2)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white font-mono">{user.userId}</h1>
                {statusBadge(user)}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">登録: {new Date(user.createdAt).toLocaleDateString("ja-JP")}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              プラン変更
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-medium border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              {user.isBanned ? "BAN解除" : "BAN"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">累計唱題</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatDuration(totalDuration)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">累計遍数</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalHen.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">セッション数</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{sessions.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">登録日</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString("ja-JP")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">最終アクティブ</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{new Date(user.lastActiveAt).toLocaleDateString("ja-JP")}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.label} <span className="text-xs text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        {activeTab === "sessions" && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">日時</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">時間</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">遍数</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">タイマー</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ムード</th>
              </tr>
            </thead>
            <tbody>
              {sessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).map(s => (
                <tr key={s.sessionId} className="border-b border-gray-100 dark:border-gray-800/50">
                  <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">{new Date(s.startedAt).toLocaleString("ja-JP")}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDuration(s.duration)}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono">{s.hen.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{s.timerPreset === 0 ? "自由" : formatDuration(s.timerPreset)}</td>
                  <td className="px-5 py-3 text-sm">
                    {s.mood ? <span>{MOOD_LABELS[s.mood]}</span> : <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "kinen" && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {kinen.map(k => (
              <div key={k.kinenId} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{k.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{CATEGORY_LABELS[k.category]}</span>
                    {k.isPublic && <span className="text-xs text-blue-500">公開</span>}
                    {k.deadline && <span className="text-xs text-gray-400">期限: {new Date(k.deadline).toLocaleDateString("ja-JP")}</span>}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                  k.achievedAt
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : k.isOpen
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}>
                  {k.achievedAt ? "達成" : k.isOpen ? "進行中" : "クローズ"}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "journals" && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {journals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(j => (
              <div key={j.journalId} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{MOOD_LABELS[j.mood]}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{new Date(j.createdAt).toLocaleString("ja-JP")}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{formatDuration(j.duration)}</span>
                  {j.isPublic && <span className="text-xs text-blue-500 ml-1">公開</span>}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{j.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "badges" && (
          <div className="p-5 grid grid-cols-4 gap-3">
            {badges.map(b => {
              const def = BADGE_DEFS[b.badgeType];
              return def ? (
                <div key={b.badgeId} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{def.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(b.achievedAt).toLocaleDateString("ja-JP")}</p>
                </div>
              ) : null;
            })}
            {badges.length === 0 && (
              <p className="col-span-4 text-center text-sm text-gray-500 dark:text-gray-400 py-8">バッジなし</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
