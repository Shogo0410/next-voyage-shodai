"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_USERS, type User } from "@/lib/mock-data";

type Filter = "all" | "premium" | "free" | "canceled" | "banned";
type SortKey = "createdAt" | "lastActiveAt" | "name";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("lastActiveAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = MOCK_USERS
    .filter(u => {
      if (search && !u.name.includes(search) && !u.email.includes(search) && !u.userId.includes(search)) return false;
      if (filter === "premium") return u.plan === "premium" && u.subscriptionStatus === "active";
      if (filter === "free") return u.plan === "free";
      if (filter === "canceled") return u.subscriptionStatus === "canceled";
      if (filter === "banned") return u.isBanned;
      return true;
    })
    .sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortKey === "name") { av = a.name; bv = b.name; }
      else { av = new Date(a[sortKey]).getTime(); bv = new Date(b[sortKey]).getTime(); }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sortIcon = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  function statusBadge(u: User) {
    if (u.isBanned) return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">BAN</span>;
    if (u.subscriptionStatus === "canceled") return <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">解約済</span>;
    if (u.plan === "premium") return <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">有料</span>;
    return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">無料</span>;
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: `全て (${MOCK_USERS.length})` },
    { key: "premium", label: `有料 (${MOCK_USERS.filter(u => u.plan === "premium" && u.subscriptionStatus === "active").length})` },
    { key: "free", label: `無料 (${MOCK_USERS.filter(u => u.plan === "free").length})` },
    { key: "canceled", label: `解約 (${MOCK_USERS.filter(u => u.subscriptionStatus === "canceled").length})` },
    { key: "banned", label: `BAN (${MOCK_USERS.filter(u => u.isBanned).length})` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ユーザー管理</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{MOCK_USERS.length} 人のユーザー</p>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="名前、メール、IDで検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-80 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-1">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ユーザー</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ステータス</th>
              <th
                className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => handleSort("lastActiveAt")}
              >
                最終アクティブ{sortIcon("lastActiveAt")}
              </th>
              <th
                className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => handleSort("createdAt")}
              >
                登録日{sortIcon("createdAt")}
              </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.userId} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${u.avatarColor}20`, color: u.avatarColor }}>
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">{statusBadge(u)}</td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(u.lastActiveAt).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(u.createdAt).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/users/${u.userId}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    詳細 →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            該当するユーザーが見つかりません
          </div>
        )}
      </div>
    </div>
  );
}
