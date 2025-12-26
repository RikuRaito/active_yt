import { supabase } from "@/lib/supabase";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setIsLoading(true);
    try {
      const { data, error: supabaseError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "activeyt://google-auth",
            skipBrowserRedirect: true,
          },
        });

      if (supabaseError) throw supabaseError;

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        "activeyt://google-auth"
      );

      if (result.type === "success") {
        // URLからトークンを抽出
        const { url } = result;
        const params = QueryParams.getQueryParams(url);

        // アクセストークンとリフレッシュトークンを取得
        const access_token = params.params["access_token"];
        const refresh_token = params.params["refresh_token"];

        if (access_token && refresh_token) {
          // Supabaseセッションを設定 → 自動的にAsyncStorageに保存される
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) throw sessionError;
          console.log("Google login successfully, session saved!");
        } else {
          throw new Error("トークンの取得に失敗しました");
        }
      } else {
        console.log("Google Login cancelled");
      }
    } catch (err) {
      const error = err as Error;
      Alert.alert("Google login error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
  };
};
