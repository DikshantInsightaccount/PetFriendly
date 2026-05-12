// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [err, setErr] = useState("");

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

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div>
      <h2 className="fw-bold mb-3">🐾 Admin Dashboard</h2>

      {err && <div className="alert alert-danger">{err}</div>}

      <AdminStatsCards stats={stats} />

      <div className="row g-3">
        <div className="col-md-4">
          <Link to="/admin/vets" className="text-decoration-none">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <FaUserMd size={36} className="mb-3 text-primary" />
                <h5 className="fw-semibold">Vet Management</h5>
                <p className="text-muted mb-0">Create vets + link Vet profile</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/admin/appointments" className="text-decoration-none">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <FaCalendarCheck size={36} className="mb-3 text-success" />
                <h5 className="fw-semibold">All Appointments</h5>
                <p className="text-muted mb-0">View & cancel appointments</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/admin/slots" className="text-decoration-none">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <FaClock size={36} className="mb-3 text-warning" />
                <h5 className="fw-semibold">Generate Slots</h5>
                <p className="text-muted mb-0">Create slots for vets</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-3">
        <button className="btn btn-outline-primary btn-sm" onClick={loadStats}>
          Refresh Stats
        </button>
      </div>
    </div>
  );
}
