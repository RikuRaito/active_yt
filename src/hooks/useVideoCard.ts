import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";

export const useVideoCard = () => {
  const { user } = useAuth();

  const saveProgress = async (
    videoId: string,
    position: number,
    videoDuration: number,
  ) => {
    try {
      const duration = Math.round((position / videoDuration) * 100);
      const userId = user?.id;
      if (!userId) return;
      const { error } = await supabase.from("play_data").upsert(
        {
          user_id: userId,
          video_id: videoId,
          position: Math.floor(position),
          duration: duration,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,video_id" },
      );
      if (error) {
        console.error("Failed to save progress", error);
      }
    } catch (err) {
      throw new Error(`Internal Error: ${err}`);
    }
  };

  return {
    saveProgress,
  };
};
