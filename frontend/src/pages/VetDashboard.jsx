// src/pages/VetDashboard.jsx// src/pages/VetDashboard";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { useAuth } from "../auth/AuthContext";
import { vetsApi } from "../api/modules/vets.api";
import { appointmentsApi } from "../api/modules/appointments.api";

import {
  FaUserMd,
  FaCalendarCheck,
  FaClock,
  FaStethoscope,
  FaListAlt,
  FaSyncAlt,
} from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export default function VetDashboard() {
  const { user } = useAuth();

  const [vetId, setVetId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const todayISO = new Date().toISOString().slice(0, 10);

  const getDate = (a) =>
    a?.slotDate ?? a?.date ?? a?.slot_date ?? a?.appointmentDate ?? null;

  const getStart = (a) =>
    a?.slotStartTime ??
    a?.startTime ??
    a?.time ??
    a?.slot_start_time ??
    a?.slotStart ??
    null;

  const getStatus = (a) => (a?.status || "BOOKED").toUpperCase();

  const asDateTime = (a) => {
    const d = getDate(a);
    const t = getStart(a);
    if (!d) return null;
    // if time missing, treat it as start of day (still sortable)
    const iso = `${d}T${t || "00:00:00"}`;
    const dt = new Date(iso);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      // ✅ map logged-in user -> vetId
      const myVetId = await vetsApi.getMyVetId();
      setVetId(myVetId);

      // ✅ load vet appointments
      const data = await appointmentsApi.doctorAppointments(myVetId);
      const list = Array.isArray(data) ? data : [];
      setAppointments(list);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load vet dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => getDate(a) === todayISO);
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .map((a) => ({ a, dt: asDateTime(a) }))
      .filter((x) => x.dt && x.dt > now)
      .filter((x) => ["BOOKED", "IN_PROGRESS"].includes(getStatus(x.a)))
      .sort((x, y) => x.dt - y.dt)[0]?.a ?? null;
  }, [appointments]);

  const totalCount = appointments.length;

  const completedCount = useMemo(
    () => appointments.filter((a) => getStatus(a) === "COMPLETED").length,
    [appointments]
  );

  const bookedCount = useMemo(
    () => appointments.filter((a) => getStatus(a) === "BOOKED").length,
    [appointments]
  );

  return (
    <div className="container py-4">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-4">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-1">👨‍⚕️ Vet Dashboard</h2>
            <div className="text-muted">
              Welcome back, <span className="fw-bold text-primary">{user?.name || "Doctor"}</span>
              {vetId ? <span className="ms-2 badge bg-light text-dark">Vet ID: {vetId}</span> : null}
            </div>
          </div>

          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={load}
            disabled={loading}
            type="button"
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>
      </motion.div>

      {err && <div className="alert alert-danger">{err}</div>}

      {/* Stats cards */}
      <div className="row g-3 mb-4">
        <StatCard
          icon={<FaCalendarCheck />}
          title="Today's Appointments"
          value={todayAppointments.length}
          sub={`Booked: ${todayAppointments.filter((a) => getStatus(a) === "BOOKED").length}`}
          loading={loading}
        />

        <StatCard
          icon={<FaClock />}
          title="Next Appointment"
          value={
            nextAppointment
              ? `${getDate(nextAppointment) || "—"} ${getStart(nextAppointment) || ""}`.trim()
              : "None"
          }
          sub={nextAppointment ? `Status: ${getStatus(nextAppointment)}` : "No upcoming booking"}
          loading={loading}
        />

        <StatCard
          icon={<FaListAlt />}
          title="All Appointments"
          value={totalCount}
          sub={`Booked: ${bookedCount} • Completed: ${completedCount}`}
          loading={loading}
        />
      </div>

      {/* Main grid */}
      <div className="row g-3">
        {/* Today list */}
        <div className="col-md-7">
          <Card title="📅 Today's Patients">
            {loading ? (
              <div className="text-muted">Loading today’s queue…</div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-muted">No patients scheduled for today.</div>
            ) : (
              todayAppointments
                .map((a) => ({
                  a,
                  dt: asDateTime(a),
                }))
                .sort((x, y) => (x.dt && y.dt ? x.dt - y.dt : 0))
                .map(({ a }) => {
                  const apptId = a?.appointmentId ?? a?.id;
                  const petId = a?.petId ?? a?.pet_id;
                  const petName = a?.petName ?? a?.pet_name;

                  return (
                    <div
                      key={apptId}
                      className="border-top py-2 d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-bold">
                          {petName ? `${petName}` : `Pet ID: ${petId ?? "—"}`}
                        </div>
                        <div className="small text-muted">
                          Appointment #{apptId ?? "—"} • {getDate(a) || "—"} {getStart(a) || ""}
                        </div>
                        <span className="badge bg-light text-dark mt-1">
                          {getStatus(a)}
                        </span>
                      </div>

                      <Link to="/vet/visit" className="btn btn-sm btn-outline-primary">
                        Start / Add Notes
                      </Link>
                    </div>
                  );
                })
            )}
          </Card>
        </div>

        {/* Quick actions */}
        <div className="col-md-5">
          <Card title="⚡ Quick Actions">
            <ActionBtn icon={<FaUserMd />} text="My Profile" link="/vet/profile" />
            <ActionBtn icon={<FaClock />} text="Working Hours" link="/vet/working-hours" />
            <ActionBtn icon={<FaClock />} text="Breaks" link="/vet/breaks" />
            <ActionBtn icon={<FaStethoscope />} text="Add Visit / Prescription" link="/vet/visit" />
          </Card>
        </div>
      </div>
    </div>
  );
}

/* UI helpers (pure UI, no API) */

function StatCard({ icon, title, value, sub, loading }) {
  return (
    <div className="col-md-4">
      <div className="p-3 shadow-sm rounded bg-white text-center h-100">
        <div className="fs-3 text-primary mb-2">{icon}</div>
        <div className="fw-bold">{title}</div>
        <div className="fs-5">{loading ? "…" : value}</div>
        <div className="small text-muted mt-1">{loading ? "" : sub}</div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 bg-white shadow-sm rounded h-100"
    >
      <h5 className="mb-3">{title}</h5>
      {children}
    </motion.div>
  );
}

function ActionBtn({ icon, text, link }) {
  return (
    <Link to={link} className="d-flex align-items-center gap-2 mb-2 btn btn-outline-primary w-100">
      {icon} {text}
    </Link>
  );
}
