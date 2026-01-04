import { DeleteAccount } from "@/components/DeleteAccount";
import { SignOutButton } from "@/components/SignOutButton";
import { useAuth } from "@/contexts/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsModal() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 px-6 bg-white dark:bg-black"
      style={{ paddingTop: insets.top + 30 }}
    >
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between mb-8">
        <Text className="text-[28px] leading-9 font-bold text-gray-900 dark:text-white">
          設定
        </Text>
        <Pressable
          className="p-2 active:opacity-60"
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#888" />
        </Pressable>
      </View>

      {/* ユーザー情報 */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
          アカウント
        </Text>
        <View className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center gap-3">
            <Ionicons name="mail-outline" size={20} color="#888" />
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                メールアドレス
              </Text>
              <Text className="text-base text-gray-900 dark:text-white font-medium">
                {user?.email ?? "未設定"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* サインアウト */}
      <View className="mb-6">
        <SignOutButton />
      </View>

      {/* アカウント削除 */}
      <View className="mb-6">
        <DeleteAccount />
      </View>

      {/* バージョン情報 */}
      <View className="absolute bottom-12 left-0 right-0 items-center">
        <Text className="text-xs text-gray-400 dark:text-gray-600">
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
}
