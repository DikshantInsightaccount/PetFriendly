export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },

  USER: {
    ME: "/users/me",               // ✅ vet profile
  },

  VET: {
    BY_ID: (vetId) => `/vets/${vetId}`,           // ✅ useful for admin & future
    WORKING_HOURS: (vetId) => `/vets/${vetId}/working-hours`,
    BREAKS: (vetId) => `/vets/${vetId}/breaks`,
    LEAVES: (vetId) => `/vets/${vetId}/holidays`,
  },

  APPOINTMENTS: {
    BY_VET: (vetId) => `/appointments/vet/${vetId}`,
    ADMIN_ALL: "/appointments/admin/appointments",
    CANCEL: (id) => `/appointments/${id}/cancel`,
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    USER_BY_ID: (id) => `/admin/users/${id}`,
    TOGGLE_USER_STATUS: (id) => `/admin/users/${id}/status`,
  },

  SLOTS: {
    GENERATE: "/slots/generate",
  },

  CHATBOT: {
    ASK: "/chatbot/ask",
  },
};