import { Routes, Route, Navigate } from "react-router-dom";

// Core pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Layout
import UserLayout from "./layouts/UserLayout";

// Feature pages
import Users from "./features/owners/pages/OwnersListPage";
import Vets from "./features/vets/pages/VetsPage";
import Appointments from "./features/appointments/pages/AppointmentsPage";
import Visits from "./features/visits/pages/VisitsPage";

function App() {
  return (
    <Routes>

      {/* ✅ PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ✅ USER DASHBOARD ROUTES */}
      <Route path="/app" element={<UserLayout />}>

        {/* ✅ Default dashboard */}
        <Route index element={<Navigate to="pets" replace />} />

        <Route path="pets" element={<Users />} />
        <Route path="vets" element={<Vets />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="visits" element={<Visits />} />

      </Route>

      {/* ✅ FALLBACK */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;