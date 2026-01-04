import { useSubscribedChannels } from "@/hooks/useSubscribedChannels";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Subscription() {
  const {
    searchQuery,
    setSearchQuery,
    searchResult,
    isLoading,
    performSearch,
    performSubscribe,
    performUnscribe,
  } = useSubscription();

  const {
    data: channels,
    isLoading: isLoadingChannels,
    error,
  } = useSubscribedChannels();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black px-6">
      <View className="mb-5 gap-2.5">
        <Text className="text-[28px] font-bold text-gray-900 dark:text-white mb-2">
          登録チャンネル
        </Text>
        <Text className="text-[15px] text-gray-500 dark:text-gray-400 leading-5">
          登録チャンネルの追加と管理
        </Text>
      </View>

      <View className="flex-row items-center gap-3 pr-6">
        <View className="flex-1 bg-gray-100 dark:bg-gray-900 flex-row items-center rounded-xl border border-gray-200 dark:border-gray-700 pl-3">
          <Text className="text-base text-gray-400 -mr-1">@</Text>
          <TextInput
            className="flex-1 text-base text-black dark:text-white py-3.5 px-4"
            placeholder="ハンドル名"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <TouchableOpacity
          className="bg-emerald-500 py-3.5 px-5 rounded-xl"
          onPress={performSearch}
        >
          {isLoading ? (
            <Text className="text-white text-base font-semibold">
              検索中...
            </Text>
          ) : (
            <Text className="text-white text-base font-semibold">検索</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-2 px-1">
        <Text className="text-xs text-gray-400">
          @をつけずにハンドル名を入力してください
        </Text>
      </View>

      {searchResult && (
        <View className="mt-6">
          <View className="flex-row items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-3 gap-3">
            <Image
              source={{ uri: searchResult.thumbnails.high }}
              className="w-[60px] h-[60px] rounded-full"
            />
            <View className="flex-1 justify-center">
              <Text
                className="text-base font-bold text-black dark:text-white"
                numberOfLines={1}
              >
                {searchResult.title}
              </Text>
              <Text
                className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5"
                numberOfLines={1}
              >
                {searchResult.customUrl}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                登録者数:{" "}
                {parseInt(searchResult.subscriberCount).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-black dark:bg-white py-2 px-4 rounded-full"
              onPress={() => performSubscribe(searchResult)}
            >
              <Text className="text-white dark:text-black text-sm font-semibold">
                登録
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View className="flex-1 mt-6">
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          登録済みチャンネル
        </Text>

        {isLoadingChannels ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 dark:text-gray-400">
              読み込み中...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500">エラーが発生しました</Text>
            <Text className="text-gray-500 dark:text-gray-400">
              {error.message}
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1">
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {channels?.length ?? 0} 件のチャンネル
            </Text>

            {channels?.map((channel) => (
              <View
                key={channel.id}
                className="flex-row items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-3 gap-3 mb-3"
              >
                <Image
                  src={channel.thumbnailUrl}
                  className="w-[50px] h-[50px] rounded-full bg-gray-200 dark:bg-gray-800"
                />
                <View className="flex-1 justify-center">
                  <Text
                    className="text-base font-bold text-black dark:text-white"
                    numberOfLines={1}
                  >
                    {channel.title}
                  </Text>
                  <Text
                    className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5"
                    numberOfLines={1}
                  >
                    {channel.handle}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    登録者数: {channel.subscriberCount.toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  className="border border-red-200 dark:border-red-900/30 px-3 py-1.5 rounded-full"
                  onPress={() => performUnscribe(channel.id)}
                >
                  <Text className="text-red-500 dark:text-red-400 text-sm font-medium">
                    登録解除
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
