import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import GlassCard from "../components/common/GlassCard";
import AiInsightCard from "../components/common/AiInsightCard";

import { petsApi } from "../api/modules/pets.api";
import { appointmentsApi } from "../api/modules/appointments.api";
import ChatWidget from "../features/chatbot/components/ChatWidget";


import "../styles/user-dashboard.css";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function UserDashboard() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [appts, setAppts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load real data
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [petsData, apptsData] = await Promise.all([
          petsApi.getMyPets(),
          appointmentsApi.my(), // expects /appointments/my
        ]);

        if (!alive) return;

        setPets(Array.isArray(petsData) ? petsData : []);
        setAppts(Array.isArray(apptsData) ? apptsData : []);
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Helpers to safely extract appointment date/time even if backend field names differ
  const getApptStart = (a) =>
    a?.slotStartTime ||
    a?.startTime ||
    a?.slot_start_time ||
    a?.start_time ||
    null;

  const getApptEnd = (a) =>
    a?.slotEndTime ||
    a?.endTime ||
    a?.slot_end_time ||
    a?.end_time ||
    null;

  const getApptDate = (a) =>
    a?.slotDate || a?.date || a?.slot_date || a?.appointmentDate || null;

  const getApptStatus = (a) => (a?.status || "").toUpperCase();

  const nowMs = Date.now();

  // Upcoming appointments (real)
  const upcoming = useMemo(() => {
    const list = (appts || [])
      .map((a) => {
        const d = getApptDate(a);
        const st = getApptStart(a);
        const ms = d
          ? new Date(`${d}T${st || "00:00:00"}`).getTime()
          : Number.POSITIVE_INFINITY;
        return { raw: a, ms };
      })
      .filter((x) => Number.isFinite(x.ms))
      .filter((x) => x.ms >= nowMs)
      .sort((x, y) => x.ms - y.ms);

    return list.map((x) => x.raw);
  }, [appts]);

  const nextAppt = upcoming[0] || null;

  // Simple real insights (rule-based, but based on your actual data)
  const insights = useMemo(() => {
    const totalPets = pets.length;
    const totalAppts = appts.length;

    const booked = appts.filter((a) => getApptStatus(a) === "BOOKED").length;
    const completed = appts.filter((a) => getApptStatus(a) === "COMPLETED").length;
    const cancelled = appts.filter((a) => getApptStatus(a) === "CANCELLED").length;

    const points = [];
    if (totalPets === 0) points.push("No pets added yet — add your first pet to start tracking health.");
    else points.push(`${totalPets} pet(s) in your care profile.`);

    points.push(`${booked} upcoming booking(s) • ${completed} completed • ${cancelled} cancelled.`);

    const suggestion =
      booked === 0
        ? "No upcoming appointment found — consider booking a wellness visit."
        : "You're all set — review your visit history and keep records updated.";

    const greeting =
      booked > 0
        ? "You’re on track ✅"
        : "Let’s plan your next visit 🐾";

    return { greeting, points, suggestion };
  }, [pets, appts]);

  // Recent activity list (latest appointments by created/updated fields if present; else by id)
  const recent = useMemo(() => {
    const list = [...(appts || [])];

    list.sort((a, b) => {
      const da =
        new Date(a?.updatedAt || a?.updated_at || a?.createdAt || a?.created_at || 0).getTime() || 0;
      const db =
        new Date(b?.updatedAt || b?.updated_at || b?.createdAt || b?.created_at || 0).getTime() || 0;

      if (db !== da) return db - da;
      return (b?.appointmentId ?? 0) - (a?.appointmentId ?? 0);
    });

    return list.slice(0, 6);
  }, [appts]);

  // Quick derived labels
  const nextLabel = useMemo(() => {
    if (!nextAppt) return null;
    const d = getApptDate(nextAppt);
    const st = getApptStart(nextAppt);
    const en = getApptEnd(nextAppt);

    const dt = d ? new Date(`${d}T${st || "00:00:00"}`) : null;
    const pretty = dt
      ? dt.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
      : "—";

    return `${pretty}${en ? ` • ${st}-${en}` : ""}`;
  }, [nextAppt]);

  return (
    <>
    <div className="udash-page">
      <div className="container py-4">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="udash-hero">
          <GlassCard hover={false}>
            <div className="udash-hero-inner">
              <div>
                <div className="udash-kicker">Dashboard</div>
                <h2 className="udash-title">Welcome back 🐾</h2>
                <div className="udash-sub">
                  Quick overview + actions — no clutter, all signal.
                </div>
              </div>

              <div className="udash-hero-actions">
                <button
                  className="btn btn-gradient"
                  onClick={() => navigate("/app/book-appointment")}
                  disabled={loading}
                >
                  ➕ Book Appointment
                </button>

                <button
                  className="btn btn-outline-modern"
                  onClick={() => navigate("/app/pets")}
                  disabled={loading}
                >
                  🐶 Manage Pets
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {err && (
          <div className="alert alert-danger mt-3">
            {err}
          </div>
        )}

        {loading && (
          <div className="udash-loading mt-3">Loading your dashboard…</div>
        )}

        {/* Main grid */}
        {!loading && !err && (
          <>
            <div className="row g-3 mt-2">
              {/* AI Insight (real based) */}
              <div className="col-lg-6">
                <AiInsightCard
                  greeting={insights.greeting}
                  points={insights.points}
                  suggestion={insights.suggestion}
                />
              </div>

              {/* Next appointment */}
              <div className="col-lg-6">
                <GlassCard hover>
                  <div className="udash-card-head">
                    <h5 className="udash-card-title">📅 Next Appointment</h5>
                    <span className={`udash-pill ${nextAppt ? "ok" : "warn"}`}>
                      {nextAppt ? "Scheduled" : "None"}
                    </span>
                  </div>

                  {nextAppt ? (
                    <div className="udash-next">
                      <div className="udash-next-main">
                        <div className="udash-next-when">{nextLabel}</div>
                        <div className="udash-next-meta">
                          Appointment ID: <span className="mono">{nextAppt.appointmentId ?? nextAppt.id ?? "—"}</span>
                        </div>
                        <div className="udash-next-meta">
                          Status: <span className="status booked">{(nextAppt.status || "BOOKED")}</span>
                        </div>
                      </div>

                      <div className="udash-next-actions">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate("/app/pets-appointments")}
                        >
                          View My Appointments →
                        </button>

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => navigate("/app/health-records")}
                        >
                          Health Records →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="udash-empty">
                      <div className="udash-empty-title">No upcoming appointment</div>
                      <div className="udash-empty-sub">Book a slot in 30 seconds.</div>
                      <button
                        className="btn btn-gradient mt-2"
                        onClick={() => navigate("/app/book-appointment")}
                      >
                        Book Now
                      </button>
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="udash-section mt-4">
              <h4 className="udash-section-title">⚡ Quick Actions</h4>

              <div className="udash-actions-grid">
                {[
                  { label: "Book Appointment", icon: "📅", path: "/app/book-appointment" },
                  { label: "Find Vets", icon: "👨‍⚕️", path: "/app/vets" },
                  { label: "My Appointments", icon: "🗓️", path: "/app/pets-appointments" },
                  { label: "Support Chat", icon: "💬", path: "/app/support" },
                ].map((x) => (
                  <button
                    key={x.label}
                    className="udash-action"
                    onClick={() => navigate(x.path)}
                    type="button"
                  >
                    <div className="udash-action-ico">{x.icon}</div>
                    <div className="udash-action-label">{x.label}</div>
                    <div className="udash-action-go">Open →</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent activity (real from appointments) */}
            <div className="udash-section mt-4">
              <div className="udash-section-head">
                <h4 className="udash-section-title">🧾 Recent Activity</h4>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/app/pets-appointments")}
                >
                  View All →
                </button>
              </div>

              {recent.length === 0 ? (
                <div className="udash-empty small">
                  No activity yet — your bookings will appear here.
                </div>
              ) : (
                <div className="udash-activity">
                  {recent.map((a) => {
                    const d = getApptDate(a);
                    const st = getApptStart(a);
                    const en = getApptEnd(a);
                    const when = d ? `${d} ${st || ""}${en ? `-${en}` : ""}` : "—";
                    const status = (a.status || "BOOKED").toLowerCase();

                    return (
                      <div key={a.appointmentId ?? a.id} className="udash-activity-row">
                        <div className="mono">#{a.appointmentId ?? a.id}</div>
                        <div className="udash-activity-when">{when}</div>
                        <div className={`status ${status}`}>{a.status || "BOOKED"}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
    </div>
    <ChatWidget />
    </>
  );
}
