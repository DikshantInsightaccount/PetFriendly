import axios from "axios";
import { applyInterceptors } from "./interceptors";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const authMode = (import.meta.env.VITE_AUTH_MODE || "cookie").toLowerCase();

// ✅ Create axios instance
const api = axios.create({
  baseURL,
  withCredentials: authMode === "cookie",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Unauthorized handler
let onUnauthorized = null;

export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

// ✅ Apply interceptors
applyInterceptors(api, {
  authMode,
  getToken: () => null,
  onUnauthorized: () => onUnauthorized?.(),
});

// ✅ Default export (IMPORTANT)
export default api;