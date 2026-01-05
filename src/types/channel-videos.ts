import { BaseVideo } from "./videos";

// チャンネル詳細画面用の動画データ（BaseVideoを継承）
export type ChannelVideo = BaseVideo;

// チャンネル詳細画面のレスポンスデータ
export interface ChannelVideoCardData {
  channelId: string;
  channelTitle: string;
  videos: ChannelVideo[];
}
