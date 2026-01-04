import { Video } from "@/types/videos";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface VideoCardProps {
  video: Video;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const [loading, setLoading] = useState(true);

  const onReady = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <View className="mb-6 overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
      <View className="relative w-full aspect-video bg-black">
        <YoutubePlayer height={210} videoId={video.videoId} onReady={onReady} />
        {loading && (
          <View className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <ActivityIndicator color="#000" />
          </View>
        )}
      </View>
      <View className="p-4 flex-row gap-3">
        <Image
          src={video.channelThumbnail}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800"
        />
        <View className="flex-1">
          <Text
            className="text-[15px] font-bold text-gray-900 dark:text-white leading-5"
            numberOfLines={2}
          >
            {video.title}
          </Text>
          <Text className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            {video.channelTitle}
          </Text>
        </View>
      </View>
    </View>
  );
};
