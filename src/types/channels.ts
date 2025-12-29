// Functions から返ってくる整形済みのチャンネルデータ
export interface Channel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  subscriberCount: string;
  videoCount: string;
}

//登録済みチャンネルを保持するための型
export interface SubscribedChannel {
  id: string;
  title: string;
  thumbnailUrl: string;
  uploadsPlaylistId: string;
  handle: string;
  subscriberCount: number;
}
