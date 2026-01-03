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
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">ホーム</Text>
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
            <Text className="text-gray-400">
              登録済みのチャンネルに新しい動画はありません
            </Text>
          </View>
        }
      />
    </View>
  );
}
