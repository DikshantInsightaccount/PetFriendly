// src/api/modules/pets.api.js
import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const petsApi = {
  getMyPets: async () => {
    const res = await api.get(ENDPOINTS.PETS.MY);

    // supports both wrapped & raw responses
    return res.data?.data ?? res.data;
  },

  createPet: async (payload) => {
    if (!payload) {
      throw new Error("Pet payload is required");
    }

    const res = await api.post(ENDPOINTS.PETS.CREATE, payload);
    return res.data?.data ?? res.data;
  },
};
