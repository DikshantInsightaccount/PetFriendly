import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const appointmentsApi = {
  book: async (payload) => {
    const res = await api.post(ENDPOINTS.APPOINTMENTS.BOOK, payload);
    return res.data?.data ?? res.data;
  },

  my: async () => {
    const res = await api.get(ENDPOINTS.APPOINTMENTS.MY);
    return res.data?.data ?? res.data;
  },

  getById: async (appointmentId) => {
    const res = await api.get(ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId));
    return res.data?.data ?? res.data;
  },

  cancel: async (appointmentId) => {
    const res = await api.post(ENDPOINTS.APPOINTMENTS.CANCEL(appointmentId));
    return res.data?.data ?? res.data;
  },

  doctorAppointments: async (vetId) => {
    const res = await api.get(ENDPOINTS.APPOINTMENTS.BY_VET(vetId));
    return res.data?.data ?? res.data;
  },

  adminAll: async () => {
    const res = await api.get(ENDPOINTS.APPOINTMENTS.ADMIN_ALL);
    return res.data?.data ?? res.data;
  },

  updateStatus: async (appointmentId, status) => {
    const res = await api.patch(
      ENDPOINTS.APPOINTMENTS.UPDATE_STATUS(appointmentId),
      { status }
    );
    return res.data?.data ?? res.data;
  },
};