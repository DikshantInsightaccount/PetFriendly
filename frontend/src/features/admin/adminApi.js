// src/adminApi.js
import { api } from "../../api/axios";

/** ResponseMessage<T> unwrap */
const unwrap = (payload) =>
  payload && typeof payload === "object" && "data" in payload
    ? payload.data
    : payload;

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

  // ------------------------------------------------------------------
  // ✅ NEW: VetService endpoints (for vet creation WITH appointment types)
  // ------------------------------------------------------------------

  // ✅ Fetch appointment types for checkbox UI
  async getAppointmentTypes() {
    const res = await api.get("/vets/appointment-types");
    return unwrap(res.data) || [];
  },

  // ✅ Create vet + assign appointment types in ONE CALL
  async createVetWithTypes(userId, appointmentTypeIds) {
    const payload = {
      userId,
      appointmentTypeIds: appointmentTypeIds ?? [],
    };

    const res = await api.post("/vets", payload);
    return unwrap(res.data);
  },

  // ------------------------------------------------------------------
  // ⚠️ OLD (keep for backward compatibility, but STOP using in UI)
  // ------------------------------------------------------------------
  // async createVetProfile(userId) {
  //   // backend: POST /vets?userId=...
  //   const res = await api.post("/vets", null, { params: { userId } });
  //   return unwrap(res.data);
  // },

  async getVetsBySpeciality(speciality) {
    const res = await api.get("/vets", { params: { speciality } });
    return unwrap(res.data) || [];
  },

  async getVetById(vetId) {
    const res = await api.get(`/vets/${vetId}`);
    return unwrap(res.data);
  },

  // ---- Appointments Admin endpoints ----
  async getAllAppointmentsAdmin() {
    const res = await api.get("/appointments/admin/appointments");
    return unwrap(res.data) || [];
  },

  // ---- Visits Admin endpoints ----
  async getAllVisitsAdmin() {
    const res = await api.get("/visits/");
    return unwrap(res.data) || [];
  },
 
  async createVisitAdmin(visit) {
    const res = await api.post("/visits/", visit, {
      headers: { "Content-Type": "application/json" },
    });
    return unwrap(res.data);
  },
  
  async getVetSummaries() {
    const res = await api.get("/vets/summaries");
    return unwrap(res.data) || [];
  },
 
  // ✅ (Optional) userId -> vetId map (helps Admin Users list)
  async getUserVetMap() {
    const res = await api.get("/vets/user-map");
    return unwrap(res.data) || [];
  },

  async getVisitsByPetAdmin(petId) {
    const res = await api.get(`/visits/pet/${petId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return unwrap(res.data) || [];
  },
 
  async getVetWorkingHours(vetId) {
  const res = await api.get(`/vets/${vetId}/working-hours`);
  return res.data; // ResponseMessage wrapper
},

async getMyVetId() {
    const res = await api.get("/vets/me/vet-id");
    return res.data; // number
  },
 
async addVetWorkingHour(vetId, payload) {
  const res = await api.post(`/vets/${vetId}/working-hours`, payload);
  return res.data;
},
 
async getAppointmentsByVet(vetId) {
    const res = await api.get(`/appointments/vet/${vetId}`);
    return unwrap(res.data) || [];
  },
 
  // ✅ NEW (includes petName/type/breed)
  async getAppointmentsByVetWithPet(vetId) {
    const res = await api.get(`/appointment/vet/${vetId}/with-pet`);
    return unwrap(res.data) || [];
  },
 
  async getAppointmentsByVetAndPet(vetId, petId) {
    const res = await api.get(`/appointment/vet/${vetId}/pet/${petId}`);
    return unwrap(res.data) || [];
  },
 
  // OPTIONAL (includes petName/type/breed)
  async getAppointmentsByVetAndPetWithPet(vetId, petId) {
    const res = await api.get(`/appointment/vet/${vetId}/pet/${petId}/with-pet`);
    return unwrap(res.data) || [];
  },

async addVetWorkingSchedule(vetId, { startTime, endTime, days }) {
    const requests = (days || []).map((day) =>
      this.addVetWorkingHour(vetId, { dayOfWeek: day, startTime, endTime })
    );
    return Promise.all(requests);
  },



async getVetBreaks(vetId) {
    const res = await api.get(`/vets/${vetId}/breaks`);
    return unwrap(res.data) || [];
  },
 
  async addVetBreak(vetId, payload) {
    const res = await api.post(`/vets/${vetId}/breaks`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return unwrap(res.data);
  },

}