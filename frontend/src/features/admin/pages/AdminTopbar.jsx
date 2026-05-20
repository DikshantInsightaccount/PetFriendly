// src/components/admin/AdminTopbar.jsx

import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import {
  FaPaw,
  FaUserCircle,
  FaSignOutAlt,
  FaUsers,
  FaUserMd,
  FaCalendarCheck,
  FaClock,
  FaCoffee,
} from "react-icons/fa";

const navLinkClass = ({ isActive }) =>
  `text-decoration-none d-flex align-items-center gap-2 px-2 py-1 rounded ${isActive ? "bg-white bg-opacity-25" : "text-white"
  }`;

export default function AdminTopbar() {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const title = (() => {
    const p = location.pathname;
    if (p.includes("/admin/vets")) return "Vet Management";
    if (p.includes("/admin/owners")) return "Owners";
    if (p.includes("/admin/appointments")) return "Appointments";
    if (p.includes("/admin/slots")) return "Slot Generator";
    if (p.includes("/admin/visits")) return "Visits";
    if (p.includes("/admin/vet-working-hours")) return "Vet Working Hours";
    if (p.includes("/admin/vet-breaks")) return "Vet Breaks";

    if (p.includes("/admin/profile")) return "My Profile";
    return "Dashboard";
  })();

  return (
    <div
      className="d-flex align-items-center justify-content-between px-3 px-md-4 py-3 mb-3"
      style={{
        background: "linear-gradient(135deg, #60a5fa, #34d399)", // 
        color: "white",
      }}
    >
      {/* Left: Brand (clickable) */}
      <div className="d-flex align-items-center gap-2">
        <Link
          to="/admin/dashboard"
          className="text-white text-decoration-none d-flex align-items-center gap-2"
          style={{ fontWeight: 700 }}
        >
          <FaPaw size={20} />
          <span>Pet Clinic</span>
        </Link>

        <span
          className="badge"
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.22)",
            color: "white",
          }}
        >
          {role || "ADMIN"}
        </span>

        <span style={{ opacity: 0.92, marginLeft: 10 }}>{title}</span>
      </div>

      {/* Center: Quick links with active highlight */}
      <div className="d-none d-md-flex align-items-center gap-2">
        <NavLink to="/admin/dashboard" className={navLinkClass}>
          <FaPaw /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/vets" className={navLinkClass}>
          <FaUserMd /> <span>Vets</span>
        </NavLink>

        <NavLink to="/admin/owners" className={navLinkClass}>
          <FaUsers /> <span>Owners</span>
        </NavLink>

        <NavLink to="/admin/appointments" className={navLinkClass}>
          <FaCalendarCheck /> <span>Appointments</span>
        </NavLink>


        <NavLink to="/admin/vet-working-hours" className={navLinkClass}>
          <FaClock /> <span>Vet Working Hours</span>
        </NavLink>

        <NavLink to="/admin/vet-breaks" className={navLinkClass}>
          <FaCoffee /> <span>Vet Breaks</span>
        </NavLink>


        {/* <NavLink to="/admin/slots" className={navLinkClass}>
          <FaClock /> <span>Slots</span>
        </NavLink> */}
      </div>

      {/* Right: User + Profile + Logout */}
      <div className="d-flex align-items-center gap-3">
        <div className="d-none d-sm-flex align-items-center gap-2">
          <FaUserCircle size={20} />
          <div style={{ lineHeight: 1.1 }}>
            <div className="fw-semibold">{user?.name || "Admin"}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              {user?.email || ""}
            </div>
          </div>
        </div>

        <Link
          to="/admin/profile"
          className="btn btn-sm"
          style={{
            background: "rgba(255,255,255,0.18)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.22)",
          }}
        >
          Profile
        </Link>

        <button
          className="btn btn-sm"
          onClick={logout}
          style={{
            background: "rgba(0,0,0,0.12)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
}