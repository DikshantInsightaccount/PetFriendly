export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },

  USER: {
    // ✅ Core resources
    PETS: "/pets",
    VETS: "/vets",
    VISITS: "/visits",
    APPOINTMENTS: "/appointments",

    // ✅ My-specific endpoints
    PETS_MY: "/pets/my",
    VISITS_MY: "/visits/my",
    APPOINTMENTS_MY: "/appointments/my",

    // ✅ Booking-related
    APPOINTMENT_TYPES: "/appointment-types",
    DOCTOR_SLOTS: "/doctor-slots",
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    OWNERS: "/admin/owners",
    VETS: "/admin/vets",
    VISITS: "/admin/visits",
  },

  CHATBOT: {
    ASK: "/chatbot/ask",
  },
};