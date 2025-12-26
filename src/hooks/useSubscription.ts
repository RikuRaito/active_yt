import { ChannelSearchResponse } from "@/types/channels";
import { useState } from "react";

export const useSubscription = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChannelSearchResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = () => {
    if (!searchQuery) return;
    setIsLoading(true);

    console.log("Searching for: @", searchQuery);
    setIsLoading(false);
  };
  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    performSearch,
  };
};
