import GoogleIcon from "@/assets/images/google-icon.svg";
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
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>おかえりなさい</ThemedText>
          <ThemedText style={styles.subtitle}>
            アカウントにログインしてください
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          {/* メールアドレス入力 */}
          <View
            style={[
              styles.inputContainer,
              emailFocused && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={emailFocused ? "#10b981" : "#666"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="メールアドレス"
              placeholderTextColor="#666"
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
            style={[
              styles.inputContainer,
              passwordFocused && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={passwordFocused ? "#10b981" : "#666"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="パスワード"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
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
            style={({ pressed }) => [
              styles.button,
              loading && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ThemedText style={styles.buttonText}>ログイン中...</ThemedText>
            ) : (
              <>
                <ThemedText style={styles.buttonText}>ログイン</ThemedText>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </Pressable>
        </View>

        {/* 区切り線 */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <ThemedText style={styles.dividerText}>または</ThemedText>
          <View style={styles.divider} />
        </View>

        {/* ソーシャルログインボタン */}
        <View style={styles.socialButtonsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              styles.googleButton,
              googleLoading && styles.buttonDisabled,
              pressed && styles.socialButtonPressed,
            ]}
            onPress={googleSignIn}
            disabled={googleLoading}
          >
            <GoogleIcon width={22} height={22} />
            <ThemedText style={styles.socialButtonGoogleText}>
              {googleLoading ? "処理中..." : "Googleでログイン"}
            </ThemedText>
          </Pressable>

          {Platform.OS === "ios" && (
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                styles.appleButton,
                appleLoading && styles.buttonDisabled,
                pressed && styles.socialButtonPressed,
              ]}
              onPress={appleSignIn}
              disabled={appleLoading}
            >
              <Ionicons name="logo-apple" size={22} color="#fff" />
              <ThemedText style={styles.socialButtonAppleText}>
                {appleLoading ? "処理中..." : "Appleでログイン"}
              </ThemedText>
            </Pressable>
          )}
        </View>

        <Link href="/(auth)/signup" asChild>
          <Pressable style={styles.linkButton}>
            <ThemedText style={styles.linkText}>
              アカウントをお持ちでない方は
              <ThemedText style={styles.linkTextBold}>こちら</ThemedText>
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
    paddingHorizontal: 28,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    fontWeight: "400",
  },
  formContainer: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainerFocused: {
    borderColor: "#10b981",
    backgroundColor: "#1f1f1f",
    shadowColor: "#10b981",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: "#10b981",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    shadowColor: "#10b981",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#2a2a2a",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  socialButtonsContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  socialButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  socialButtonGoogleText: {
    color: "#1f1f1f",
    fontSize: 16,
    fontWeight: "600",
  },
  appleButton: {
    backgroundColor: "#000",
    borderWidth: 1.5,
    borderColor: "#2a2a2a",
  },
  socialButtonAppleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    alignItems: "center",
    marginTop: 24,
    padding: 8,
  },
  linkText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "400",
  },
  linkTextBold: {
    color: "#10b981",
    fontWeight: "700",
  },
});
