import { SignOutButton } from "@/components/SignOutButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsModal() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 30 }]}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>設定</ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#888" />
        </Pressable>
      </View>

      {/* ユーザー情報 */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>アカウント</ThemedText>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={20} color="#888" />
            <View style={styles.rowContent}>
              <ThemedText style={styles.label}>メールアドレス</ThemedText>
              <ThemedText style={styles.value}>
                {user?.email ?? "未設定"}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* サインアウト */}
      <View style={styles.section}>
        <SignOutButton />
      </View>

      {/* バージョン情報 */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>Version 1.0.0</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
});
