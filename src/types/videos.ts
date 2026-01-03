//Youtube APIから取得した動画データの型
export interface Video {
  channelId: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  channelThumbnail?: string;
}

//APIから直接返ってくる生データを受け取るための型
export interface Videos {
  items: Video[];
}
