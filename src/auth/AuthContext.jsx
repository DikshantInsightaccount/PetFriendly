import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "./authService";
import { setUnauthorizedHandler } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const refreshMe = async () => {
    const me = await authService.me();
    setUser(me);
    return me;
  };

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));

    (async () => {
      try {
        await refreshMe();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo(() => {
    return {
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isLoading,

      login: async ({ email, password }) => {
        await authService.login({ email, password });
        return await refreshMe(); // ✅ return profile so Login page can route
      },

      register: async (payload) => {
        return await authService.register(payload);
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {}
        setUser(null);
      },
    };
  }, [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}