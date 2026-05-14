import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { FaPaw } from "react-icons/fa";

import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login",{ replace: true,state: {}});
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">

        {/* ✅ BRAND */}
        <Link className="navbar-brand brand-text" to="/">
          🐾 PawCare
        </Link>

        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-3">

            {!isAuthenticated ? (
              <>
                <NavLink className="home-btn" to="/" end>
                  <FaPaw /> Home
                </NavLink>

                <NavLink className="nav-link nav-modern" to="/login">
                  Login
                </NavLink>

                <NavLink className="btn btn-gradient" to="/register">
                  Get Started
                </NavLink>
              </>
            ) : (
              <>
                {/* ✅ USER NAV */}
                <NavLink className="nav-link nav-modern" to="/app/pets">
                  Pets
                </NavLink>

                {/* ✅ BOOKING WIZARD (FIX) */}
                <NavLink className="nav-link nav-modern" to="/app/book-appointment">
                  Book Appointment
                </NavLink>

                {/* <NavLink className="nav-link nav-modern" to="/app/visits">
                  Visits
                </NavLink> */}

                {role === "ADMIN" && (
                  <NavLink className="nav-link nav-modern" to="/admin/dashboard">
                    Admin
                  </NavLink>
                )}

                <span className="user-text">
                  {user?.name ? `Hi, ${user.name}` : "Signed in"}
                </span>

                <button
                  className="btn btn-outline-custom btn-sm"
                  onClick={onLogout}
                >
                  Logout
                </button>

                {/* ✅ HOME LINK (SAFE) */}
                <NavLink className="home-btn ms-2" to="/" end>
                  <FaPaw /> Home
                </NavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}