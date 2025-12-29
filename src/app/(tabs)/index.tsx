import { useSubscribedChannels } from "@/hooks/useSubscribedChannels";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { data: channels, isLoading, error } = useSubscribedChannels();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>エラーが発生しました</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>登録チャンネルのテスト表示</Text>

        <Text style={styles.label}>取得件数: {channels?.length ?? 0} 件</Text>

        {channels?.map((channel) => (
          <View key={channel.id} style={styles.card}>
            <Text style={styles.channelTitle}>タイトル: {channel.title}</Text>
            <Text>ハンドル: {channel.handle}</Text>
            <Text>登録者数: {channel.subscriberCount}</Text>
            <Text>ID: {channel.id}</Text>
            <Text style={styles.small}>
              プレイリストID: {channel.uploadsPlaylistId}
            </Text>
          </View>
        ))}

        {/* 生のJSONデータを確認用に出力 */}
        <Text style={styles.rawTitle}>Raw JSON Data:</Text>
        <View style={styles.rawContainer}>
          <Text style={styles.rawText}>
            {JSON.stringify(channels, null, 2)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  card: {
    padding: 15,
    backgroundColor: "#f0f9ff",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  small: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  rawTitle: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
  },
  rawContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  rawText: {
    fontSize: 10,
    fontFamily: "Courier", // 等幅フォントがあれば
  },
});
