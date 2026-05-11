import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./auth/guards/RequireAuth";
import RequireRole from "./auth/guards/RequireRole";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import OwnersListPage from "./features/owners/pages/OwnersListPage";
import VetsPage from "./features/vets/pages/VetsPage";
import AppointmentsPage from "./features/appointments/pages/AppointmentsPage";
import VisitsPage from "./features/visits/pages/VisitsPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import SlotGenerator from "./pages/admin/SlotGenerator";
import AdminProfile from "./features/admin/pages/AdminProfile";

import VetList from "./components/VetList"; 
import VetForm from "./components/VetForm";
import VetWorkingHours from "./components/VetWorkingHours";
import VetBreaks from "./components/VetBreaks";
import VetLeaves from "./components/VetLeaves";

import VetDashboard from "./pages/VetDashboard";
import VetProfile from "./pages/VetProfile";
import VetAppointments from "./pages/VetAppointments";

export default function App() {
  return (
    <Routes>
      {/* ✅ PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ✅ AUTHENTICATED ROUTES */}
      <Route element={<RequireAuth />}>
        {/* ✅ OWNER */}
        <Route path="/app" element={<UserLayout />}>
          <Route index element={<Navigate to="pets" replace />} />
          <Route path="pets" element={<OwnersListPage />} />
          <Route path="vets" element={<VetsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="visits" element={<VisitsPage />} />
        </Route>

        {/* ✅ ADMIN */}
        <Route element={<RequireRole allowed={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="slots" element={<SlotGenerator />} />

            {/* Admin vet management */}
            <Route path="vets" element={<VetList />} />
            <Route path="vets/add" element={<VetForm />} />
            <Route path="vets/edit/:id" element={<VetForm />} />
            <Route path="vet-working-hours" element={<VetWorkingHours />} />
            <Route path="vet-breaks" element={<VetBreaks />} />
          </Route>
        </Route>

        {/* ✅ VET */}
        <Route element={<RequireRole allowed={["VET"]} />}>
          <Route path="/vet" element={<VetDashboard />} />
          <Route path="/vet/profile" element={<VetProfile />} />
          <Route path="/vet/appointments" element={<VetAppointments />} />
          <Route path="/vet/working-hours" element={<VetWorkingHours />} />
          <Route path="/vet/breaks" element={<VetBreaks />} />
          <Route path="/vet/leaves" element={<VetLeaves />} />
        </Route>
      </Route>

      {/* ✅ GLOBAL 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}