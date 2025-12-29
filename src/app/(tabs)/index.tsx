import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="flex-1 justify-center items-center">
        <Text className="text-[22px] font-bold text-gray-900">ホーム</Text>
      </View>
    </SafeAreaView>
  );
}
