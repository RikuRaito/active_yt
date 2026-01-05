import { VideoCard } from "@/components/VideoCard";
import { useChannelDetail } from "@/hooks/useChannelDetail";
import { ChannelVideo } from "@/types/channel-videos";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChannelDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { channelData, isLoading, performGetVideos } = useChannelDetail(
    id ?? ""
  );

  const renderVideoItem = useCallback(
    ({ item }: { item: ChannelVideo }) => (
      <VideoCard video={item} showChannelInfo={false} />
    ),
    []
  );

  if (isLoading && !channelData) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black items-center justify-center">
        <Stack.Screen options={{ title: "読み込み中..." }} />
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!channelData) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black items-center justify-center">
        <Stack.Screen
          options={{ title: "チャンネル", headerBackTitle: "戻る" }}
        />
        <Text className="text-gray-400 dark:text-gray-500">
          チャンネル情報を取得できませんでした
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: channelData.channelTitle,
          headerBackTitle: "戻る",
        }}
      />

      <FlatList
        data={channelData.videos}
        keyExtractor={(item) => item.videoId}
        renderItem={renderVideoItem}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={performGetVideos} />
        }
        ListHeaderComponent={
          <View className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {channelData.channelTitle}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {channelData.videos.length} 件の動画
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-gray-400 dark:text-gray-500">
              動画がありません
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
