import { Link } from "react-router-dom";
import {
  FaPaw,
  FaSignOutAlt,
  FaCalendarDay,
  FaClock,
  FaCoffee,
} from "react-icons/fa";
import { useAuth } from "../../../auth/AuthContext";

export default function VetNavbar({ todayCount, nextAppointment }) {
  const { user, logout } = useAuth();

  return (
    <div
      className="d-flex align-items-center justify-content-between px-4 py-3 mb-4"
      style={{
        background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
        color: "white",
        borderRadius: 14,
      }}
    >
      {/* Left */}
      <Link
        to="/vet/dashboard"
        className="text-white text-decoration-none fw-bold d-flex align-items-center gap-2"
      >
        <FaPaw />
        Vet Panel
      </Link>

      {/* Center: navigation (VIEW ONLY) */}
      <div className="d-none d-md-flex gap-4 align-items-center">
        {/* <Link to="/vet/appointments" className="text-white text-decoration-none">
          <FaCalendarDay className="me-1" />
          Appointments
        </Link> */}

        <Link to="/vet/working-hours" className="text-white text-decoration-none">
          <FaClock className="me-1" />
          My Working Hours
        </Link>

        <Link to="/vet/breaks" className="text-white text-decoration-none">
          <FaCoffee className="me-1" />
          My Breaks
        </Link>
      </div>

      {/* Right */}
      <div className="d-flex align-items-center gap-3">
        <span className="fw-semibold">{user?.name || "Vet"}</span>
        <button onClick={logout} className="btn btn-sm btn-outline-light">
          <FaSignOutAlt className="me-1" />
          Logout
        </button>
      </div>
    </div>
  );
}