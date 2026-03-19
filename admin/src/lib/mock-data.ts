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
const MOOD_EMOJI: Record<string, string> = {
  peaceful: "😊", passionate: "🔥", grateful: "🙏", determined: "💪",
  growth: "🌱", tears: "😢", conviction: "⚡", joy: "🌸",
};
const CATEGORIES = ["personal", "family", "work", "health", "study", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  personal: "自分", family: "家族", work: "仕事", health: "健康", study: "学会", other: "その他",
};

export { MOOD_LABELS, MOOD_EMOJI, CATEGORY_LABELS };

const BADGE_DEFS: Record<string, { emoji: string; label: string }> = {
  streak_7: { emoji: "🔥", label: "7日連続唱題" },
  streak_30: { emoji: "🌟", label: "30日連続唱題" },
  hen_10000: { emoji: "💎", label: "1万遍達成" },
  journals_10: { emoji: "📖", label: "ジャーナル10件" },
  followers_5: { emoji: "👥", label: "フォロワー5人" },
  kinen_achieved_5: { emoji: "🎯", label: "祈念5件達成" },
  total_hours_100: { emoji: "⏱️", label: "累計100時間" },
  mood_complete: { emoji: "🌈", label: "全気分コンプ" },
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
