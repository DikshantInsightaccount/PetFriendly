import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      className="border-end bg-light p-3"
      style={{ width: 240 }}
    >
      <div className="fw-bold mb-3">Admin</div>

      <div className="d-grid gap-2">
        <NavLink
          className="btn btn-outline-primary text-start"
          to="/admin/dashboard"
        >
          Dashboard
        </NavLink>

        <NavLink
          className="btn btn-outline-primary text-start"
          to="/admin/owners"
        >
          Owners
        </NavLink>

        <NavLink
          className="btn btn-outline-primary text-start"
          to="/admin/vets"
        >
          Vets
        </NavLink>

        <NavLink
          className="btn btn-outline-primary text-start"
          to="/admin/visits"
        >
          Visits
        </NavLink>
      </div>
    </aside>
  );
}