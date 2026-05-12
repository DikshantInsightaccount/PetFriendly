import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const vetsApi = {
  getAppointmentTypes: async () => {
    const res = await api.get(ENDPOINTS.VET.APPOINTMENT_TYPES);
    return res.data?.data ?? res.data;
  },

  getVetsBySpeciality: async (speciality) => {
    const res = await api.get(ENDPOINTS.VET.BY_SPECIALITY(speciality));
    return res.data?.data ?? res.data;
  },
};