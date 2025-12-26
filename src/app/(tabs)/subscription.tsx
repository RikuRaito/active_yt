import { useSubscription } from "@/hooks/useSubscription";
import {
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
  } = useSubscription();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>登録チャンネル</Text>
        <Text style={styles.description}>登録チャンネルの追加と管理</Text>
      </View>

      <View style={styles.searchBox}>
        <View style={styles.inputWrapper}>
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
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
  subscribedChannels: {
    flex: 1,
  },
});
