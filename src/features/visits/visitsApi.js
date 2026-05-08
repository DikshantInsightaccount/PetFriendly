import axios from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";

// ✅ Create Visit (requires appointment_id)
export const createVisit = (payload) => {
  return axios.post(ENDPOINTS.USER.VISITS, payload);
};

// ✅ Fetch visits of logged user
export const fetchVisits = () => {
  return axios.get(ENDPOINTS.USER.VISITS_MY);
};