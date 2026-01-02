import { supabase } from "@/lib/supabase";
import { Videos } from "@/types/videos";
import { useQuery } from "@tanstack/react-query";
import { useSubscribedChannels } from "./useSubscribedChannels";

export const useHome = () => {
  const {
    data: channels,
    isLoading: isLoadingChannel,
    error,
  } = useSubscribedChannels();

  //useQueryを使って動画データをキャッシュ化
  const {
    data: videoData,
    isLoading: isLoadingVideos,
    refetch: performGetVideos,
  } = useQuery({
    queryKey: ["home-videos", channels?.map((c) => c.id)],
    queryFn: async () => {
      if (!channels || channels.length === 0) return { items: [] };

      const playlistIds = channels.map((channel) => channel.uploadsPlaylistId);
      const { data, error } = await supabase.functions.invoke<Videos>(
        "get-videos",
        { body: { uploadsPlaylistIds: playlistIds } }
      );

      if (error) throw error;
      return data || { items: [] };
    },

    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,

    enabled: !!channels && channels.length > 0,
  });

  // 動画データにチャンネル情報を紐付け
  const videosWithChannelInfo =
    videoData?.items.map((video) => {
      const channel = channels?.find((c) => c.id === video.channelId);
      return {
        ...video,
        channelThumbnail: channel?.thumbnailUrl,
      };
    }) ?? [];

  return {
    videos: videosWithChannelInfo,
    isLoading: isLoadingChannel || isLoadingVideos,
    performGetVideos,
  };
};
