import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "./authService";
import { setUnauthorizedHandler } from "../api/axios";
import { tokenStore } from "./tokenStore";

const AuthContext = createContext(null);

// ✅ FIXED token extractor
function extractToken(response) {
  return (
    response?.token ||
    response?.accessToken ||
    response?.jwt ||
    response?.data?.accessToken || // ✅ THIS IS THE KEY
    response?.data?.token ||        // (optional backward compatibility)
    null
  );
}

function authMode() {
  return (import.meta.env.VITE_AUTH_MODE || "cookie").toLowerCase();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const refreshMe = async () => {
    const me = await authService.me();
    setUser(me);
    return me;
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStore.clear();
      setUser(null);
    });

    (async () => {
      try {
        await refreshMe();
      } catch (err) {
        // ✅ 401 before login is normal
        if (err?.response?.status !== 401) {
          console.error("Auth bootstrap error:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isLoading,

      login: async ({ email, password, role }) => {
        const response = await authService.login({ email, password, role });

        // ✅ token is now correctly extracted & saved
        const mode = authMode();
        const token = extractToken(response);
        if (mode === "header" && token) {
          tokenStore.set(token);
        }

        return await refreshMe();
      },

      register: async (payload) => {
        return await authService.register(payload);
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {}
        tokenStore.clear();
        setUser(null);
      },
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}