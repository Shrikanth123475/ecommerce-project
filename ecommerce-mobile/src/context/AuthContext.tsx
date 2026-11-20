import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { setSessionExpiredHandler } from "@/services/api";
import * as authService from "@/services/authService";
import type { RegisterInput, User } from "@/services/authService";
import { clearToken, getToken, saveToken } from "@/storage/authStorage";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    await clearToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(signOut);
    return () => setSessionExpiredHandler(null);
  }, [signOut]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await getToken();
        if (stored) {
          const profile = await authService.getProfile();
          setToken(stored);
          setUser(profile);
        }
      } catch {
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const newToken = await authService.login(email.trim(), password);
    await saveToken(newToken);
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setToken(newToken);
    } catch (error) {
      await clearToken();
      throw error;
    }
  }, []);

  const signUp = useCallback(
    async (input: RegisterInput) => {
      await authService.register({ ...input, email: input.email.trim() });
      await signIn(input.email, input.password);
    },
    [signIn],
  );

  const value = useMemo(
    () => ({ token, user, loading, signIn, signUp, signOut }),
    [token, user, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
