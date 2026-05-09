import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminLayout() {
  const { logout, user } = useAuth();

  return (
    <div>
      <nav className="navbar navbar-expand bg-light px-3 border-bottom">
        <div className="navbar-brand fw-bold">🐾 PetClinic Admin</div>

        <div className="navbar-nav me-auto">
          <NavLink className="nav-link" to="/admin/dashboard">Dashboard</NavLink>
          <NavLink className="nav-link" to="/admin/vets">Vets</NavLink>
          <NavLink className="nav-link" to="/admin/appointments">Appointments</NavLink>
          <NavLink className="nav-link" to="/admin/slots">Generate Slots</NavLink>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary">{user?.role ?? "ADMIN"}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}