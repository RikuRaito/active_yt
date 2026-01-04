import { ChannelVideo } from "@/types/channel-videos";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ScreenOrientation from "expo-screen-orientation";
import { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface ChannelVideoItemProps {
  item: ChannelVideo;
}

export function ChannelVideoItem({ item }: ChannelVideoItemProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { width, height } = useWindowDimensions();

  const openPlayer = async () => {
    setIsModalVisible(true);
    setIsPlaying(true);
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
  };

  const handlePlayerStateChange = async (state: string) => {
    console.log("Player State: ", state);

    // 動画が終了したらモーダルを閉じる
    if (state === "ended") {
      closeModal();
    }
  };

  const closeModal = async () => {
    setIsModalVisible(false);
    setIsPlaying(false);
  };

  const handleModalDismiss = async () => {
    console.log("Modal dismissed, returning to default orientation");
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.DEFAULT
    );
  };

  // フルスクリーン時の動画サイズを計算 (16:9)
  // 横画面時は width が長辺、height が短辺になる
  const videoHeight = height;
  const videoWidth = (height * 16) / 9;

  return (
    <>
      <View className="mb-6 overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
        {/* サムネイル + 再生ボタン */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openPlayer}
          className="relative w-full aspect-video bg-black"
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          {/* 再生ボタンオーバーレイ */}
          <View className="absolute inset-0 items-center justify-center">
            <View className="w-16 h-16 rounded-full bg-black/60 items-center justify-center">
              <Ionicons name="play" size={32} color="white" />
            </View>
          </View>
        </TouchableOpacity>
        <View className="p-4">
          <Text
            className="text-[15px] font-bold text-gray-900 dark:text-white leading-5"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            {new Date(item.publishedAt).toLocaleDateString("ja-JP")}
          </Text>
        </View>
      </View>

      {/* 擬似フルスクリーンモーダル */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        supportedOrientations={["landscape", "portrait"]}
        onRequestClose={closeModal}
        statusBarTranslucent
        onDismiss={handleModalDismiss}
      >
        <View className="flex-1 bg-black justify-center items-center">
          <YoutubePlayer
            width={videoWidth > width ? width : videoWidth}
            height={videoHeight}
            videoId={item.videoId}
            play={isPlaying}
            onChangeState={handlePlayerStateChange}
            initialPlayerParams={{
              preventFullScreen: true,
              controls: true,
            }}
          />
          {/* 閉じるボタン */}
          <TouchableOpacity
            onPress={closeModal}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
          >
            <Text className="text-white text-xl font-bold">✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
