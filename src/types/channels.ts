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
