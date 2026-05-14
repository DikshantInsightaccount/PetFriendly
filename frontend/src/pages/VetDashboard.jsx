import "../styles/home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext";
// import VetNavbar from "../features/vets/components/VetNavbar";

import {
  FaUserCircle,
  FaCalendarCheck,
  FaClock,
  FaPlaneDeparture,
  FaCoffee,
} from "react-icons/fa";

export default function VetDashboard() {
  const { user } = useAuth();
  const [todayCount, setTodayCount] = useState(0);
  const [nextAppointment, setNextAppointment] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/appointments/my");
      const appointments = res.data?.data || [];

      const today = new Date().toISOString().split("T")[0];

      const todayAppointments = appointments.filter(
        (a) => a.date === today
      );

      const upcoming = appointments
        .filter((a) => new Date(`${a.date}T${a.time}`) > new Date())
        .sort(
          (a, b) =>
            new Date(`${a.date}T${a.time}`) -
            new Date(`${b.date}T${b.time}`)
        )[0];

      setTodayCount(todayAppointments.length);
      setNextAppointment(upcoming ? `${upcoming.date}T${upcoming.time}` : null);
    } catch (e) {
      console.error("Failed to load vet stats", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-6">
      {/* NAVBAR */}
      {/* <VetNavbar
        todayCount={todayCount}
        nextAppointment={nextAppointment}
      /> */}

      {/* ===== HERO ===== */}
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="hero-title">🐾 Vet Dashboard</h1>
          <p className="hero-subtitle">
            Welcome back,{" "}
            <span style={{ color: "#2563eb" }}>
              {user?.name || "Doctor"}
            </span>
          </p>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center"
          style={{ maxWidth: 1100, margin: "0 auto", display: "grid" }}
        >
          <Link to="/vet/profile" className="feature-card inline-block">
            <FaUserCircle size={36} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold">My Profile</h3>
            <p>Update email, phone & address</p>
          </Link>

          <Link to="/vet/appointments" className="feature-card inline-block">
            <FaCalendarCheck size={36} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold">My Appointments</h3>
            <p>View upcoming and past bookings</p>
          </Link>

          <div className="feature-card inline-block">
            <FaClock size={36} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold">My Schedule</h3>
            <p>View your assigned working hours & breaks</p>

            <div className="d-flex gap-2 justify-content-center mt-3">
              <Link to="/vet/working-hours" className="btn btn-sm btn-outline-primary">
                View Working Hours
              </Link>

              <Link to="/vet/breaks" className="btn btn-sm btn-outline-secondary">
                View Breaks
              </Link>
            </div>
          </div>
          ``

          {/* <Link to="/vet/leaves" className="feature-card inline-block">
            <FaPlaneDeparture size={36} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold">Leaves</h3>
            <p>Apply & track leave dates</p>
          </Link> */}

          <Link to="/app/visit" className="feature-card inline-block">
            <FaPlaneDeparture size={36} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold">Visits</h3>
            <p>Add the visits</p>
          </Link>

        </div>
      </section>
    </div>
  );
}