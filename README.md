# Ayr(Active Youtube Reader)

「おすすめ動画」や「ショート動画」の無限スクロールによる時間の浪費を防ぐために開発された、YouTube 専用の RSS リーダー風クライアントです。

# 📖 概要 (Concept)

YouTube 公式アプリは、滞在時間を延ばすために強力なアルゴリズムで動画をレコメンドしてきます。本アプリは、その「ノイズ」を完全に排除し、「自分が登録したチャンネルの動画だけを、時系列で確認して終わる」 という本来の視聴スタイルを取り戻すためのツールです。

# 主な特徴

🚫 No Recommendations: おすすめ動画、関連動画を一切表示しません。

🚫 No Shorts: 時間を奪うショート動画をフィルタリング（除外）します。

# Secure Architecture: YouTube API キーをクライアントに持たせず、Supabase Edge Functions 経由で安全にリクエストします。

Quota Friendly: 検索 API (search) を使わず、プレイリスト取得 API (playlistItems) を使用することで API コストを最小化しています。

# 技術スタック (Tech Stack)

Frontend
Framework: React Native (Expo SDK 50+)

Router: Expo Router (File-based routing)

Language: TypeScript

Component: Native Components (<View>, <FlatList>, etc.)

Backend (BaaS)
Database: Supabase (PostgreSQL)

Auth: Supabase Auth

API: Supabase Edge Functions (Deno)

External API: YouTube Data API v3

# アーキテクチャ

API キーの流出を防ぐため、クライアントから YouTube API を直接叩くことはせず、Supabase をプロキシとして利用しています。

Code snippet

sequenceDiagram
participant App as React Native App
participant Edge as Supabase Edge Functions
participant YT as YouTube Data API
participant DB as Supabase DB

    App->>Edge: チャンネル追加リクエスト (URL/Handle)
    Edge->>YT: チャンネルID解決 & 情報取得
    YT-->>Edge: チャンネルデータ
    Edge->>DB: チャンネル情報を保存 (Upsert)
    DB-->>App: 更新されたフィード情報を返却

📂 ディレクトリ構成
Plaintext

.
├── app/ # 画面 (Pages & Routing)
│ ├── (tabs)/ # タブ画面 (Home, Explore)
│ ├── \_layout.tsx # 全体のレイアウト設定
│ └── modal.tsx # モーダル画面
├── components/ # UI 部品
│ ├── VideoCard.tsx # 動画表示用コンポーネント
│ └── ...
├── constants/ # 定数・テーマカラー
├── supabase/ # Backend Logic
│ └── functions/ # Edge Functions (API Proxy)
└── assets/ # 画像リソース
🚀 開発環境のセットアップ (Getting Started)

1. リポジトリのクローン
   Bash

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name 2. 依存関係のインストール
Bash

npm install

または

yarn install 3. 環境変数の設定
.env ファイルを作成し、Supabase の接続情報を記述します。

Code snippet

EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key 4. アプリの起動
Bash

npx expo start
表示された QR コードを「Expo Go」アプリ（iOS/Android）で読み込んでください。

📝 今後のロードマップ
[ ] チャンネル登録機能（URL/Handle 対応）の実装

[ ] 動画リストのキャッシュ機能（API 節約）

[ ] 視聴済み動画のグレーアウト機能

[ ] 1 日の視聴制限タイマー機能

📄 License
MIT License
