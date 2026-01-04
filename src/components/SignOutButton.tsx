import { useAuth } from "@/contexts/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, Text } from "react-native";

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

  const getButtonClasses = () => {
    const base = "flex-row items-center justify-center rounded-2xl p-4 gap-2";
    const disabled = loading ? "opacity-60" : "";

    if (variant === "outline") {
      return `${base} bg-transparent border border-red-500 dark:border-red-400 ${disabled}`;
    }
    if (variant === "text") {
      return `${base} bg-transparent p-2 ${disabled}`;
    }
    return `${base} bg-red-500 dark:bg-red-600 ${disabled}`;
  };

  const getTextClasses = () => {
    if (variant === "outline" || variant === "text") {
      return "text-red-500 dark:text-red-400 text-base font-semibold";
    }
    return "text-white text-base font-semibold";
  };

  const getIconColor = () => {
    if (variant === "default") return "#fff";
    return "#ef4444";
  };

  return (
    <Pressable
      className={getButtonClasses()}
      onPress={handleSignOut}
      disabled={loading}
    >
      {showIcon && (
        <Ionicons name="log-out-outline" size={20} color={getIconColor()} />
      )}
      <Text className={getTextClasses()}>{loading ? "処理中..." : label}</Text>
    </Pressable>
  );
}
