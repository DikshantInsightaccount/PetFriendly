import BookingWizard from "../../../components/booking/BookingWizard";
import {
  fetchAppointmentTypes,
  fetchVets,
  fetchMyPets,
  fetchAvailableSlots,
  createAppointment,
} from "../../appointments/appointmentsApi";
import { createVisit } from "../visitsApi";

export default function BookVisitPage() {
  return (
    <BookingWizard
      kind="VISIT"
      title="Book Visit"
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
      onConfirm={async ({ appointmentPayload, notes }) => {
        // ✅ 1) Create Appointment first (schema requires appointment for visit)
        const apptRes = await createAppointment(appointmentPayload);
        const appointmentId = apptRes.data?.appointment_id ?? apptRes.data?.appointmentId;

        // ✅ 2) Create Visit referencing appointment_id
        const visitPayload = {
          appointmentId: Number(appointmentId),
          diagnosis: "",
          treatment: "",
          prescription: "",
          notes: notes || "",
        };

        const visitRes = await createVisit(visitPayload);
        const visitId = visitRes.data?.visit_id ?? visitRes.data?.visitId;

        return { appointmentId, visitId };
      }}
    />
  );
}