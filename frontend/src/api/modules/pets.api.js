import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export const petsApi = {
  getMyPets: async () => {
    const res = await api.get(ENDPOINTS.PETS.MY);
    return res.data?.data ?? res.data;
  },

  getPetById: async (petId) => {
    const res = await api.get(ENDPOINTS.PETS.BY_ID(petId));
    return res.data?.data ?? res.data;
  },

  createPet: async (payload) => {
    const res = await api.post(ENDPOINTS.PETS.CREATE, payload);
    return res.data?.data ?? res.data;
  },



  deletePet: async (petId) => {
    const res = await api.delete(`/pets/${petId}`);
    return res.data;
  },


};
