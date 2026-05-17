import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { FaPaw } from "react-icons/fa";

import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "VET"
        ? "/vet/dashboard"
        : "/app/dashboard";

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });

    setTimeout(() => {
      window.location.replace("/login");
    }, 0);

  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">

        {/* ✅ BRAND */}

        <Link
          className="navbar-brand brand-text"
          to={isAuthenticated ? dashboardPath : "/"}
        >

          🐾 PawCare
        </Link>

        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-3">

            {!isAuthenticated ? (
              <>

                <NavLink
                  className="home-btn ms-2"
                  to={isAuthenticated ? dashboardPath : "/"}
                  end
                >

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
                {/* USER NAV */}

                {role === "OWNER" && (
                  <>
                    <NavLink className="nav-link nav-modern" to="/app/pets">
                      Pets
                    </NavLink>

                    <NavLink className="nav-link nav-modern" to="/app/book-appointment">
                      Book Appointment
                    </NavLink>
                  </>
                )}


                {role === "VET" && (
                  <>
                    <NavLink className="nav-link nav-modern" to="/vet/appointments">
                      Appointments
                    </NavLink>

                    <NavLink className="nav-link nav-modern" to="/vet/working-hours">
                      Working Hours
                    </NavLink>

                    <NavLink className="nav-link nav-modern" to="/vet/breaks">
                      Breaks
                    </NavLink>
                  </>
                )}

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

                {/* HOME LINK (SAFE) */}
                <NavLink className="home-btn ms-2" to={dashboardPath} end>
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