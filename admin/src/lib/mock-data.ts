// Mock data for admin dashboard UI development
// This will be replaced with Firestore queries later

export type User = {
  userId: string;
  name: string;
  email: string;
  avatarColor: string;
  bio: string;
  lang: "ja" | "en";
  plan: "free" | "premium";
  subscriptionStatus: "active" | "canceled" | "none";
  premiumSince: string | null;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  isPublic: boolean;
  livePublic: boolean;
  journalDefaultPublic: boolean;
  createdAt: string;
  lastActiveAt: string;
  isBanned: boolean;
};

export type Session = {
  sessionId: string;
  userId: string;
  duration: number;
  hen: number;
  timerPreset: number;
  mood: string | null;
  startedAt: string;
  endedAt: string;
};

export type Kinen = {
  kinenId: string;
  userId: string;
  text: string;
  category: string;
  isOpen: boolean;
  isPublic: boolean;
  deadline: string | null;
  achievedAt: string | null;
  createdAt: string;
};

export type Journal = {
  journalId: string;
  userId: string;
  text: string;
  mood: string;
  sessionId: string | null;
  duration: number;
  isPublic: boolean;
  photoUrl: string | null;
  createdAt: string;
};

export type Badge = {
  badgeId: string;
  userId: string;
  badgeType: string;
  achievedAt: string;
};

const MOODS = ["peaceful", "passionate", "grateful", "determined", "growth", "tears", "conviction", "joy"];
const MOOD_LABELS: Record<string, string> = {
  peaceful: "穏やか", passionate: "情熱", grateful: "感謝", determined: "決意",
  growth: "成長", tears: "涙", conviction: "確信", joy: "歓喜",
};
const CATEGORIES = ["personal", "family", "work", "health", "study", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  personal: "自分", family: "家族", work: "仕事", health: "健康", study: "学会", other: "その他",
};

export { MOOD_LABELS, CATEGORY_LABELS };

const BADGE_DEFS: Record<string, { label: string }> = {
  streak_7: { label: "7日連続唱題" },
  streak_30: { label: "30日連続唱題" },
  hen_10000: { label: "1万遍達成" },
  journals_10: { label: "ジャーナル10件" },
  followers_5: { label: "フォロワー5人" },
  kinen_achieved_5: { label: "祈念5件達成" },
  total_hours_100: { label: "累計100時間" },
  mood_complete: { label: "全気分コンプ" },
};
export { BADGE_DEFS };

const names = ["田中太郎","山本花子","佐藤健一","鈴木美咲","高橋翔太","渡辺由美","伊藤大輔","中村さくら","小林隆","加藤真理","吉田拓海","山田恵子","松本翼","井上愛","木村俊介","林美穂","斉藤一郎","清水香織","山口雅人","池田千春","前田浩二","藤田裕子","石井直樹","岡田明日香","長谷川誠","森田結衣","近藤洋平","阿部智子","坂本龍一","三浦七海","島田勇気","高木麗","原田修","安藤美月","西村陽太","上野紗希","丸山大地","武田理恵","小川悠馬","大西凛","杉山正人","河野紀子","石田圭吾","中島亜美","藤本慎也","村上遥","金子敬太","矢野優花","内田拓也","野口沙耶"];
const colors = ["#7B9FD4","#D4A07B","#7BD4A0","#D47BA0","#A07BD4","#D4C87B","#7BD4D4","#D47B7B","#C8A96E","#6ECF8E","#E8C547","#A8B4E0"];

function randomDate(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return new Date(s + Math.random() * (e - s)).toISOString();
}

export function generateMockUsers(count: number = 50): User[] {
  return Array.from({ length: count }, (_, i) => {
    const isPremium = Math.random() > 0.35;
    const isCanceled = isPremium && Math.random() < 0.1;
    const createdAt = randomDate("2024-01-01", "2026-03-01");
    return {
      userId: `user_${String(i + 1).padStart(4, "0")}`,
      name: names[i % names.length],
      email: `user${i + 1}@example.com`,
      avatarColor: colors[i % colors.length],
      bio: "毎日の唱題で人間革命！",
      lang: Math.random() > 0.15 ? "ja" : "en",
      plan: isPremium ? "premium" : "free",
      subscriptionStatus: isPremium ? (isCanceled ? "canceled" : "active") : "none",
      premiumSince: isPremium ? randomDate(createdAt, "2026-03-19") : null,
      currentPeriodEnd: isPremium ? "2026-03-31T23:59:59Z" : null,
      stripeCustomerId: isPremium ? `cus_${Math.random().toString(36).slice(2, 12)}` : null,
      isPublic: Math.random() > 0.3,
      livePublic: Math.random() > 0.4,
      journalDefaultPublic: Math.random() > 0.7,
      createdAt,
      lastActiveAt: randomDate("2026-02-01", "2026-03-19"),
      isBanned: Math.random() < 0.02,
    };
  });
}

