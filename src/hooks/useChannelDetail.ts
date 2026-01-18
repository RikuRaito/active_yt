import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { ChannelVideoCardData } from "@/types/channel-videos";
import { ProgressData } from "@/types/videos";
import { useQuery } from "@tanstack/react-query";

export const useChannelDetail = (playlistId: string) => {
  const { user } = useAuth();

  //動画データをキャッシュ化
  const {
    data: channelData,
    isLoading,
    refetch: performGetVideos,
  } = useQuery({
    queryKey: ["channel-videos", playlistId],
    queryFn: async () => {
      const { data, error } =
        await supabase.functions.invoke<ChannelVideoCardData>(
          "get-channel-videos",
          { body: { playlistId } },
        );

      if (error) throw error;
      return data;
    },
    enabled: !!playlistId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  //進捗データをキャッシュ化（動画データとは別管理）
  const videoIds = channelData?.videos.map((v) => v.videoId) ?? [];
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
  const channelDataWithProgress = channelData
    ? {
        ...channelData,
        videos: channelData.videos.map((video) => ({
          ...video,
          position: progressMap[video.videoId]?.position,
          duration: progressMap[video.videoId]?.duration,
        })),
      }
    : null;

  return { channelData: channelDataWithProgress, isLoading, performGetVideos };
};
