const isDev = __DEV__;

export const FUNCTIONS_URL = isDev
  ? process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL_DEV
  : process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL_PROD;
