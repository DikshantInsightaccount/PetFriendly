import React from "react";
import Button from "../../../components/common/Button";
import { bookAppointment } from "../appointmentsApi";

export default function AppointmentForm() {
  const handleSubmit = () => {
    bookAppointment({ random: true });
  };

  return (
    <div>
      <p>Appointment form (mock)</p>
      <Button onClick={handleSubmit}>Book</Button>
    </div>
  );
}
