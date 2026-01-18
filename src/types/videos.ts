// 動画の基本情報（共通プロパティ）
export interface BaseVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  // 視聴進捗データ（optional）
  position?: number;
  duration?: number;
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

//動画の進捗を取得するための型
export interface ProgressData {
  position: number;
  duration: number;
}
