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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { signIn } = useAuth();
  const { signIn: googleSignIn, isLoading: googleLoading } = useGoogleSignIn();
  const { signIn: appleSignIn, isLoading: appleLoading } = useAppleSignIn();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("ログインエラー", error.message);
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-7"
      >
        <View className="mb-10">
          <Text className="text-4xl font-extrabold text-center mb-2 text-gray-900 dark:text-white">
            おかえりなさい
          </Text>
          <Text className="text-[15px] text-gray-500 dark:text-gray-400 text-center">
            アカウントにログインしてください
          </Text>
        </View>

        <View className="gap-4">
          {/* メールアドレス入力 */}
          <View
            className={`flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 px-4 py-1 ${
              emailFocused
                ? "border-emerald-500 dark:border-emerald-400"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={emailFocused ? "#10b981" : "#666"}
              style={{ marginRight: 12 }}
            />
            <TextInput
              className="flex-1 text-base text-gray-900 dark:text-white py-4"
              placeholder="メールアドレス"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {/* パスワード入力 */}
          <View
            className={`flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 px-4 py-1 ${
              passwordFocused
                ? "border-emerald-500 dark:border-emerald-400"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={passwordFocused ? "#10b981" : "#666"}
              style={{ marginRight: 12 }}
            />
            <TextInput
              className="flex-1 text-base text-gray-900 dark:text-white py-4"
              placeholder="パスワード"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="p-2"
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#666"
              />
            </Pressable>
          </View>

          {/* ログインボタン */}
          <Pressable
            className={`bg-emerald-500 rounded-2xl p-[18px] flex-row items-center justify-center gap-2 mt-2 ${
              loading ? "opacity-60" : ""
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-[17px] font-bold">
              {loading ? "ログイン中..." : "ログイン"}
            </Text>
            {!loading && (
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            )}
          </Pressable>
        </View>

        {/* 区切り線 */}
        <View className="flex-row items-center my-7">
          <View className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800" />
          <Text className="mx-4 text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">
            または
          </Text>
          <View className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800" />
        </View>

        {/* ソーシャルログインボタン */}
        <View className="gap-3">
          <Pressable
            className={`flex-row items-center justify-center rounded-2xl p-4 gap-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ${
              googleLoading ? "opacity-60" : ""
            }`}
            onPress={googleSignIn}
            disabled={googleLoading}
          >
            <GoogleIcon width={22} height={22} />
            <Text className="text-gray-900 dark:text-white text-base font-semibold">
              {googleLoading ? "処理中..." : "Googleでログイン"}
            </Text>
          </Pressable>

          {Platform.OS === "ios" && (
            <Pressable
              className={`flex-row items-center justify-center rounded-2xl p-4 gap-2.5 bg-black dark:bg-white border border-gray-800 dark:border-gray-200 ${
                appleLoading ? "opacity-60" : ""
              }`}
              onPress={appleSignIn}
              disabled={appleLoading}
            >
              <Ionicons
                name="logo-apple"
                size={22}
                color={Platform.OS === "ios" ? "#fff" : "#000"}
              />
              <Text className="text-white dark:text-black text-base font-semibold">
                {appleLoading ? "処理中..." : "Appleでログイン"}
              </Text>
            </Pressable>
          )}
        </View>

        <Link href="/(auth)/signup" asChild>
          <Pressable className="items-center mt-6 p-2">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              アカウントをお持ちでない方は
              <Text className="text-emerald-500 dark:text-emerald-400 font-bold">
                こちら
              </Text>
            </Text>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </View>
  );
}
