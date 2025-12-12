import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

type SettingsButtonProps = {
  size?: number;
  color?: string;
};

export function SettingsButton({
  size = 24,
  color = "#fff",
}: SettingsButtonProps) {
  const handlePress = () => {
    router.push("/settings");
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={handlePress}
      hitSlop={8}
    >
      <Ionicons name="settings-outline" size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  pressed: {
    opacity: 0.6,
  },
});
