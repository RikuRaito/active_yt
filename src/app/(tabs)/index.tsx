import { VideoCard } from "@/components/VideoCard";
import { useHome } from "@/hooks/useHome";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { videos, isLoading, performGetVideos } = useHome();

  if (isLoading && !videos.length) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          ホーム：最新動画一覧
        </Text>
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.videoId}
        renderItem={({ item }) => <VideoCard video={item} />}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={performGetVideos} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-gray-400 dark:text-gray-500">
              登録済みのチャンネルに新しい動画はありません
            </Text>
          </View>
        }
      />
    </View>
  );
}
