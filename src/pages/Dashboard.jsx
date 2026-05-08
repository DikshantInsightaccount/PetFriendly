import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPaw,
  FaUserMd,
  FaCalendarCheck,
  FaNotesMedical,
  FaPlus,
} from "react-icons/fa";

import "../styles/dashboard.css";
import { dashboardApi, toArray } from "../features/dashboard/dashboardApi";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const [petsRes, apptRes, visitRes] = await Promise.all([
          dashboardApi.myPets(),
          dashboardApi.myAppointments(),
          dashboardApi.myVisits(),
        ]);

        if (!mounted) return;

        setPets(toArray(petsRes));
        setAppointments(toArray(apptRes));
        setVisits(toArray(visitRes));
      } catch (e) {
        console.error("Dashboard load failed:", e);
        if (mounted) setError("Unable to load dashboard stats. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Optional: “Upcoming” (BOOKED only) — supports both `status` styles
  const upcomingAppointments = useMemo(() => {
    const arr = appointments || [];
    return arr
      .filter((a) => (a.status ?? a.appointmentStatus ?? "").toString().toUpperCase() === "BOOKED")
      .slice(0, 5);
  }, [appointments]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome to PetClinic 🐾</h2>
        <p>Manage everything in one place</p>
      </div>

      {/* Error */}
      {error ? <div className="dash-error">{error}</div> : null}

      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard
          title="My Pets"
          value={loading ? "—" : pets.length}
          icon={<FaPaw />}
          hint="Total pets registered"
          onClick={() => navigate("/app/pets")}
        />
        <StatCard
          title="Appointments"
          value={loading ? "—" : appointments.length}
          icon={<FaCalendarCheck />}
          hint="All appointments"
          onClick={() => navigate("/app/appointments")}
        />
        <StatCard
          title="Visits"
          value={loading ? "—" : visits.length}
          icon={<FaNotesMedical />}
          hint="Medical visits recorded"
          onClick={() => navigate("/app/visits")}
        />
      </div>

      {/* Main navigation cards */}
      <div className="dashboard-grid">
        <DashboardCard
          icon={<FaPaw />}
          title="Pets"
          desc="Manage pets and owners"
          onClick={() => navigate("/app/pets")}
        />

        <DashboardCard
          icon={<FaUserMd />}
          title="Vets"
          desc="View veterinarians"
          onClick={() => navigate("/app/vets")}
        />

        <DashboardCard
          icon={<FaCalendarCheck />}
          title="Appointments"
          desc="View and manage bookings"
          onClick={() => navigate("/app/appointments")}
        />

        <DashboardCard
          icon={<FaNotesMedical />}
          title="Visits"
          desc="View medical visits"
          onClick={() => navigate("/app/visits")}
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button
            className="btn btn-gradient"
            onClick={() => navigate("/app/appointments/book")}
            disabled={loading}
          >
            <FaPlus /> Book Appointment
          </button>

          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/app/visits/book")}
            disabled={loading}
          >
            <FaPlus /> Book Visit
          </button>
        </div>
      </div>

      {/* Optional: Upcoming widget */}
      <div className="dash-widget">
        <div className="dash-widget-head">
          <h4 className="m-0">Upcoming Appointments</h4>
          <button
            className="dash-link"
            onClick={() => navigate("/app/appointments")}
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div className="dash-skeleton">Loading upcoming appointments…</div>
        ) : upcomingAppointments.length === 0 ? (
          <div className="dash-muted">No upcoming appointments.</div>
        ) : (
          <div className="dash-list">
            {upcomingAppointments.map((a) => (
              <div
                key={a.appointment_id ?? a.appointmentId}
                className="dash-list-item"
              >
                <div className="dash-li-title">
                  {a.petName ?? a.pet?.name ?? "Pet"} •{" "}
                  {a.vetName ?? a.vet?.name ?? "Vet"}
                </div>
                <div className="dash-li-sub">
                  {a.slotDate ?? a.date ?? a.slot_date ?? "Date"}{" "}
                  {a.startTime ?? a.start_time ?? ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, hint, onClick }) {
  return (
    <div className="stat-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-meta">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-hint">{hint}</div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, desc, onClick }) {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <h5>{title}</h5>
      <p>{desc}</p>
    </div>
  );
}