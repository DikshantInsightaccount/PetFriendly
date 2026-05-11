// src/adminApi.js
import { api } from "../../api/axios";

/** ResponseMessage<T> unwrap */
const unwrap = (payload) =>
  payload && typeof payload === "object" && "data" in payload ? payload.data : payload;

export const adminApi = {
  // ---- AuthService Admin endpoints ----
  async createUser(request) {
    const res = await api.post("/admin/users", request);
    return unwrap(res.data);
  },

  async getAllUsers() {
    const res = await api.get("/admin/users");
    return unwrap(res.data) || [];
  },

  async getUser(userId) {
    const res = await api.get(`/admin/users/${userId}`);
    return unwrap(res.data);
  },

  async toggleUserStatus(userId) {
    const res = await api.patch(`/admin/users/${userId}/status`);
    return unwrap(res.data);
  },

  // ---- VetService endpoints (domain vet record) ----
  async createVetProfile(userId) {
    // backend: POST /vets?userId=...
    const res = await api.post("/vets", null, { params: { userId } });
    return unwrap(res.data);
  },

  async getVetsBySpeciality(speciality) {
    const res = await api.get("/vets", { params: { speciality } });
    return unwrap(res.data) || [];
  },

  async getVetById(vetId) {
    const res = await api.get(`/vets/${vetId}`);
    return unwrap(res.data);
  },

  // ---- Appointments Admin endpoints (you already use) ----
  async getAllAppointmentsAdmin() {
    const res = await api.get("/appointments/admin/appointments");
    return unwrap(res.data) || res.data || [];
  },

  // ---- Visits (best-effort; adjust if your backend differs) ----
  async getAllVisitsAdmin() {
    // If your backend has /admin/visits keep this.
    // If not, change to "/visits" later.
    const res = await api.get("/admin/visits");
    return unwrap(res.data) || [];
  },
};
