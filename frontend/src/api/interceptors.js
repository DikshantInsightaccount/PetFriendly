export function applyInterceptors(api, { authMode, getToken, onUnauthorized }) {
  api.interceptors.request.use((config) => {
    if (authMode === "header") {
      const token = getToken?.();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      const s = err?.response?.status;
      if ((s === 401 || s === 403) && onUnauthorized) onUnauthorized();
      return Promise.reject(err);
    }
  );
}