export function generateMockSessions(userId: string, count: number = 20): Session[] {
  return Array.from({ length: count }, (_, i) => {
    const dur = [300, 600, 900, 1200, 1800, 2700, 3600][Math.floor(Math.random() * 7)];
    const startedAt = randomDate("2026-01-01", "2026-03-19");
    return {
      sessionId: `ses_${userId}_${i}`,
      userId,
      duration: dur,
      hen: Math.round(dur * (10000 / (3 * 3600))),
      timerPreset: [300, 600, 900, 1800, 3600, 0][Math.floor(Math.random() * 6)],
      mood: Math.random() > 0.2 ? MOODS[Math.floor(Math.random() * MOODS.length)] : null,
      startedAt,
      endedAt: new Date(new Date(startedAt).getTime() + dur * 1000).toISOString(),
    };
  });
}

export function generateMockKinen(userId: string, count: number = 6): Kinen[] {
  const texts = ["広宣流布の大願成就","家族全員の健康と幸福","仕事のプロジェクト成功","後輩の成長と勝利","自分自身の人間革命","地区の折伏目標達成","資格試験合格","母の病気平癒"];
  return Array.from({ length: count }, (_, i) => {
    const isAchieved = Math.random() < 0.25;
    return {
      kinenId: `kin_${userId}_${i}`,
      userId,
      text: texts[i % texts.length],
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      isOpen: !isAchieved,
      isPublic: Math.random() > 0.5,
      deadline: Math.random() > 0.6 ? randomDate("2026-04-01", "2026-12-31") : null,
      achievedAt: isAchieved ? randomDate("2025-06-01", "2026-03-19") : null,
      createdAt: randomDate("2024-06-01", "2026-02-01"),
    };
  });
}

export function generateMockJournals(userId: string, count: number = 8): Journal[] {
  const texts = [
    "今朝の唱題は格別だった。後輩のことを真剣に祈っていたら、具体的にどう関わるべきか明確に見えてきた。",
    "夜の唱題。今日一日を振り返って、家族の健康に心から感謝。",
    "朝の勤行。今月の折伏目標について真剣に祈った。自分の弱さと向き合う時間になった。",
    "昼休みに短い唱題。仕事のプレッシャーで押しつぶされそうだったけど、変毒為薬の精神を思い出した。",
    "静かな朝の唱題。特別なことは起きなかったけど、とても穏やかな時間。",
    "夜遅くの唱題。後輩が退転しそうだと聞いて、胸が痛い。でも祈り続ける。",
    "題目の力を実感した一日。不可能だと思っていた案件が動き出した。",
    "感謝の唱題。支えてくれる同志がいることのありがたさ。",
  ];
  return Array.from({ length: count }, (_, i) => ({
    journalId: `jnl_${userId}_${i}`,
    userId,
    text: texts[i % texts.length],
    mood: MOODS[Math.floor(Math.random() * MOODS.length)],
    sessionId: `ses_${userId}_${i}`,
    duration: [300, 600, 900, 1800][Math.floor(Math.random() * 4)],
    isPublic: Math.random() > 0.6,
    photoUrl: null,
    createdAt: randomDate("2026-01-01", "2026-03-19"),
  }));
}

export function generateMockBadges(userId: string): Badge[] {
  const types = Object.keys(BADGE_DEFS);
  const count = Math.floor(Math.random() * 5) + 1;
  return types.slice(0, count).map((t, i) => ({
    badgeId: `bdg_${userId}_${i}`,
    userId,
    badgeType: t,
    achievedAt: randomDate("2024-06-01", "2026-03-19"),
  }));
}

// Pre-generated data
export const MOCK_USERS = generateMockUsers(50);

