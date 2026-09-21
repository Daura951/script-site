import { QueryClient, useQuery } from "@tanstack/react-query";
import { useCallback, type ReactNode } from "react";
import { Env } from "../Env";
import { apiFetch } from "../hooks/ApiClient";
import { User } from "../types/LoginTypes";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null>({
    queryKey: ["userAuthQuery"],
    queryFn: async (): Promise<User> =>
      apiFetch(`${Env.API_BASE_URL}/users`, {
        method: "GET",
        schema: User,
      }),
    retry: false,
  });

  const username = user?.username ?? "";
  const discordEnabled = user?.discordEnabled ?? null;
  const id = user?.id ?? "";
  const permissions = user?.permissions ?? [];

  const hasAuth = (auth?: string) => {
    if (!auth) return true;
    return permissions.includes(auth);
  };

  const ensureUserLoaded = useCallback(async () => {
    const queryClient = new QueryClient();
    const data = queryClient.getQueryData(["userAuthQuery"]);

    if (!data) {
      const res = await apiFetch(`${Env.API_BASE_URL}/users`, {
        method: "GET",
        schema: User,
      });
      queryClient.setQueryData(["userAuthQuery"], res);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        id,
        username,
        discordEnabled,
        hasAuth,
        isLoading,
        error,
        ensureUserLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
