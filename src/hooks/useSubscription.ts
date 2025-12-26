import { ChannelSearchResponse } from "@/types/channels";
import { useState } from "react";
import { Alert } from "react-native";

export const useSubscription = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChannelSearchResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const performSearch = async () => {
    if (!searchQuery) {
      Alert.alert("エラー", "ハンドル名を入力してください", [{ text: "OK" }]);
      return;
    }
    setIsLoading(true);

    console.log("Searching for: @", searchQuery);

    //UIの切り替わりを確認するための一時的なタイムアウト
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    isEmpty,
    setIsEmpty,
    performSearch,
  };
};
