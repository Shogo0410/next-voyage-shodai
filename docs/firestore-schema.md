# Firestore Schema Definition — Shodai (唱題アプリ)

> 最終更新: 2026-03-19
> ステータス: 設計確定（未実装）

---

## 概要

創価学会員向け唱題アプリ「Shodai」のFirestoreデータ設計。
月額500円のサブスクリプションモデル。想定ユーザー規模: 10万人。

### 設計方針

- **全コレクションをトップレベルに配置**（サブコレクションは使わない）
- 理由: 管理画面での横断クエリ、BigQuery同期、将来のベクトル化に対応するため
- 各コレクションは `userId` フィールドで紐づける
- 分析基盤: Firestore → BigQuery同期 → Looker Studio
- ホスティング: Firebase App Hosting（Next.js SSR）

---

## コレクション一覧

| コレクション | 説明 | 主キー |
|---|---|---|
| `users` | ユーザー情報・課金状態 | `userId` (ドキュメントID) |
| `sessions` | 唱題セッション記録 | `sessionId` (自動ID) |
| `kinen` | 祈念（願い・目標） | `kinenId` (自動ID) |
| `journals` | ジャーナル（唱題後の気づき） | `journalId` (自動ID) |
| `subtasks` | 祈念のサブタスク | `subtaskId` (自動ID) |
| `badges` | 実績バッジ達成記録 | `badgeId` (自動ID) |
| `follows` | フォロー関係 | `followId` (自動ID) |
| `reactions` | リアクション（エール） | `reactionId` (自動ID) |

---

## 各コレクション詳細

### users

ドキュメントID = `userId`

```
users/{userId}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| name | string | ○ | 表示名 |
| email | string | ○ | メールアドレス |
| avatarColor | string | ○ | アバター色 (例: "#C8A96E") |
| bio | string | | 自己紹介 |
| lang | string | ○ | 言語設定 ("ja" / "en") |
| plan | string | ○ | "free" / "premium" |
| subscriptionStatus | string | ○ | "active" / "canceled" / "none" |
| premiumSince | timestamp | | 課金開始月 |
| currentPeriodEnd | timestamp | | 当月末（更新日） |
| stripeCustomerId | string | | Stripe顧客ID |
| isPublic | boolean | ○ | プロフィール公開 |
| livePublic | boolean | ○ | LIVEマップ表示 |
| journalDefaultPublic | boolean | ○ | ジャーナルデフォルト公開 |
| createdAt | timestamp | ○ | 登録日 |
| lastActiveAt | timestamp | ○ | 最終アクティブ日時 |

**課金ルール:**
- 月額500円（税込）、毎月1日課金
- 日割りなし
- plan + subscriptionStatus の組み合わせで状態管理

| plan | subscriptionStatus | 状態 |
|---|---|---|
| free | none | 無料ユーザー |
| premium | active | 有料・有効 |
| premium | canceled | 有料・解約済（期間終了まで利用可） |

---

### sessions（唱題セッション）

```
sessions/{sessionId}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| userId | string | ○ | ユーザーID |
| duration | number | ○ | 唱題時間（秒） |
| hen | number | ○ | 遍数 |
| timerPreset | number | ○ | 選択タイマー（秒。0=自由モード） |
| mood | string | | 終了時のムード |
| startedAt | timestamp | ○ | 開始時刻 |
| endedAt | timestamp | ○ | 終了時刻 |

**mood の値:**
`peaceful` / `passionate` / `grateful` / `determined` / `growth` / `tears` / `conviction` / `joy`

**遍数の計算式:** `hen = duration * (10000 / (3 * 3600))`
（3時間で約1万遍の換算）

---

### kinen（祈念）

```
kinen/{kinenId}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| userId | string | ○ | ユーザーID |
| text | string | ○ | 祈念内容 |
| category | string | ○ | カテゴリ |
| isOpen | boolean | ○ | 進行中かどうか |
| isPublic | boolean | ○ | 公開設定 |
| deadline | timestamp | | 期限（nullなら期限なし） |
| achievedAt | timestamp | | 達成日（nullなら未達成） |
| createdAt | timestamp | ○ | 作成日 |

**category の値:**
`personal`(自分) / `family`(家族) / `work`(仕事) / `health`(健康) / `study`(学会) / `other`(その他)

---

### journals（ジャーナル）

```
journals/{journalId}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| userId | string | ○ | ユーザーID |
| text | string | ○ | 本文 |
| mood | string | ○ | ムード（sessions.mood と同じ値） |
| sessionId | string | | 紐づく唱題セッションID |
| duration | number | | そのセッションの唱題時間（秒） |
| isPublic | boolean | ○ | 公開設定 |
| photoUrl | string | | 写真URL |
| createdAt | timestamp | ○ | 作成日 |

