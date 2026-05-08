import React, { useEffect, useState } from "react";
import { getAppointments } from "../appointmentsApi";
import AppointmentCard from "../components/AppointmentCard";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointments().then(setAppointments);
  }, []);

  return (
    <div>
      <h2>My Appointments</h2>
      {appointments.map((appt) => (
        <AppointmentCard key={appt.appointmentId} appointment={appt} />
      ))}
    </div>
  );
}
