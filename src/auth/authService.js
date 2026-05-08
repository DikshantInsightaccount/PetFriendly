import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const authService = {
  login: async (payload) => (await api.post(ENDPOINTS.AUTH.LOGIN, payload)).data,
  register: async (payload) => (await api.post(ENDPOINTS.AUTH.REGISTER, payload)).data,
  me: async () => (await api.get(ENDPOINTS.AUTH.ME)).data,
  logout: async () => (await api.post(ENDPOINTS.AUTH.LOGOUT)).data,
};