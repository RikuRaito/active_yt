# AYR (Active YouTube Reader)

「おすすめ動画」や「ショート動画」の無限スクロールによる時間の浪費を防ぐために開発された、YouTube 専用の RSS リーダー風クライアントです。

## 📖 概要 (Concept)

YouTube 公式アプリは、滞在時間を延ばすために強力なアルゴリズムで動画をレコメンドしてきます。本アプリは、その「ノイズ」を完全に排除し、「自分が登録したチャンネルの動画だけを、時系列で確認して終わる」という本来の視聴スタイルを取り戻すためのツールです。

## ✨ 主な特徴

- 🚫 **No Recommendations**: おすすめ動画、関連動画を一切表示しません
- 🚫 **No Shorts**: 時間を奪うショート動画をフィルタリング（除外）します
- 🔒 **Secure Architecture**: YouTube API キーをクライアントに持たせず、Supabase Edge Functions 経由で安全にリクエストします
- 💰 **Quota Friendly**: 検索 API (search) を使わず、プレイリスト取得 API (playlistItems) を使用することで API コストを最小化しています
- 🔐 **認証機能**: Google Sign-In、Apple Sign-In、メール/パスワード認証に対応
- 📱 **クロスプラットフォーム**: iOS、Android、Web に対応

## 🛠️ 技術スタック (Tech Stack)

### Frontend

- **Framework**: React Native (Expo SDK 54+)
- **Router**: Expo Router (File-based routing)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Query (@tanstack/react-query)
- **Components**: Native Components

### Backend (BaaS)

- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google/Apple/Email)
- **API**: Supabase Edge Functions (Deno)
- **External API**: YouTube Data API v3

## 🏗️ アーキテクチャ

API キーの流出を防ぐため、クライアントから YouTube API を直接叩くことはせず、Supabase Edge Functions をプロキシとして利用しています。

```
┌─────────────────┐
│  React Native   │
│      App        │
└────────┬────────┘
         │
         │ HTTPS Request
         │
│  (Deno Runtime)          │
└────────┬─────────────────┘
         │
         │ YouTube Data API v3
         │ (API Key in Server)
         │
┌────────▼────────┐
│  YouTube API    │
└─────────────────┘
```

### データフロー

1. アプリからチャンネル検索/購読リクエストを送信
2. Supabase Edge Function が YouTube API を呼び出し
3. チャンネル情報を Supabase データベースに保存
4. アプリに更新されたフィード情報を返却

## 📂 ディレクトリ構成

```
.
├── src/
│   ├── app/                    # 画面 (Pages & Routing)
│   │   ├── (auth)/            # 認証画面
│   │   │   ├── login.tsx      # ログイン画面
│   │   │   └── signup.tsx   
│   │   ├── (tabs)/            # タブ画面
│   │   │   ├── index.tsx      # ホーム（最新動画一覧）
│   │   │   └── subscription.tsx  # チャンネル登録管理
│   │   ├── channel/           # チャンネル詳細
│   │   │   └── [id].tsx       # チャンネル別動画一覧
│   │   └── settings.tsx       # 設定画面
│   ├── components/            # UI 部品
│   │   ├── VideoCard.tsx      # 動画表示用コンポーネント
│   │   ├── ChannelVideoItem.tsx
│   │   ├── SignOutButton.tsx
│   │   ├── DeleteAccount.tsx
│   │   └── ui/                # 共通UIコンポーネント
│   ├── hooks/                 # カスタムフック
│   │   ├── useHome.ts         # ホーム画面用
│   │   ├── useChannelDetail.ts
│   │   ├── useSubscription.ts
│   │   └── useSubscribedChannels.ts
│   ├── contexts/              # React Context
│   │   └── auth-context.tsx   # 認証コンテキスト
│   ├── lib/                   # ライブラリ設定
│   │   ├── supabase.ts        # Supabase クライアント
│   │   └── config.ts          # 設定ファイル
│   └── types/                 # TypeScript 型定義
│       ├── videos.ts
│       ├── channels.ts
│       └── channel-videos.ts
├── supabase/
│   ├── functions/             # Edge Functions
│   │   ├── get-videos/        # 動画一覧取得
│   │   ├── get-channel-videos/ # チャンネル別動画取得
│   │   ├── search-channel/    # チャンネル検索
│   │   ├── subscribe-channel/ # チャンネル購読
│   │   └── _shared/           # 共通モジュール
│   └── migrations/            # データベースマイグレーション
├── assets/                    # 画像リソース
├── app.json                   # Expo 設定
└── package.json
```

