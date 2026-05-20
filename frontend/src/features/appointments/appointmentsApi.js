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
};
``