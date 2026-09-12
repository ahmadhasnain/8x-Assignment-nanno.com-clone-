import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { AuthUser, Role } from "../lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (email: string, password: string, role: Role, fullName: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("naano_user");
    const token = localStorage.getItem("naano_token");
    if (raw && token) {
      setUser(JSON.parse(raw));
    }
    setLoading(false);
  }, []);

  function persist(token: string, user: AuthUser) {
    localStorage.setItem("naano_token", token);
    localStorage.setItem("naano_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data.token, data.user);
    return data.user as AuthUser;
  }

  async function register(email: string, password: string, role: Role, fullName: string) {
    const { data } = await api.post("/auth/register", { email, password, role, fullName });
    persist(data.token, data.user);
    return data.user as AuthUser;
  }

  function logout() {
    localStorage.removeItem("naano_token");
    localStorage.removeItem("naano_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
