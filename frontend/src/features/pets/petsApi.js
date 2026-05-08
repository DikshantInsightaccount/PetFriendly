import { api } from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";

export const petsApi = {
  getMyPets: async () => {
    const res = await api.get(ENDPOINTS.PETS.MY);
    return res.data;
  },

  createPet: async (payload) => {
    const res = await api.post(ENDPOINTS.PETS.CREATE, payload);
    return res.data;
  },
};