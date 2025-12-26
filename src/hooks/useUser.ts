import { useAuth } from "@/contexts/auth-context";

type UserInfo = {
  id: string | null;
  email: string | null;
  isLoggedIn: boolean;
};

export function useUser(): UserInfo {
  const { user } = useAuth();

  return {
    id: user?.id ?? null,
    email: user?.email ?? null,
    isLoggedIn: !!user,
  };
}
