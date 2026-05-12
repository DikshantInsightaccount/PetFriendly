import React, { useEffect, useState } from "react";
import "../styles/home.css";

import { getMyVetAppointments } from "../features/appointments/appointmentsApi";
import AppointmentCard from "../components/AppointmentCard";

export default function VetAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyVetAppointments();
      setAppointments(data);
    } catch (e) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium">
            <h2 className="fw-bold mb-3">My Appointments</h2>
            <p className="text-muted mb-4">
              View your upcoming and past appointments.
            </p>

            {loading && <div>Loading appointments...</div>}

            {error && <div className="vet-error">{error}</div>}

            {!loading && !error && appointments.length === 0 && (
              <div>No appointments found.</div>
            )}

            {!loading && !error && appointments.length > 0 && (
              <div className="vet-appointment-list">
                {appointments.map((appt) => (
                  <AppointmentCard
                    key={appt.appointmentId || appt.id}
                    appointment={appt}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
