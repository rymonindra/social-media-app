import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, User } from "../services/api";

type SafeUser = Omit<User, "password">;

interface AuthCtx {
  user: SafeUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (input: { username: string; email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const me = await api.me();
    setUser(me);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const login = async (identifier: string, password: string) => {
    const me = await api.login(identifier, password);
    setUser(me);
  };

  const register = async (input: { username: string; email: string; password: string; name: string }) => {
    const me = await api.register(input);
    setUser(me);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
