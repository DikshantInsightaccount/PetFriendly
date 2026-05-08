import BookingWizard from "../../../components/booking/BookingWizard";

import {
  fetchAppointmentTypes,
  fetchVets,
  fetchMyPets,
  fetchAvailableSlots,
  createAppointment,
} from "../appointmentsApi";

export default function BookAppointmentPage() {
  return (
    <BookingWizard
      kind="APPOINTMENT"
      title="Book Appointment"
      loadData={async () => {
        const [typesRes, vetsRes, petsRes] = await Promise.all([
          fetchAppointmentTypes(),
          fetchVets(),
          fetchMyPets(),
        ]);

        return {
          appointmentTypes: typesRes.data || [],
          vets: vetsRes.data || [],
          pets: petsRes.data || [],
        };
      }}
      loadSlots={async (vetId, date) => {
        const res = await fetchAvailableSlots(vetId, date);
        return res.data || [];
      }}
      onConfirm={async ({ appointmentPayload }) => {
        const res = await createAppointment(appointmentPayload);

        return {
          appointmentId: res.data?.appointment_id ?? res.data?.appointmentId,
        };
      }}
    />
  );
}