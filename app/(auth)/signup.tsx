import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

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
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <ThemedText style={styles.title}>アカウント作成</ThemedText>

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
          placeholder="パスワード（6文字以上）"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="パスワード（確認）"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? "作成中..." : "アカウント作成"}
          </ThemedText>
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.linkButton}>
            <ThemedText style={styles.linkText}>
              既にアカウントをお持ちの方はこちら
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
    gap: 16,
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
    backgroundColor: "#68b8e6",
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
  linkButton: {
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    color: "#3b82f6",
    fontSize: 14,
  },
});
