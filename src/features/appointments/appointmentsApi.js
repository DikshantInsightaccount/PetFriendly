import { appointmentsMock } from "./mock/appointments.mock";

export const getAppointments = () => {
  return Promise.resolve(appointmentsMock);
};

export const bookAppointment = (data) => {
  console.log("Booking appointment (mock):", data);
  return Promise.resolve({ success: true });
};
