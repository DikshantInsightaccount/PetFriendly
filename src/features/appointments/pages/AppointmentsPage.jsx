import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAppointments } from "../appointmentsApi";
import AppointmentCard from "../components/AppointmentCard";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const res = await fetchAppointments();
        setAppointments(res.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    loadAppointments();
  }, []);

  return (
    <div>

      {/* ✅ HEADER + BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Appointments</h2>

        <button
          className="btn btn-gradient"
          onClick={() => navigate("/app/appointments/book")}
        >
          + Book Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appt) => (
          <AppointmentCard
            key={appt.appointment_id ?? appt.appointmentId}
            appointment={appt}
          />
        ))
      )}
    </div>
  );
}