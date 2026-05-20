import { useEffect, useState } from "react";
import { FaUserMd, FaCalendarCheck, FaClock } from "react-icons/fa";
import AdminStatsCards from "../../features/admin/components/AdminStatsCards";
import { adminApi } from "../../features/admin/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVets: 0,
    totalAdmins: 0,
    totalAppointments: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [err, setErr] = useState("");

  /* ---------------- LOAD STATS ---------------- */
  async function loadStats() {
    setErr("");
    try {
      const [users, appts] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllAppointmentsAdmin().catch(() => []),
      ]);

      const totalUsers = users.length;
      const totalVets = users.filter((u) => String(u.role) === "VET").length;
      const totalAdmins = users.filter((u) => String(u.role) === "ADMIN").length;
      const totalAppointments = appts.length;

      setStats({ totalUsers, totalVets, totalAdmins, totalAppointments });
    } catch (e) {
      setErr(e?.message || "Failed to load dashboard stats");
    }
  }

  /* ---------------- LOAD APPOINTMENTS ---------------- */
  async function loadAppointments() {
    setShowAppointments(true);
    setLoadingAppointments(true);

    try {
      const data = await adminApi.getAllAppointmentsAdmin();
      setAppointments(data);
    } catch {
      setErr("Failed to load appointments");
    } finally {
      setLoadingAppointments(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div>
      <h2 className="fw-bold mb-3">🐾 Admin Dashboard</h2>

      {err && <div className="alert alert-danger">{err}</div>}

      {/* STATS ALWAYS VISIBLE */}
      <AdminStatsCards stats={stats} />

      {/* DASHBOARD CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <FaUserMd size={36} className="mb-3 text-primary" />
              <h5 className="fw-semibold">Vet Management</h5>
              <p className="text-muted mb-0">
                Create vets & manage vet details
              </p>
            </div>
          </div>
        </div>

        {/* ALL APPOINTMENTS — CLICK = INLINE VIEW */}
        <div className="col-md-4">
          <div
            className="card h-100 shadow-sm cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={loadAppointments}
          >
            <div className="card-body text-center">
              <FaCalendarCheck size={36} className="mb-3 text-success" />
              <h5 className="fw-semibold">All Appointments</h5>
              <p className="text-muted mb-0">
                View all appointments (ADMIN)
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <FaClock size={36} className="mb-3 text-warning" />
              <h5 className="fw-semibold">Add Working Hours</h5>
              <p className="text-muted mb-0">
                Create slots for vets (ADMIN)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* INLINE APPOINTMENTS TABLE */}
      {showAppointments && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="fw-bold mb-3">📋 All Appointments</h4>

            {loadingAppointments && <div>Loading…</div>}

            {!loadingAppointments && appointments.length === 0 && (
              <div className="text-muted">No appointments found.</div>
            )}

            {!loadingAppointments && appointments.length > 0 && (
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Pet ID</th>
                    <th>Vet ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.appointmentId}>
                      <td>{a.appointmentId}</td>
                      <td>{a.petId}</td>
                      <td>{a.vetId}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <div className="mt-3">
        <button className="btn btn-outline-primary btn-sm" onClick={loadStats}>
          Refresh Stats
        </button>
      </div>
    </div>
  );
}