---

### subtasks（祈念サブタスク）

```
subtasks/{subtaskId}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| kinenId | string | ○ | 紐づく祈念ID |
| userId | string | ○ | ユーザーID |
| text | string | ○ | 内容 |
| done | boolean | ○ | 完了フラグ |
| createdAt | timestamp | ○ | 作成日 |

---

### badges（実績バッジ）

```
badges/{badgeId}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| userId | string | ○ | ユーザーID |
| badgeType | string | ○ | バッジ種別 |
| achievedAt | timestamp | ○ | 達成日 |

**badgeType の値（初期定義）:**

| badgeType | 条件 | 説明 |
|---|---|---|
| streak_7 | 7日連続唱題 | 🔥 7日連続唱題 |
| streak_30 | 30日連続唱題 | 🌟 30日連続唱題 |
| hen_10000 | 累計1万遍 | 💎 1万遍達成 |
| journals_10 | ジャーナル10件 | 📖 ジャーナル10件 |
| followers_5 | フォロワー5人 | 👥 フォロワー5人 |
| kinen_achieved_5 | 祈念5件達成 | 🎯 祈念5件達成 |
| total_hours_100 | 累計100時間 | ⏱️ 累計100時間 |
| mood_complete | 全8種ムード記録 | 🌈 全気分コンプ |

**判定はサーバー側（Cloud Functions）で実行。** クライアント側では改ざん防止のため判定しない。
後から新しいバッジを追加した際、全ユーザーに遡って判定可能。

---

### follows（フォロー関係）

```
follows/{followId}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| fromUserId | string | ○ | フォローした人 |
| toUserId | string | ○ | フォローされた人 |
| createdAt | timestamp | ○ | フォロー日 |

**クエリ例:**
- Aのフォロー一覧: `where("fromUserId", "==", "A")`
- Aのフォロワー一覧: `where("toUserId", "==", "A")`
- AがBをフォローしてるか: `where("fromUserId", "==", "A").where("toUserId", "==", "B")`

---

### reactions（リアクション / エール）

```
reactions/{reactionId}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| fromUserId | string | ○ | 送った人 |
| targetType | string | ○ | 対象種別 ("kinen" / "journal" / "session") |
| targetId | string | ○ | 対象ドキュメントID |
| targetUserId | string | ○ | 対象の持ち主ユーザーID |
| emoji | string | ○ | リアクション絵文字 |
| createdAt | timestamp | ○ | 送信日 |

**emoji の値:**
`🙏`(合掌) / `🔥`(燃えろ) / `💪`(頑張れ) / `🌸`(桜) / `✨`(輝け) / `❤️`(愛)

---

## インデックス設計（必要になるもの）

| コレクション | フィールド | 用途 |
|---|---|---|
| sessions | userId + startedAt DESC | ユーザーの唱題履歴 |
| sessions | startedAt DESC | 管理画面: 全体の直近セッション |
| kinen | userId + isOpen + createdAt DESC | ユーザーの進行中祈念 |
| journals | userId + createdAt DESC | ユーザーのジャーナル一覧 |
| badges | userId + achievedAt DESC | ユーザーのバッジ一覧 |
| follows | fromUserId + createdAt DESC | フォロー一覧 |
| follows | toUserId + createdAt DESC | フォロワー一覧 |
| reactions | targetId + targetType | 対象へのリアクション集計 |
| reactions | targetUserId + createdAt DESC | ユーザーが受けたリアクション |

---

## 将来拡張

### BigQuery同期
- Firestore → BigQuery Export（Firebase Extensions）で全コレクションを同期
- Looker Studio でダッシュボード構築

### ベクトル化（embedding）
- journals.text / kinen.text を Vertex AI Embeddings でベクトル化
- 幸福度の時系列分析、類似ユーザークラスタリング
- 保存先: BigQuery（VECTOR型）または専用ベクトルDB

### 管理画面
- Firebase App Hosting（Next.js）
- ユーザー一覧・課金管理・KPIダッシュボード
- 幸福の統計処理（ムード分布・ストリーク・祈念達成率の可視化）
