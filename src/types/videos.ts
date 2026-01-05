// 動画の基本情報（共通プロパティ）
export interface BaseVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

// チャンネル情報を含む動画データ（ホーム画面用）
export interface Video extends BaseVideo {
  channelId: string;
  channelTitle: string;
  channelThumbnail?: string;
  uploadsPlaylistId?: string;
}

// APIから直接返ってくる生データを受け取るための型
export interface Videos {
  items: Video[];
}
