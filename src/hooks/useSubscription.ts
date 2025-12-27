import { supabase } from "@/lib/supabase";
import { ChannelSearchResponse } from "@/types/channels";
import { useState } from "react";
import { Alert } from "react-native";

export const useSubscription = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChannelSearchResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = async () => {
    try {
      if (!searchQuery) {
        Alert.alert("エラー", "ハンドル名を入力してください", [{ text: "OK" }]);
        return;
      }
      setIsLoading(true);

      console.log("Searching for: @", searchQuery);

      const { data, error } = await supabase.functions.invoke(
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

      if (data && data.length > 0) {
        const rawChannel = data[0];

        const mappedResults: ChannelSearchResponse = {
          items: [
            {
              id: rawChannel.id,
              snippet: {
                title: rawChannel.snippet.title,
                description: rawChannel.snippet.description,
                customUrl: rawChannel.snippet.customUrl,
                thumbnails: {
                  default: {
                    url: rawChannel.snippet.thumbnails.default.url,
                  },
                  medium: {
                    url: rawChannel.snippet.thumbnails.medium.url,
                  },
                  high: {
                    url: rawChannel.snippet.thumbnails.high.url,
                  },
                },
              },
              statistics: {
                subscriberCount: rawChannel.statistics.subscriberCount,
                videoCount: rawChannel.statistics.videoCount,
              },
            },
          ],
        };
        setSearchResults(mappedResults);
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Internal Error: ", error);
      throw new Error(`Error: ${error}`);
    }
  };

  const performSubscribe = async (channel: ChannelSearchResponse) => {};

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    performSearch,
    performSubscribe,
  };
};