// Dashboard KPIs
export function getDashboardKPIs(users: User[]) {
  const total = users.length;
  const premium = users.filter(u => u.plan === "premium" && u.subscriptionStatus === "active").length;
  const free = users.filter(u => u.plan === "free").length;
  const canceled = users.filter(u => u.subscriptionStatus === "canceled").length;
  const banned = users.filter(u => u.isBanned).length;
  const mrr = premium * 500;
  const today = new Date().toISOString().split("T")[0];
  const activeToday = users.filter(u => u.lastActiveAt.startsWith(today)).length;

  return { total, premium, free, canceled, banned, mrr, activeToday };
}

// Satisfaction KPIs (mock values - will be replaced with real calculations)
export function getSatisfactionKPIs(users: User[]) {
  const total = users.length;

  // DAU/MAU ratio: daily active / monthly active
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dau = users.filter(u => u.lastActiveAt.startsWith(today)).length;
  const mau = users.filter(u => new Date(u.lastActiveAt) >= thirtyDaysAgo).length;
  const dauMauRatio = mau > 0 ? dau / mau : 0;

  // 7-day retention: users created >= 7 days ago who were active in last 7 days
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const eligibleForRetention = users.filter(u => new Date(u.createdAt) <= sevenDaysAgo);
  const retainedUsers = eligibleForRetention.filter(u => new Date(u.lastActiveAt) >= sevenDaysAgo);
  const retention7d = eligibleForRetention.length > 0
    ? Math.round((retainedUsers.length / eligibleForRetention.length) * 100)
    : 0;

  // Core feature reach: users who have used sessions (simulated - use lastActiveAt as proxy)
  // In production, this would check if user has at least 1 session
  const coreFeatureUsers = users.filter(u => {
    const daysSinceCreation = (now.getTime() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation >= 1 && Math.random() < 0.72; // mock: ~72% reach core feature
  });
  const coreFeatureRate = total > 0 ? Math.round((coreFeatureUsers.length / total) * 100) : 0;

  // Retention curve: 1/3/7/14/30 day retention
  const retentionCurve = [1, 3, 7, 14, 30].map(days => {
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const eligible = users.filter(u => new Date(u.createdAt) <= cutoff);
    const retained = eligible.filter(u => new Date(u.lastActiveAt) >= cutoff);
    return {
      day: days,
      label: `${days}日`,
      rate: eligible.length > 0 ? Math.round((retained.length / eligible.length) * 100) : 0,
      retained: retained.length,
      eligible: eligible.length,
    };
  });

  // Segments: premium / free / at-risk (active but might churn)
  const premiumUsers = users.filter(u => u.plan === "premium" && u.subscriptionStatus === "active");
  const freeUsers = users.filter(u => u.plan === "free");
  const atRiskCandidates = users.filter(u => {
    const daysSinceActive = (now.getTime() - new Date(u.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceActive >= 7 && !u.isBanned && u.subscriptionStatus !== "canceled";
  });

  const avgDaysSinceActive = (list: User[]) => {
    if (list.length === 0) return 0;
    const total = list.reduce((sum, u) => sum + (now.getTime() - new Date(u.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24), 0);
    return Math.round(total / list.length);
  };

  const segments = [
    { name: "有料ユーザー", count: premiumUsers.length, avgInactiveDays: avgDaysSinceActive(premiumUsers), avgSessions: 18, avgMinutes: 42, color: "green" },
    { name: "無料ユーザー", count: freeUsers.length, avgInactiveDays: avgDaysSinceActive(freeUsers), avgSessions: 6, avgMinutes: 15, color: "blue" },
    { name: "離脱予備軍", count: atRiskCandidates.length, avgInactiveDays: avgDaysSinceActive(atRiskCandidates), avgSessions: 2, avgMinutes: 5, color: "red" },
  ];

  // Weekly trend: past 8 weeks active user counts
  const weeklyTrend = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now.getTime() - (7 - i) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const active = users.filter(u => {
      const lastActive = new Date(u.lastActiveAt);
      return lastActive >= weekStart && lastActive < weekEnd;
    }).length;
    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    return { week: i + 1, label: weekLabel, active };
  });

  // At-risk count
  const atRiskCount = atRiskCandidates.length;

  return {
    dauMauRatio: Math.round(dauMauRatio * 100) / 100,
    dau,
    mau,
    retention7d,
    retainedCount: retainedUsers.length,
    eligibleCount: eligibleForRetention.length,
    coreFeatureRate,
    retentionCurve,
    segments,
    weeklyTrend,
    atRiskCount,
    totalUsers: total,
  };
}

// Improvement hints KPIs
// Generate period-specific data with intentionally different characteristics
// weekOffset=0: this week (worse metrics to show actionable insights)
// weekOffset=1: last week (better metrics as baseline)
export function generatePeriodSessions(users: User[], weekOffset: number): Session[] {
  const baseDate = new Date("2026-03-20");
  baseDate.setDate(baseDate.getDate() - weekOffset * 7);
  const weekStart = new Date(baseDate);
  weekStart.setDate(weekStart.getDate() - 7);

  // This week: fewer sessions, shorter durations, more late-night
  // Last week: more sessions, longer durations, more morning
  const sessionMultiplier = weekOffset === 0 ? 3 : 5;
  const durationPool = weekOffset === 0
    ? [300, 300, 600, 600, 900, 1200]       // shorter this week
    : [600, 900, 1200, 1800, 2700, 3600];   // longer last week

  // Only a subset of users are active each week
  const activeRate = weekOffset === 0 ? 0.55 : 0.72;
  const activeUsers = users.filter((_, i) => {
    // Use deterministic "randomness" so it's stable per render
    const hash = (i * 7 + weekOffset * 13 + 37) % 100;
    return hash < activeRate * 100;
  });

  return activeUsers.flatMap((u, ui) =>
    Array.from({ length: sessionMultiplier }, (_, si) => {
      const seed = (ui * 31 + si * 17 + weekOffset * 53) % 1000;
      const dayOffset = seed % 7;
      const hourSeed = (seed * 7 + si * 3) % 24;
      // This week: more late-night sessions; Last week: more morning
      const hour = weekOffset === 0
        ? (hourSeed < 8 ? 22 + (hourSeed % 4) : 5 + (hourSeed % 16))
        : (hourSeed < 12 ? 6 + (hourSeed % 4) : 8 + (hourSeed % 14));
      const dur = durationPool[seed % durationPool.length];
      const d = new Date(weekStart);
      d.setDate(d.getDate() + dayOffset);
      d.setHours(hour % 24, seed % 60, 0, 0);

      const moodIdx = seed % (MOODS.length + 2); // +2 to sometimes have null
      return {
        sessionId: `ses_p${weekOffset}_${u.userId}_${si}`,
        userId: u.userId,
        duration: dur,
        hen: Math.round(dur * (10000 / (3 * 3600))),
        timerPreset: [300, 600, 900, 1800, 3600, 0][seed % 6],
        mood: moodIdx < MOODS.length ? MOODS[moodIdx] : null,
        startedAt: d.toISOString(),
        endedAt: new Date(d.getTime() + dur * 1000).toISOString(),
      };
    })
  );
}

export function generatePeriodKinen(users: User[], weekOffset: number): Kinen[] {
  const texts = ["広宣流布の大願成就","家族全員の健康と幸福","仕事のプロジェクト成功","後輩の成長と勝利"];
  const achieveRate = weekOffset === 0 ? 0.15 : 0.30; // lower this week

  return users.flatMap((u, ui) =>
    Array.from({ length: 3 }, (_, ki) => {
      const seed = (ui * 11 + ki * 23 + weekOffset * 41) % 100;
      const isAchieved = seed < achieveRate * 100;
      return {
        kinenId: `kin_p${weekOffset}_${u.userId}_${ki}`,
        userId: u.userId,
        text: texts[(ui + ki) % texts.length],
        category: CATEGORIES[seed % CATEGORIES.length],
        isOpen: !isAchieved,
        isPublic: seed % 2 === 0,
        deadline: null,
        achievedAt: isAchieved ? "2026-03-15T00:00:00Z" : null,
        createdAt: "2026-03-01T00:00:00Z",
      };
    })
  );
}

// Helper: compute basic metrics from sessions/kinen for comparison
function computePeriodMetrics(users: User[], sessions: Session[], kinen: Kinen[]) {
  const total = users.length || 1;
  const usersWithSession = new Set(sessions.map(s => s.userId));
  const usersWithKinen = new Set(kinen.map(k => k.userId));
  const usersWithMood = new Set(sessions.filter(s => s.mood !== null).map(s => s.userId));

  const onboardingRate = Math.round((usersWithSession.size / total) * 100);
  const avgDuration = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length / 60)
    : 0;

  // Feature usage
  const featureUsage = [
    { feature: "唱題タイマー", pct: Math.round((usersWithSession.size / total) * 100) },
    { feature: "祈念", pct: Math.round((usersWithKinen.size / total) * 100) },
    { feature: "ムード記録", pct: Math.round((usersWithMood.size / total) * 100) },
    { feature: "ジャーナル", pct: Math.round(usersWithMood.size * 0.6 / total * 100) },
    { feature: "ライブ配信", pct: Math.round(usersWithSession.size * 0.15 / total * 100) },
  ];

  // Time of day
  let lateNightCount = 0;
  sessions.forEach(s => {
    const h = new Date(s.startedAt).getHours();
    if (h >= 22 || h < 4) lateNightCount++;
  });
  const lateNightPct = sessions.length > 0 ? Math.round((lateNightCount / sessions.length) * 100) : 0;

  // Streak drop-off (simulated with deterministic values based on data shape)
  const avgSessionsPerUser = sessions.length / usersWithSession.size || 0;
  const day3Drop = Math.max(10, Math.min(50, Math.round(45 - avgSessionsPerUser * 3)));
  const day7Drop = Math.max(8, Math.round(day3Drop * 0.65));

  // Funnel
  const usersWith3Days = users.filter(u => {
    const us = sessions.filter(s => s.userId === u.userId);
    if (us.length < 3) return false;
    const dates = new Set(us.map(s => s.startedAt.slice(0, 10)));
    return dates.size >= 3;
  });
  const premiumUsers = users.filter(u => u.plan === "premium");
  const premiumRate = Math.round((premiumUsers.length / total) * 100);

  return {
    onboardingRate,
    activeUsers: usersWithSession.size,
    avgDuration,
    featureUsage,
    lateNightPct,
    day3Drop,
    day7Drop,
    continuedUsers: usersWith3Days.length,
    continuedRate: Math.round((usersWith3Days.length / total) * 100),
    premiumRate,
    premiumCount: premiumUsers.length,
    totalSessions: sessions.length,
  };
}

export function getImprovementKPIs(
  users: User[],
  sessions: Session[],
  kinen: Kinen[],
  prevSessions?: Session[],
  prevKinen?: Kinen[],
) {
  const total = users.length || 1;

  // Current period metrics
  const cur = computePeriodMetrics(users, sessions, kinen);

  // Previous period metrics (if provided)
  const prev = prevSessions && prevKinen
    ? computePeriodMetrics(users, prevSessions, prevKinen)
    : null;

  // 1. Onboarding
  const usersWithSession = new Set(sessions.map(s => s.userId));
  const avgDaysToFirst = 1.8;

  // 2. Feature usage (current)
  const usersWithKinen = new Set(kinen.map(k => k.userId));
  const usersWithJournal = new Set(sessions.filter(s => s.mood !== null).map(s => s.userId));
  const featureUsage = [
    { feature: "唱題タイマー", users: usersWithSession.size, pct: Math.round((usersWithSession.size / total) * 100) },
    { feature: "祈念", users: usersWithKinen.size, pct: Math.round((usersWithKinen.size / total) * 100) },
    { feature: "ムード記録", users: usersWithJournal.size, pct: Math.round((usersWithJournal.size / total) * 100) },
    { feature: "ジャーナル", users: Math.round(usersWithJournal.size * 0.6), pct: cur.featureUsage.find(f => f.feature === "ジャーナル")?.pct ?? 0 },
    { feature: "ライブ配信", users: Math.round(usersWithSession.size * 0.15), pct: cur.featureUsage.find(f => f.feature === "ライブ配信")?.pct ?? 0 },
  ].sort((a, b) => b.pct - a.pct);

  // 3. Streak drop-offs (data-driven)
  const streakDropoffs = [
    { day: 3, dropRate: cur.day3Drop, label: "3日目" },
    { day: 7, dropRate: cur.day7Drop, label: "7日目" },
    { day: 14, dropRate: Math.max(5, Math.round(cur.day7Drop * 0.7)), label: "14日目" },
    { day: 21, dropRate: Math.max(3, Math.round(cur.day7Drop * 0.5)), label: "21日目" },
    { day: 30, dropRate: Math.max(2, Math.round(cur.day7Drop * 0.35)), label: "30日目" },
  ];

  // 4. Time-of-day usage pattern
  const hourBuckets = [
    { label: "早朝 (4-7時)", range: "early", count: 0 },
    { label: "朝 (7-10時)", range: "morning", count: 0 },
    { label: "昼 (10-14時)", range: "noon", count: 0 },
    { label: "午後 (14-18時)", range: "afternoon", count: 0 },
    { label: "夜 (18-22時)", range: "evening", count: 0 },
    { label: "深夜 (22-4時)", range: "night", count: 0 },
  ];
  sessions.forEach(s => {
    const h = new Date(s.startedAt).getHours();
    if (h >= 4 && h < 7) hourBuckets[0].count++;
    else if (h >= 7 && h < 10) hourBuckets[1].count++;
    else if (h >= 10 && h < 14) hourBuckets[2].count++;
    else if (h >= 14 && h < 18) hourBuckets[3].count++;
    else if (h >= 18 && h < 22) hourBuckets[4].count++;
    else hourBuckets[5].count++;
  });
  const maxHourCount = Math.max(...hourBuckets.map(b => b.count), 1);
  const timeOfDay = hourBuckets.map(b => ({
    ...b,
    pct: Math.round((b.count / maxHourCount) * 100),
  }));

  // 5. Session duration distribution
  const durationBuckets = [
    { label: "〜5分", min: 0, max: 5, count: 0 },
    { label: "5〜15分", min: 5, max: 15, count: 0 },
    { label: "15〜30分", min: 15, max: 30, count: 0 },
    { label: "30〜60分", min: 30, max: 60, count: 0 },
    { label: "60分〜", min: 60, max: Infinity, count: 0 },
  ];
  sessions.forEach(s => {
    const mins = s.duration / 60;
    for (const b of durationBuckets) {
      if (mins >= b.min && mins < b.max) { b.count++; break; }
    }
  });
  const totalSessions = sessions.length || 1;
  const durationDist = durationBuckets.map(b => ({
    label: b.label,
    count: b.count,
    pct: Math.round((b.count / totalSessions) * 100),
  }));

  // 6. Conversion funnel
  const premiumUsers = users.filter(u => u.plan === "premium");
  const funnel = [
    { step: "登録", count: users.length, pct: 100 },
    { step: "初唱題", count: usersWithSession.size, pct: Math.round((usersWithSession.size / total) * 100) },
    { step: "3日以上利用", count: cur.continuedUsers, pct: cur.continuedRate },
    { step: "有料プラン", count: premiumUsers.length, pct: cur.premiumRate },
  ];

  // 7. Dynamic suggestions with week-over-week comparison
  type Suggestion = {
    priority: "high" | "medium" | "low";
    source: string;
    title: string;
    detail: string;
    trend: "up" | "down" | "flat";
    delta: number;
  };
  const suggestions: Suggestion[] = [];

  if (prev) {
    // Onboarding rate change
    const onbDelta = cur.onboardingRate - prev.onboardingRate;
    if (cur.onboardingRate < 80 || onbDelta < -5) {
      const remaining = total - usersWithSession.size;
      suggestions.push({
        priority: onbDelta < -10 ? "high" : cur.onboardingRate < 60 ? "high" : "medium",
        source: "オンボーディング",
        title: `初唱題率 ${cur.onboardingRate}%（先週 ${prev.onboardingRate}%）`,
        detail: remaining > 0
          ? `未唱題が${remaining}人。${onbDelta < 0 ? "先週より悪化" : "改善傾向"}。チュートリアル導線の強化を`
          : `目標80%まであと${80 - cur.onboardingRate}pt`,
        trend: onbDelta > 0 ? "up" : onbDelta < 0 ? "down" : "flat",
        delta: onbDelta,
      });
    }

    // 3-day streak drop-off change
    const dropDelta = cur.day3Drop - prev.day3Drop;
    if (dropDelta > 3 || cur.day3Drop > 30) {
      suggestions.push({
        priority: dropDelta > 8 ? "high" : "medium",
        source: "継続・ストリーク",
        title: `3日目離脱 ${cur.day3Drop}%（先週 ${prev.day3Drop}%）`,
        detail: dropDelta > 0
          ? `先週より${dropDelta}pt悪化。リマインド通知やバッジ報酬で3日目の壁を突破`
          : `${Math.abs(dropDelta)}pt改善。引き続きモニタリング`,
        trend: dropDelta < 0 ? "up" : dropDelta > 0 ? "down" : "flat",
        delta: -dropDelta, // invert: lower drop = better
      });
    }

    // Session volume change
    const sessDelta = cur.totalSessions - prev.totalSessions;
    const sessPct = prev.totalSessions > 0 ? Math.round((sessDelta / prev.totalSessions) * 100) : 0;
    if (Math.abs(sessPct) > 10) {
      suggestions.push({
        priority: sessPct < -20 ? "high" : "medium",
        source: "唱題タイマー",
        title: `セッション数 ${cur.totalSessions}回（先週 ${prev.totalSessions}回）`,
        detail: sessPct < 0
          ? `先週比${Math.abs(sessPct)}%減少。アクティブユーザーの離脱が進行中`
          : `先週比${sessPct}%増加。施策が効果を発揮中`,
        trend: sessPct > 0 ? "up" : "down",
        delta: sessPct,
      });
    }

    // Average duration change
    const durDelta = cur.avgDuration - prev.avgDuration;
    if (Math.abs(durDelta) > 3) {
      suggestions.push({
        priority: durDelta < -5 ? "medium" : "low",
        source: "唱題タイマー",
        title: `平均唱題時間 ${cur.avgDuration}分（先週 ${prev.avgDuration}分）`,
        detail: durDelta < 0
          ? `${Math.abs(durDelta)}分短縮。短時間モードの自動提案やガイド瞑想を検討`
          : `${durDelta}分延長。ユーザーの集中力が向上`,
        trend: durDelta > 0 ? "up" : "down",
        delta: durDelta,
      });
    }

    // Late night usage
    const nightDelta = cur.lateNightPct - prev.lateNightPct;
    if (cur.lateNightPct > 25) {
      suggestions.push({
        priority: cur.lateNightPct > 40 ? "medium" : "low",
        source: "通知・配信",
        title: `深夜帯利用 ${cur.lateNightPct}%（先週 ${prev.lateNightPct}%）`,
        detail: `セッションの${cur.lateNightPct}%が22時〜4時。通知の配信時間帯を朝型にシフトすると効果的`,
        trend: nightDelta < 0 ? "up" : nightDelta > 0 ? "down" : "flat",
        delta: -nightDelta,
      });
    }

    // Feature usage drop (find the most dropped feature)
    for (const feat of cur.featureUsage) {
      const prevFeat = prev.featureUsage.find(f => f.feature === feat.feature);
      if (prevFeat) {
        const fDelta = feat.pct - prevFeat.pct;
        if (fDelta < -5 || (feat.pct < 20 && fDelta < 0)) {
          suggestions.push({
            priority: fDelta < -15 ? "high" : feat.pct < 15 ? "medium" : "low",
            source: feat.feature,
            title: `${feat.feature} 利用率 ${feat.pct}%（先週 ${prevFeat.pct}%）`,
            detail: fDelta < 0
              ? `${Math.abs(fDelta)}pt低下。ホーム画面での導線強化や通知での誘導を検討`
              : `${fDelta}pt上昇`,
            trend: fDelta > 0 ? "up" : "down",
            delta: fDelta,
          });
        }
      }
    }

    // Premium conversion
    // (premiumRate doesn't change weekly in mock since it's user-level, but show it)
    if (cur.premiumRate < 50) {
      suggestions.push({
        priority: "low",
        source: "課金・プラン",
        title: `有料転換率 ${cur.premiumRate}%`,
        detail: `無料ユーザー${total - premiumUsers.length}人。体験期間の延長やプレミアム機能のプレビューを検討`,
        trend: "flat",
        delta: 0,
      });
    }
  } else {
    // No previous data — basic static suggestions
    if (cur.onboardingRate < 80) {
      suggestions.push({ priority: "high", source: "オンボーディング", title: `初唱題率 ${cur.onboardingRate}%`, detail: `目標80%。チュートリアルの追加を検討`, trend: "flat", delta: 0 });
    }
    if (cur.day3Drop > 30) {
      suggestions.push({ priority: "high", source: "継続・ストリーク", title: `3日目離脱 ${cur.day3Drop}%`, detail: `リマインド通知やバッジ報酬を検討`, trend: "flat", delta: 0 });
    }
  }

  // Sort by priority (high > medium > low), then by absolute delta
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => {
    const po = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (po !== 0) return po;
    return Math.abs(b.delta) - Math.abs(a.delta);
  });

  return {
    onboardingRate: cur.onboardingRate,
    usersConverted: usersWithSession.size,
    avgDaysToFirst,
    featureUsage,
    streakDropoffs,
    timeOfDay,
    durationDist,
    avgDuration: cur.avgDuration,
    funnel,
    suggestions: suggestions.slice(0, 6),
  };
}
