// src/features/appointments/appointmentsApi.js
import { api } from "../../api/axios";

// OWNER appointments
export const getAppointments = async () => {
  const res = await api.get("/appointments");
  return res.data?.data ?? res.data;
};

// VET appointments (logged-in vet)
export const getMyVetAppointments = async () => {
  const res = await api.get("/appointments/my");
  return res.data?.data ?? res.data;
};