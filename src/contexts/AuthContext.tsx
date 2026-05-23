import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearSession,
  fetchMe,
  login as apiLogin,
  register as apiRegister,
  type AuthUser,
} from "@/lib/auth";
import { clearLocalSyncOnLogout, syncBootstrap } from "@/lib/sync";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bootstrapSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const me = await fetchMe();
      setUser(me);
      if (me) await syncBootstrap();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  const login = useCallback(async (email: string, password: string) => {
    await apiLogin(email, password);
    const me = await fetchMe();
    setUser(me);
    if (me) await syncBootstrap();
  }, []);

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    await apiRegister(email, password, fullName);
    await apiLogin(email, password);
    const me = await fetchMe();
    setUser(me);
    if (me) await syncBootstrap();
  }, []);

  const logout = useCallback(() => {
    clearSession();
    void clearLocalSyncOnLogout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
