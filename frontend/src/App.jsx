import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./auth/guards/RequireAuth";
import RequireRole from "./auth/guards/RequireRole";

// Core pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Layouts
import UserLayout from "./layouts/UserLayout";

// Feature pages
import OwnersListPage from "./features/owners/pages/OwnersListPage";
import VetsPage from "./features/vets/pages/VetsPage";
import AppointmentsPage from "./features/appointments/pages/AppointmentsPage";
import VisitsPage from "./features/visits/pages/VisitsPage";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import VetList from "./components/VetList";
import VetForm from "./components/VetForm";
import VetWorkingHours from "./components/VetWorkingHours";
import VetBreaks from "./components/VetBreaks";
import VetLeaves from "./components/VetLeaves";
import VetDashboard from "./pages/VetDashboard";

function App() {
  return (
    <Routes>
      {/* ✅ Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ✅ AUTHENTICATED AREA */}
      <Route element={<RequireAuth />}>
        {/* USER */}
        <Route path="/app" element={<UserLayout />}>
          <Route index element={<Navigate to="pets" replace />} />
          <Route path="pets" element={<OwnersListPage />} />
          <Route path="vets" element={<VetsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="visits" element={<VisitsPage />} />
        </Route>

        {/* ADMIN */}
        <Route element={<RequireRole allowed={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vets" element={<VetList />} />
          <Route path="/admin/vets/add" element={<VetForm />} />
          <Route path="/admin/vets/edit/:id" element={<VetForm />} />
          <Route path="/admin/vet-working-hours" element={<VetWorkingHours />} />
          <Route path="/admin/vet-breaks" element={<VetBreaks />} />
        </Route>

        {/* VET */}
        <Route element={<RequireRole allowed={["VET"]} />}>
          <Route path="/vet" element={<VetDashboard />} />
          <Route path="/vet/leaves" element={<VetLeaves />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;