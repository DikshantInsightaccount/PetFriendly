import { Outlet, NavLink } from "react-router-dom";

function AdminNavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `d-block px-3 py-2 rounded text-decoration-none ${
          isActive ? "bg-primary text-white" : "text-muted"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function AdminLayout() {
  return (
    <div className="d-flex min-vh-100">
      {/* ===== SIDEBAR ===== */}
      <aside
        className="border-end p-3"
        style={{ width: "260px" }}
      >
        <h5 className="fw-bold mb-4">Admin Panel</h5>

        {/* ✅ ADD YOUR BLOCK STARTS HERE */}
        <h6 className="text-uppercase text-muted mt-4 mb-2">
          Pet & Owner Management
        </h6>
        <AdminNavItem to="/admin/owners" label="Owners" />
        <AdminNavItem to="/admin/vets" label="Vets" />

        <h6 className="text-uppercase text-muted mt-4 mb-2">
          Appointments & Visits
        </h6>
        <AdminNavItem to="/admin/visits" label="Visits" />
        {/* ✅ ADD YOUR BLOCK ENDS HERE */}
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}