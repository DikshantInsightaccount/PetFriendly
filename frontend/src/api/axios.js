import axios from "axios";
import { applyInterceptors } from "./interceptors";
import { tokenStore } from "../auth/tokenStore";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";
const authMode = (import.meta.env.VITE_AUTH_MODE || "cookie").toLowerCase();

export const api = axios.create({
  baseURL,
  withCredentials: authMode === "cookie",
  headers: { "Content-Type": "application/json" },
});

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

applyInterceptors(api, {
  authMode,
  getToken: () => tokenStore.get(),
  onUnauthorized: () => onUnauthorized?.(),
});
