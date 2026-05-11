// src/layouts/AdminLayout.jsx

import { Outlet } from "react-router-dom";
import AdminTopbar from "../features/admin/pages/AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* ✅ Navbar-only Admin */}
      <AdminTopbar />

      {/* ✅ Page content */}
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}