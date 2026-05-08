import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";

export const dashboardApi = {
  myPets: () => api.get(ENDPOINTS.USER.PETS_MY),
  myAppointments: () => api.get(ENDPOINTS.USER.APPOINTMENTS_MY),
  myVisits: () => api.get(ENDPOINTS.USER.VISITS_MY),
};

// Normalize common backend shapes to array
export const toArray = (res) => {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.content)) return data.content; // spring pageable
  return [];
};