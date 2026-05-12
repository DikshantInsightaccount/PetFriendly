import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

export default function PetAppointments() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("You are not authenticated.");
      return;
    }

    const loadAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(ENDPOINTS.APPOINTMENTS.MY);

        const data = res.data?.data ?? res.data;

        // ✅ Show only non-completed appointments
        const upcomingAppointments = Array.isArray(data)
          ? data.filter(
              (apt) =>
                apt.status &&
                apt.status.toUpperCase() !== "COMPLETED"
            )
          : [];

        setAppointments(upcomingAppointments);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [user]);

  const formatDateTime = (value) => {
    if (!value) return "Date TBD";
    try {
      const date = new Date(value);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Date TBD";
    }
  };

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/app/pets")}
      >
        ← Back to Pets
      </button>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="fw-bold mb-1">
            Your Scheduled Appointments
          </h2>
          <div className="text-muted mb-4">
            View and manage your upcoming appointments.
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {loading && (
            <div className="text-muted">
              Loading appointments…
            </div>
          )}

          {!loading && !error && (
            <>
              {appointments.length === 0 ? (
                <div className="text-muted">
                  No scheduled appointments at this time.
                </div>
              ) : (
                <div className="row g-3">
                  {appointments.map((apt, index) => (
                    <div
                      key={apt.appointment_id ?? apt.id ?? index}
                      className="col-md-6"
                    >
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <div>
                              <h5 className="fw-bold mb-1">
                                Appointment #
                                {apt.appointment_id ?? apt.id}
                              </h5>
                              <span
                                className={`badge ${
                                  apt.status?.toUpperCase() ===
                                  "CONFIRMED"
                                    ? "bg-success"
                                    : "bg-info"
                                }`}
                              >
                                {apt.status ?? "PENDING"}
                              </span>
                            </div>
                          </div>

                          <div className="row g-3 mt-2">
                            <div className="col-6">
                              <div className="text-uppercase text-muted small">
                                Date & Time
                              </div>
                              <div className="fw-semibold">
                                {formatDateTime(
                                  apt.appointment_date ??
                                    apt.appointmentDate
                                )}
                              </div>
                            </div>

                            <div className="col-6">
                              <div className="text-uppercase text-muted small">
                                Pet
                              </div>
                              <div>
                                {apt.petName ??
                                  apt.pet_id ??
                                  "—"}
                              </div>
                            </div>

                            <div className="col-6">
                              <div className="text-uppercase text-muted small">
                                Vet
                              </div>
                              <div>
                                {apt.vetName ??
                                  apt.vet_id ??
                                  "—"}
                              </div>
                            </div>

                            <div className="col-6">
                              <div className="text-uppercase text-muted small">
                                Mode
                              </div>
                              <div>
                                {apt.appointment_mode ??
                                  apt.mode ??
                                  "—"}
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="text-uppercase text-muted small">
                                Type
                              </div>
                              <div>
                                {apt.appointment_type ??
                                  apt.type ??
                                  "General Checkup"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}