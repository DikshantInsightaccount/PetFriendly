import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const vetsApi = {
  getAppointmentTypes: async () => {
    const res = await api.get(ENDPOINTS.VET.APPOINTMENT_TYPES);
    return res.data?.data;
  },

  getVetsBySpeciality: async (speciality) => {
    const res = await api.get(ENDPOINTS.VET.BY_SPECIALITY(speciality));
    return res.data?.data;
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

  getAllVets: async () => {
    const res = await api.get(ENDPOINTS.VET.SUMMARIES);
    return res.data?.data;
  },


  getMyVetId: async () => {
    const res = await api.get(ENDPOINTS.VET.MY_VET_ID);
    return res.data; // controller returns Long directly
  },


  getMyWorkingHours: async () => {
    const vetId = await vetsApi.getMyVetId();
    const res = await api.get(ENDPOINTS.VET.WORKING_HOURS(vetId));
    return res.data?.data ?? [];
  },

  getMyBreaks: async () => {
    const vetId = await vetsApi.getMyVetId();
    const res = await api.get(ENDPOINTS.VET.BREAKS(vetId));
    return res.data?.data ?? [];
  },

  getBreaksByVetId: async (vetId) => {
    const res = await api.get(ENDPOINTS.VET.BREAKS(vetId));
    return res.data?.data ?? [];
  },




};
