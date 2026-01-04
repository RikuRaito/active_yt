import { useAuth } from "@/contexts/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export function DeleteAccount() {
  const { deleteAccount, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const handleDeleteRequest = () => {
    Alert.alert(
      "アカウント削除",
      "アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除する",
          style: "destructive",
          onPress: () => setShowConfirmModal(true),
        },
      ]
    );
  };

  const handleDeleteConfirm = async () => {
    if (confirmEmail !== user?.email) {
      Alert.alert("エラー", "メールアドレスが一致しません");
      return;
    }

    setLoading(true);
    const { error } = await deleteAccount();
    setLoading(false);

    if (error) {
      Alert.alert("削除エラー", error.message);
    } else {
      Alert.alert("削除完了", "アカウントが削除されました");
      setShowConfirmModal(false);
      setConfirmEmail("");
    }
  };

  if (showConfirmModal) {
    return (
      <View className="bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 border-red-500 dark:border-red-400">
        <View className="flex-row items-center gap-3 mb-4">
          <Ionicons name="warning" size={24} color="#ef4444" />
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            最終確認
          </Text>
        </View>

        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          本当にアカウントを削除しますか？確認のため、メールアドレスを入力してください。
        </Text>

        <TextInput
          className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-base text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 mb-4"
          placeholder={user?.email || "メールアドレス"}
          placeholderTextColor="#999"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl p-4 items-center"
            onPress={() => {
              setShowConfirmModal(false);
              setConfirmEmail("");
            }}
          >
            <Text className="text-gray-900 dark:text-white text-base font-semibold">
              キャンセル
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 bg-red-500 dark:bg-red-600 rounded-xl p-4 items-center ${
              loading || confirmEmail !== user?.email ? "opacity-50" : ""
            }`}
            onPress={handleDeleteConfirm}
            disabled={loading || confirmEmail !== user?.email}
          >
            <Text className="text-white text-base font-semibold">
              {loading ? "削除中..." : "削除する"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      className={`flex-row items-center justify-center rounded-2xl p-4 gap-2 bg-transparent border border-red-500 dark:border-red-400 ${
        loading ? "opacity-60" : ""
      }`}
      onPress={handleDeleteRequest}
      disabled={loading}
    >
      <Ionicons name="trash-outline" size={20} color="#ef4444" />
      <Text className="text-red-500 dark:text-red-400 text-base font-semibold">
        アカウント削除
      </Text>
    </Pressable>
  );
}
