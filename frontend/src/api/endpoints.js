export const ENDPOINTS = {
  // ---------------- AUTH ----------------
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },

  // ---------------- USERS ----------------
  USER: {
    ME: "/users/me",
  },

  // ---------------- PETS ----------------
  PETS: {
    MY: "/pets",                    // GET my pets
    CREATE: "/pets",                // POST create pet
    BY_ID: (petId) => `/pets/${petId}`,
  },

  // ---------------- VISITS ----------------
  VISITS: {
    BY_PET: (petId) => `/visits/pet/${petId}`,
  },

  // ---------------- VETS ----------------
  VET: {
    BY_ID: (vetId) => `/vets/${vetId}`,

    // Service selection (appointment types)
    APPOINTMENT_TYPES: "/vets/appointment-types",

    // Used to show vets based on selected service/speciality
    BY_SPECIALITY: (speciality) =>
      `/vets?speciality=${encodeURIComponent(speciality)}`,

    WORKING_HOURS: (vetId) => `/vets/${vetId}/working-hours`,
    BREAKS: (vetId) => `/vets/${vetId}/breaks`,
    LEAVES: (vetId) => `/vets/${vetId}/holidays`,
  },

  // ---------------- SLOTS ----------------
  SLOTS: {
    GENERATE: "/slots/generate",

    // Used in booking wizard – time selection step
    // ⬇ Adjust query param names ONLY here if backend differs
    AVAILABLE: (vetId, fromDate, toDate) =>
      `/slots?vetId=${vetId}&from=${fromDate}&to=${toDate}`,
  },

  // ---------------- APPOINTMENTS ----------------
  APPOINTMENTS: {
    MY: "/appointments/my",

    // POST booking (OWNER)
    BOOK: "/appointments",

    // Confirmation / details page
    BY_ID: (id) => `/appointments/${id}`,

    // Cancel
    CANCEL: (id) => `/appointments/${id}/cancel`,

    // Vet/Admin views
    BY_VET: (vetId) => `/appointments/doctor/${vetId}`,
    ADMIN_ALL: "/appointments/admin/appointments",
  },

  // ---------------- ADMIN ----------------
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    USER_BY_ID: (id) => `/admin/users/${id}`,
    TOGGLE_USER_STATUS: (id) => `/admin/users/${id}/status`,
  },

  // ---------------- CHATBOT ----------------
  CHATBOT: {
    ASK: "/chatbot/ask",
  },
};
