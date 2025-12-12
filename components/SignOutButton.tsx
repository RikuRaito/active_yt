import { useAuth } from "@/contexts/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

type SignOutButtonProps = {
  variant?: "default" | "outline" | "text";
  label?: string;
  showIcon?: boolean;
};

export function SignOutButton({
  variant = "default",
  label = "ログアウト",
  showIcon = true,
}: SignOutButtonProps) {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    Alert.alert("ログアウト", "ログアウトしますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "ログアウト",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          await signOut();
          setLoading(false);
        },
      },
    ]);
  };

  const buttonStyles = [
    styles.button,
    variant === "outline" && styles.buttonOutline,
    variant === "text" && styles.buttonText,
    loading && styles.buttonDisabled,
  ];

  const textStyles = [
    styles.label,
    variant === "outline" && styles.labelOutline,
    variant === "text" && styles.labelText,
  ];

  const iconColor =
    variant === "default"
      ? "#fff"
      : variant === "outline"
      ? "#ef4444"
      : "#ef4444";

  return (
    <Pressable style={buttonStyles} onPress={handleSignOut} disabled={loading}>
      {showIcon && (
        <Ionicons name="log-out-outline" size={20} color={iconColor} />
      )}
      <Text style={textStyles}>{loading ? "処理中..." : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  buttonText: {
    backgroundColor: "transparent",
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  labelOutline: {
    color: "#ef4444",
  },
  labelText: {
    color: "#ef4444",
  },
});
