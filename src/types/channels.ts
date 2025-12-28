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

// 旧型（後方互換のため残しておく）
export interface ChannelSearchResponse {
  items?: YoutubeChannel[];
}

export interface YoutubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
  statistics?: {
    subscriberCount: string;
    videoCount: string;
  };
}
