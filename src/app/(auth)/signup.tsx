import GoogleIcon from "@/assets/images/google-icon.svg";
import { useAppleSignIn } from "@/components/useAppleSignIn";
import { useGoogleSignIn } from "@/components/useGoogleSignIn";
import { useAuth } from "@/contexts/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { signIn: googleSignIn, isLoading: googleLoading } = useGoogleSignIn();
  const { signIn: appleSignIn, isLoading: appleLoading } = useAppleSignIn();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("エラー", "すべての項目を入力してください");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("エラー", "パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      Alert.alert("エラー", "パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("サインアップエラー", error.message);
    } else {
      Alert.alert(
        "確認メール送信",
        "メールアドレスに確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6 gap-3"
      >
        <Text className="text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
          アカウント作成
        </Text>

        <TextInput
          className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 text-base text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"
          placeholder="メールアドレス"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 text-base text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"
          placeholder="パスワード（6文字以上）"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 text-base text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"
          placeholder="パスワード（確認）"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          className={`bg-emerald-500 rounded-2xl p-4 items-center mt-2 ${
            loading ? "opacity-60" : ""
          }`}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text className="text-white text-base font-semibold">
            {loading ? "作成中..." : "アカウント作成"}
          </Text>
        </Pressable>

        {/* 区切り線 */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800" />
          <Text className="mx-4 text-gray-500 dark:text-gray-400 text-sm">
            または
          </Text>
          <View className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800" />
        </View>

        {/* ソーシャルログインボタン */}
        <Pressable
          className={`flex-row items-center justify-center rounded-2xl p-4 gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ${
            googleLoading ? "opacity-60" : ""
          }`}
          onPress={googleSignIn}
          disabled={googleLoading}
        >
          <GoogleIcon width={20} height={20} />
          <Text className="text-gray-900 dark:text-white text-base font-semibold">
            {googleLoading ? "処理中..." : "Googleで続ける"}
          </Text>
        </Pressable>

        {Platform.OS === "ios" && (
          <Pressable
            className={`flex-row items-center justify-center rounded-2xl p-4 gap-3 bg-black dark:bg-white border border-gray-800 dark:border-gray-200 ${
              appleLoading ? "opacity-60" : ""
            }`}
            onPress={appleSignIn}
            disabled={appleLoading}
          >
            <Ionicons
              name="logo-apple"
              size={20}
              color={Platform.OS === "ios" ? "#fff" : "#000"}
            />
            <Text className="text-white dark:text-black text-base font-semibold">
              {appleLoading ? "処理中..." : "Appleで続ける"}
            </Text>
          </Pressable>
        )}

        <Link href="/(auth)/login" asChild>
          <Pressable className="items-center mt-4">
            <Text className="text-emerald-500 dark:text-emerald-400 text-sm font-medium">
              既にアカウントをお持ちの方はこちら
            </Text>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </View>
  );
}
