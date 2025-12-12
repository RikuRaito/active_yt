import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      router.replace("/(tabs)/home");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <ThemedText style={styles.title}>ログイン</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="パスワード"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? "ログイン中..." : "ログイン"}
          </ThemedText>
        </Pressable>

        {/* 区切り線 */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <ThemedText style={styles.dividerText}>または</ThemedText>
          <View style={styles.divider} />
        </View>

        {/* ソーシャルログインボタン */}
        <Pressable
          style={[
            styles.socialButton,
            styles.googleButton,
            googleLoading && styles.buttonDisabled,
          ]}
          onPress={googleSignIn}
          disabled={googleLoading}
        >
          <Ionicons name="logo-google" size={20} color="#fff" />
          <ThemedText style={styles.socialButtonText}>
            {googleLoading ? "処理中..." : "Googleでログイン"}
          </ThemedText>
        </Pressable>

        {Platform.OS === "ios" && (
          <Pressable
            style={[
              styles.socialButton,
              styles.appleButton,
              appleLoading && styles.buttonDisabled,
            ]}
            onPress={appleSignIn}
            disabled={appleLoading}
          >
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <ThemedText style={styles.socialButtonText}>
              {appleLoading ? "処理中..." : "Appleでログイン"}
            </ThemedText>
          </Pressable>
        )}

        <Link href="/(auth)/signup" asChild>
          <Pressable style={styles.linkButton}>
            <ThemedText style={styles.linkText}>
              アカウントをお持ちでない方はこちら
            </ThemedText>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#888",
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  googleButton: {
    backgroundColor: "#ea4335",
  },
  appleButton: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#333",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    color: "#3b82f6",
    fontSize: 14,
  },
});
