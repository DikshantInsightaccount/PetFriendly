// src/pages/VetDashboard.jsx
import "../styles/home.css";
import { Link } from "react-router-dom";
import { FaUserCircle, FaCalendarCheck, FaClock, FaCoffee, FaPlaneDeparture } from "react-icons/fa";

export default function VetDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex justify-center px-6 py-10">
      <div className="w-full max-w-6xl">
        <section className="hero-section text-center">
          <div className="container">
            <h1 className="hero-title">🐾 Vet Dashboard</h1>
            <p className="hero-subtitle">Everything you need — profile, schedule, breaks & leaves.</p>
          </div>
        </section>

        <section className="features-section">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center" style={{ display: "grid" }}>
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

              <Link to="/vet/working-hours" className="feature-card inline-block">
                <FaClock size={36} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold">Working Hours</h3>
                <p>Set weekly availability</p>
              </Link>

              <Link to="/vet/breaks" className="feature-card inline-block">
                <FaCoffee size={36} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold">Breaks</h3>
                <p>Schedule breaks to avoid conflicts</p>
              </Link>

              <Link to="/vet/leaves" className="feature-card inline-block">
                <FaPlaneDeparture size={36} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold">Leaves</h3>
                <p>Apply and track leave dates</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}