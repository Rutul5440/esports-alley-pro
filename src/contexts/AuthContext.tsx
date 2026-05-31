import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: UserRole, extras?: Record<string, string>) => Promise<void>;
  googleLogin: (email: string, username?: string, fullName?: string, avatar?: string) => Promise<void>;
  completeProfile: (payload: Record<string, unknown>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "bgmi_user";
const TOKEN_KEY = "bgmi_token";

interface AuthApiPayload {
  user: Omit<User, "token">;
  token: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, u.token);
    setUser(u);
  };

  const persistAuthPayload = (payload: AuthApiPayload) => {
    persist({
      ...payload.user,
      token: payload.token,
    });
  };

  const login = async (email: string, password: string) => {
    const payload = await authApi.login(email, password);
    persistAuthPayload(payload as AuthApiPayload);
  };

  const register = async (username: string, email: string, password: string, role: UserRole, extras: Record<string, string> = {}) => {
    const payload = await authApi.register({ username, email, password, role, ...extras });
    persistAuthPayload(payload as AuthApiPayload);
  };

  const googleLogin = async (email: string, username?: string, fullName?: string, avatar?: string) => {
    const payload = await authApi.googleLogin({ email, username, fullName, avatar });
    persistAuthPayload(payload as AuthApiPayload);
  };

  const completeProfile = async (payload: Record<string, unknown>) => {
    const response = await authApi.completeProfile(payload);
    persistAuthPayload(response as AuthApiPayload);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, googleLogin, completeProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
