const KEY = "accessToken";

export const tokenStore = {
  get: () => localStorage.getItem(KEY),
  set: (token) => localStorage.setItem(KEY, token),
  clear: () => localStorage.removeItem(KEY),
};