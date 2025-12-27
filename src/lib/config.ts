const isDev = __DEV__;

export const FUNCTIONS_URL = isDev
  ? process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL_DEV
  : process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL_PROD;

export const SUPABASE_URL = isDev
  ? process.env.EXPO_PUBLIC_SUPABASE_URL_DEV
  : process.env.EXPO_PUBLIC_SUPABASE_URL;

export const SUPABASE_ANON_KEY = isDev
  ? process.env.EXPO_PUBLIC_SUPABASE_KEY_DEV
  : process.env.EXPO_PUBLIC_SUPABASE_KEY;
