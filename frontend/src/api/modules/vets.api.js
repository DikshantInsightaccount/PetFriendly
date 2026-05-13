import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const vetsApi = {
  getAppointmentTypes: async () => {
    const res = await api.get(ENDPOINTS.VET.APPOINTMENT_TYPES);
    return res.data?.data; // ✅ always return array
  },

  getVetsBySpeciality: async (speciality) => {
    const res = await api.get(ENDPOINTS.VET.BY_SPECIALITY(speciality));
    return res.data?.data; // ✅ FIX HERE
  },


  getVetById: async (vetId) => {
    const res = await api.get(ENDPOINTS.VET.BY_ID(vetId));
    const vet = res.data?.data;

    return {
      vetId: vet.vetId,
      userId: vet.userId,
      name: vet.name ?? `Vet ${vet.vetId}`,
    };
  },

};
