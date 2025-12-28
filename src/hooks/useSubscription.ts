import { supabase } from "@/lib/supabase";
import { Channel } from "@/types/channels";
import { useState } from "react";
import { Alert } from "react-native";

export const useSubscription = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = async () => {
    try {
      if (!searchQuery) {
        Alert.alert("エラー", "ハンドル名を入力してください", [{ text: "OK" }]);
        return;
      }
      setIsLoading(true);
      setSearchResult(null);

      console.log("Searching for: @", searchQuery);

      const { data, error } = await supabase.functions.invoke<Channel>(
        "search-channel",
        {
          body: { handle: searchQuery },
        }
      );

      if (error) {
        console.log("Response error", error);
        console.log("Error Status:", error.context?.status);
        console.log("Error Message:", error.message);
        setIsLoading(false);
        return;
      }

      // Functions側でマッピング済みのデータをそのまま使用
      if (data) {
        setSearchResult(data);
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Internal Error: ", error);
      setIsLoading(false);
      throw new Error(`Error: ${error}`);
    }
  };

  const performSubscribe = async (channel: Channel) => {};

  return {
    searchQuery,
    setSearchQuery,
    searchResult,
    setSearchResult,
    isLoading,
    setIsLoading,
    performSearch,
    performSubscribe,
  };
};
