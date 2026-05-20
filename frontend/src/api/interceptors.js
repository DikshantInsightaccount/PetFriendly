export function applyInterceptors(api, { authMode, getToken, onUnauthorized }) {
  // REQUEST INTERCEPTOR → attach JWT
  api.interceptors.request.use((config) => {
    if (authMode === "header") {
      const token = getToken?.();
      console.log("ATTACHING TOKEN:", token);

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // RESPONSE INTERCEPTOR → handle auth failures
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err?.response?.status;
      const url = err?.config?.url || "";

      // DO NOT trigger global logout for these
      const ignoreUnauthorized =
        url.startsWith("/users/me") ||
        url.startsWith("/auth/login") ||
        url.startsWith("/auth/register");

      if (!ignoreUnauthorized && status === 401) {
        onUnauthorized?.();
      }

      return Promise.reject(err);
    }
  );
}
