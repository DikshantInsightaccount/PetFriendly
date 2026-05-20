import React, { useEffect, useState } from "react";
import { getMyVetAppointments } from "../../vets/vetsApi";
import AppointmentCard from "../../appointments/components/AppointmentCard";

export default function VetAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyVetAppointments();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load vet appointments"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="glass" style={{ padding: "2.5rem", width: "100%", maxWidth: 900 }}>
        <h3>Loading appointments…</h3>
      </div>
    );
  }

  if (err) {
    return (
      <div className="glass" style={{ padding: "2.5rem", width: "100%", maxWidth: 900, color: "crimson" }}>
        {err}
      </div>
    );
  }

  return (
    <div className="glass" style={{ width: "100%", maxWidth: 900, padding: "2.5rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>My Appointments</h2>

      {appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt.appointmentId}
              appointment={appt}
              className="card-lift"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="glass"
      style={{
        padding: "3rem",
        textAlign: "center",
      }}
    >
      <h3>🐾 No appointments yet</h3>

      <p style={{ marginTop: "0.75rem", color: "var(--muted)" }}>
        You don’t have any past or upcoming appointments.
      </p>

      <p style={{ marginTop: "1rem", fontSize: "0.95rem" }}>
        When pet owners book slots with you, they’ll appear here automatically.
      </p>
    </div>
  );
}