## 🚀 セットアップ (Getting Started)

### 前提条件

- Node.js 18+ がインストールされていること
- npm または yarn がインストールされていること
- Expo CLI がインストールされていること（`npm install -g expo-cli`）
- Supabase アカウント（無料プランで可）
- YouTube Data API v3 の API キー

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/ayr.git
cd ayr
```

### 2. 依存関係のインストール

```bash
npm install
```

または

```bash
yarn install
```

### 3. Supabase プロジェクトのセットアップ

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. データベースマイグレーションを実行:
   ```bash
   npx supabase db push
   ```
3. Edge Functions をデプロイ:
   ```bash
   npx supabase functions deploy get-videos
   npx supabase functions deploy get-channel-videos
   npx supabase functions deploy search-channel
   npx supabase functions deploy subscribe-channel
   ```

### 4. 環境変数の設定

`.env` ファイルをプロジェクトルートに作成し、以下の環境変数を設定します:

```env
# Supabase 設定（本番環境）
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL_PROD=https://your-project.supabase.co/functions/v1

# Supabase 設定（開発環境、オプション）
EXPO_PUBLIC_SUPABASE_URL_DEV=https://your-dev-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY_DEV=your-dev-anon-key
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL_DEV=https://your-dev-project.supabase.co/functions/v1
```

### 5. Supabase Edge Functions の環境変数設定

各 Edge Function に YouTube API キーを設定します:

```bash
npx supabase secrets set YOUTUBE_API_KEY=your-youtube-api-key
```

### 6. アプリの起動

```bash
npx expo start
```

表示された QR コードを「Expo Go」アプリ（iOS/Android）で読み込むか、`i` キーで iOS シミュレーター、`a` キーで Android エミュレーターを起動できます。

## 📱 ビルドとデプロイ

### iOS ビルド

```bash
# 開発ビルド
npx expo run:ios

# 本番ビルド（EAS Build）
eas build --platform ios
```

### Android ビルド

```bash
# 開発ビルド
npx expo run:android

# 本番ビルド（EAS Build）
eas build --platform android
```

### Apple App Store への提出

1. EAS Build で iOS ビルドを作成:

   ```bash
   eas build --platform ios --profile production
   ```

2. App Store Connect に提出:
   ```bash
   eas submit --platform ios
   ```

### Google Play Store への提出

1. EAS Build で Android ビルドを作成:

   ```bash
   eas build --platform android --profile production
   ```

2. Play Store に提出:
   ```bash
   eas submit --platform android
   ```

## 🔧 開発

### コードフォーマットとリント

```bash
npm run lint
```

### プロジェクトリセット

```bash
npm run reset-project
```

## 📝 実装済み機能

- ✅ Google Sign-In 認証
- ✅ Apple Sign-In 認証
- ✅ メール/パスワード認証
- ✅ チャンネル検索（ハンドル名対応）
- ✅ チャンネル購読/登録解除
- ✅ 登録チャンネルの最新動画一覧表示
- ✅ チャンネル別動画一覧表示
- ✅ 動画の WebView 表示
- ✅ ダークモード対応
- ✅ プルリフレッシュ
- ✅ アカウント削除機能

## 🗺️ 今後のロードマップ

- [ ] 動画リストのキャッシュ機能（API 節約）
- [ ] 視聴済み動画のグレーアウト機能
- [ ] 1 日の視聴制限タイマー機能
- [ ] オフライン対応
- [ ] プッシュ通知（新着動画通知）

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まず issue を開いて変更内容を議論してください。

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は `LICENSE` ファイルを参照してください。

## 🙏 謝辞

- [Expo](https://expo.dev/) - 素晴らしい React Native フレームワーク
- [Supabase](https://supabase.com/) - オープンソースの Firebase 代替
- [YouTube Data API v3](https://developers.google.com/youtube/v3) - YouTube データへのアクセス

## 📧 お問い合わせ

問題や質問がある場合は、[GitHub Issues](https://github.com/your-username/ayr/issues) でお知らせください。
