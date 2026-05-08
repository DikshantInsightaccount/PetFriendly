import axios from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";

// ✅ Appointment Types
export const fetchAppointmentTypes = () =>
  axios.get(ENDPOINTS.USER.APPOINTMENT_TYPES);

// ✅ Vets list
export const fetchVets = () =>
  axios.get(ENDPOINTS.USER.VETS);

// ✅ My pets
export const fetchMyPets = () =>
  axios.get(ENDPOINTS.USER.PETS_MY);

// ✅ Available slots
export const fetchAvailableSlots = (vetId, slotDate) =>
  axios.get(ENDPOINTS.USER.DOCTOR_SLOTS, {
    params: {
      v: vetId,
      date: slotDate,
      available: true,
    },
  });

// ✅ Create appointment (IMPORTANT: schema aligned)
export const createAppointment = (payload) =>
  axios.post(ENDPOINTS.USER.APPOINTMENTS, payload);

// ✅ Fetch my appointments
export const fetchAppointments = () =>
  axios.get(ENDPOINTS.USER.APPOINTMENTS_MY);
``