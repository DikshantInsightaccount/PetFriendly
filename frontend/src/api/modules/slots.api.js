import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";


export const slotsApi = {
  getAvailableSlots: async (vetId, date) => {
    const res = await api.get(ENDPOINTS.SLOTS.AVAILABLE(vetId, date));
    return res.data?.data ?? res.data;
  },
};

