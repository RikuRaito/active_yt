import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { ProgressData, Videos } from "@/types/videos";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSubscribedChannels } from "./useSubscribedChannels";

export const useHome = () => {
  const { data: channels, isLoading: isLoadingChannel } =
    useSubscribedChannels();
  const { user } = useAuth();
  const router = useRouter();

  //動画データをキャッシュ化
  const {
    data: videos = [],
    isLoading: isLoadingVideos,
    refetch: performGetVideos,
  } = useQuery({
    queryKey: ["home-videos", channels?.map((c) => c.id)],
    queryFn: async () => {
      if (!channels || channels.length === 0) return [];

      const playlistIds = channels.map((channel) => channel.uploadsPlaylistId);
      const { data: videoData, error: videoError } =
        await supabase.functions.invoke<Videos>("get-videos", {
          body: { uploadsPlaylistIds: playlistIds },
        });

      if (videoError) throw videoError;
      if (!videoData?.items.length) return [];

      //チャンネル情報を紐付け
      return videoData.items.map((video) => {
        const channel = channels?.find((c) => c.id === video.channelId);
        return {
          ...video,
          channelThumbnail: channel?.thumbnailUrl,
          uploadsPlaylistId: channel?.uploadsPlaylistId,
        };
      });
    },

    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,

    enabled: !!channels && channels.length > 0,
  });

  //進捗データをキャッシュ化（動画データとは別管理）
  const videoIds = videos.map((v) => v.videoId);
  const { data: progressMap = {} } = useQuery({
    queryKey: ["video-progress", videoIds],
    queryFn: async () => {
      if (!user?.id || videoIds.length === 0) return {};

      const { data, error } = await supabase
        .from("play_data")
        .select("video_id, position, duration")
        .eq("user_id", user.id)
        .in("video_id", videoIds);

      if (error || !data) return {};

      return data.reduce(
        (acc, item) => {
          acc[item.video_id] = {
            position: item.position,
            duration: item.duration,
          };
          return acc;
        },
        {} as Record<string, ProgressData>,
      );
    },
    enabled: videoIds.length > 0 && !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  //動画データに進捗データをマージ
  const videosWithProgress = videos.map((video) => ({
    ...video,
    position: progressMap[video.videoId]?.position,
    duration: progressMap[video.videoId]?.duration,
  }));

  const handlePressChannel = (uploadsPlaylistId: string) => {
    console.log("handlePressChannel was pressed ", uploadsPlaylistId);
    router.push({
      pathname: "/channel/[id]",
      params: { id: uploadsPlaylistId },
    });
  };

  return {
    videos: videosWithProgress,
    isLoading: isLoadingChannel || isLoadingVideos,
    performGetVideos,
    handlePressChannel,
  };
};
