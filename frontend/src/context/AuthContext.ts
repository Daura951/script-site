import { createContext } from "react";

export type AuthContextType = {
  id: string | null;
  username: string | null;
  discordEnabled: boolean | null;
  hasAuth: (auth?: string) => boolean;
  isLoading: boolean | null;
  error: unknown;
  ensureUserLoaded: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
