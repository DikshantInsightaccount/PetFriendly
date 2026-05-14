import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "./authService";
import { setUnauthorizedHandler } from "../api/axios";
import { tokenStore } from "./tokenStore";
import { adminApi } from "../features/admin/adminApi";

const AuthContext = createContext(null);

// ✅ token extractor (unchanged)
function extractToken(response) {
  return (
    response?.token ||
    response?.accessToken ||
    response?.jwt ||
    response?.data?.accessToken ||
    response?.data?.token ||
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
    const res = await authService.me();
    const user = res.data;
    setUser(user);
    return user;
  };

  // ✅ FIX‑1: guard `/users/me` with token check
  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStore.clear();
      setUser(null);
    });

    const token = tokenStore.get();

    if (!token) {
      // ✅ No token → NOT logged in → do nothing
      setUser(null);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        await refreshMe();
      } catch (err) {
        // ✅ token invalid / expired
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

      login: async ({ email, password }) => {
        const response = await authService.login({ email, password });

        const mode = authMode();
        const token = extractToken(response);

        if (mode === "header" && token) {
          tokenStore.set(token);
        }

        const profile = await refreshMe();

        // ✅ store user basics
        localStorage.setItem("userId", profile.userId);
        localStorage.setItem("role", profile.role);

        // ✅ store vetId for vets

        if (profile.role === "VET") {
          const vetId = await adminApi.getMyVetId(); // calls /vets/me/vet-id
          localStorage.setItem("vetId", String(vetId));
        }
        return profile;
      },

      register: async (payload) => {
        return await authService.register(payload);
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch { }
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