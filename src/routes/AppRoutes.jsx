import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "../auth/guards/RequireAuth";
import RequireRole from "../auth/guards/RequireRole";

import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import Loader from "../components/common/Loader";

// ---------- EAGER (used immediately) ----------
import UserDashboard from "../pages/UserDashboard";

// ---------- LAZY ----------
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const NotFound = lazy(() => import("../pages/NotFound"));

const PetsPage = lazy(() => import("../features/pets/pages/PetsPage"));
const VetsPage = lazy(() => import("../features/vets/pages/VetsPage"));
const VisitsPage = lazy(() => import("../features/visits/pages/VisitsPage"));
const BookVisitPage = lazy(() =>
  import("../features/visits/pages/BookVisitPage")
);
const SupportChatPage = lazy(() =>
  import("../features/chatbot/pages/SupportChatPage")
);

const AdminDashboard = lazy(() =>
  import("../features/admin/pages/AdminDashboard")
);
const ManageOwners = lazy(() =>
  import("../features/admin/pages/ManageOwners")
);
const ManageVets = lazy(() =>
  import("../features/admin/pages/ManageVets")
);
const ManageVisits = lazy(() =>
  import("../features/admin/pages/ManageVisits")
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader label="Loading..." />}>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* ================= USER ================= */}
        <Route element={<RequireAuth />}>
          <Route element={<UserLayout />}>
            <Route
              path="/app"
              element={<Navigate to="/app/dashboard" replace />}
            />
            <Route path="/app/dashboard" element={<UserDashboard />} />
            <Route path="/app/pets" element={<PetsPage />} />
            <Route path="/app/vets" element={<VetsPage />} />
            <Route path="/app/visits" element={<VisitsPage />} />
            <Route path="/app/book-visit" element={<BookVisitPage />} />
            <Route path="/app/support" element={<SupportChatPage />} />
          </Route>
        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole allowed={["ADMIN"]} />}>
            <Route element={<AdminLayout />}>
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />
              <Route path="/admin/owners" element={<ManageOwners />} />
              <Route path="/admin/vets" element={<ManageVets />} />
              <Route path="/admin/visits" element={<ManageVisits />} />
            </Route>
          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}