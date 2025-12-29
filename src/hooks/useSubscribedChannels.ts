import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { SubscribedChannel } from "@/types/channels";
import { useQuery } from "@tanstack/react-query";

export const useSubscribedChannels = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["subscribed-channels", user?.id],
    queryFn: async (): Promise<SubscribedChannel[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          `channel_id, 
           channels (
            channel_id,
            title,
            thumbnail_url,
            handle,
            subscriber_count,
            uploads_playlist_id)
            )`
        )
        .eq("uuid", user.id);
      console.log("Raw Data from DB: ", data);
      if (error) throw error;
      if (!data) return [];

      //DBの生データからSubscribedへのマッピング処理
      return (data as any[])
        .filter((sub) => sub.channels)
        .map((sub) => {
          const c = sub.channels!;
          return {
            id: c.channel_id,
            title: c.title,
            handle: c.handle,
            thumbnailUrl: c.thumbnail_url,
            uploadsPlaylistId: c.uploads_playlist_id,
            subscriberCount: c.subscriber_count,
          };
        });
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    enabled: !!user,
  });
};
