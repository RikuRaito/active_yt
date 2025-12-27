import { useSubscription } from "@/hooks/useSubscription";
import {
  Image,
  StyleSheet,
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
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    performSearch,
    performSubscribe,
  } = useSubscription();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>登録チャンネル</Text>
        <Text style={styles.description}>登録チャンネルの追加と管理</Text>
      </View>

      <View style={styles.searchBox}>
        <View style={styles.inputWrapper}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            style={styles.input}
            placeholder="ハンドル名"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={performSearch}>
          {isLoading ? (
            <Text style={styles.searchButtonText}>検索中...</Text>
          ) : (
            <Text style={styles.searchButtonText}>検索</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.searchHint}>
        <Text style={styles.searchHintText}>
          @をつけずにハンドル名を入力してください
        </Text>
      </View>
      {searchResults && (
        <View style={styles.resultsContainer}>
          {searchResults.items?.map((channel) => (
            <View key={channel.id} style={styles.channelCard}>
              <Image
                source={{ uri: channel.snippet.thumbnails.high.url }}
                style={styles.thumbnail}
              />
              <View style={styles.channnelInfo}>
                <Text style={styles.channelTitle} numberOfLines={1}>
                  {channel.snippet.title}
                </Text>
                <Text style={styles.channelHandle} numberOfLines={1}>
                  {channel.snippet.customUrl}
                </Text>
                {channel.statistics && (
                  <Text style={styles.subscriberCount}>
                    登録者数: {parseInt(channel.statistics.subscriberCount)}
                  </Text>
                )}
              </View>
              <TouchableOpacity style={styles.subscribeButton}>
                <Text style={styles.subscribeButtonText}>登録</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <View style={styles.subscribedChannels}>
        <Text>登録済みチャンネル</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 24,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingLeft: 12,
  },
  atSymbol: {
    fontSize: 16,
    color: "#999",
    marginRight: -4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  searchButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  searchHint: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  searchHintText: {
    fontSize: 12,
    color: "#999",
  },
  subscribedChannels: {
    flex: 1,
  },
  resultsContainer: {
    marginTop: 24,
  },
  channelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  channnelInfo: {
    flex: 1,
    justifyContent: "center",
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  channelHandle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  subscriberCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  subscribeButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subscribeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
