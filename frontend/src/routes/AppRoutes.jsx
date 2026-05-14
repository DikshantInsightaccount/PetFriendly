import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "../auth/guards/RequireAuth";
import RequireRole from "../auth/guards/RequireRole";

import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import Loader from "../components/common/Loader";
import VetLayout from "../layouts/VetLayout";

// ================= EAGER =================
import UserDashboard from "../pages/UserDashboard";
import VetDashboard from "../pages/VetDashboard";

// ================= LAZY – PUBLIC =================
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const NotFound = lazy(() => import("../pages/NotFound"));

// ================= LAZY – USER =================
const PetsPage = lazy(() => import("../features/pets/pages/PetsPage"));
const VetsPage = lazy(() => import("../features/vets/pages/VetsPage"));
// const VisitsPage = lazy(() => import("../features/visits/pages/VisitsPage"));


const PetDetails = lazy(() => import("../features/pets/pages/PetDetails"))
const PetAppointments = lazy(() =>
  import("../features/pets/pages/PetAppointments")
)

const SupportChatPage = lazy(() =>
  import("../features/chatbot/pages/SupportChatPage")
);
const BookAppointmentPage = lazy(() => import("../features/appointments/pages/BookAppointmentPage"));


// ================= LAZY – ADMIN =================
const AdminDashboard = lazy(() =>
  import("../features/admin/pages/AdminDashboard")
);
const ManageOwners = lazy(() =>
  import("../features/admin/pages/ManageOwners")
);
const ManageVets = lazy(() =>
  import("../features/admin/pages/ManageVets")
);
const VetWorkingHoursAdmin = lazy(() =>
  import("../components/VetWorkingHoursAdmin")
);
const VetBreaksAdmin = lazy(() =>
  import("../components/VetBreaksAdmin")
);
import VetWorkingHoursDetails from "../features/vets/components/VetWorkingHoursDetails";
import VetBreaksDetails from "../components/VetBreaksDetails";
const ManageVisits = lazy(() =>
  import("../features/admin/pages/ManageVisits")
);
const AdminAppointments = lazy(() =>
  import("../pages/admin/AdminAppointments")
);
const SlotGenerator = lazy(() =>
  import("../pages/admin/SlotGenerator")
);

const AdminProfile = lazy(() =>
  import("../features/admin/pages/AdminProfile")
);

// ================= LAZY – VET =================
const VetProfile = lazy(() => import("../pages/VetProfile"));
const VetAppointments = lazy(() => import("../features/vets/pages/VetAppointmentsPage"));
import VetWorkingHoursView from "../features/vets/components/VetWorkingHoursView";
import VetBreaksView from "../features/vets/components/VetBreaksView";
import { LuAxe } from "react-icons/lu";
const VetLeaves = lazy(() =>
  import("../components/VetLeaves")
);
const VetAppointmentsPetsPage = lazy(() => import("../features/visits/pages/VisitAppointmentsPetsPage"))
const VisitsPage = lazy(() => import("../features/visits/pages/VisitsPage"))
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

        {/* ================= USER (OWNER) ================= */}
        <Route element={<RequireAuth />}>
          <Route element={<UserLayout />}>
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

            <Route path="/app/dashboard" element={<UserDashboard />} />

            <Route path="/app/pets" element={<PetsPage />} />
            <Route path="/app/pets/:petId" element={<PetDetails />} />

            <Route path="/app/vets" element={<VetsPage />} />
            <Route path="/app/visits" element={<VisitsPage />} />

            {/* ✅ Appointments overview */}
            <Route
              path="/app/pets-appointments"
              element={<PetAppointments />}
            />

            <Route path="/app/book-appointment" element={<BookAppointmentPage />} />
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
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route
                path="/admin/appointments"
                element={<AdminAppointments />}
              />
              <Route path="/admin/slots" element={<SlotGenerator />} />
              <Route path="/admin/owners" element={<ManageOwners />} />
              <Route path="/admin/vets" element={<ManageVets />} />
              <Route
                path="/admin/vet-working-hours"
                element={<VetWorkingHoursAdmin />}
              />

              <Route
                path="/admin/vets/:vetId/working-hours"
                element={<VetWorkingHoursDetails />}
              />

              <Route path="/admin/vet-breaks" element={<VetBreaksAdmin />} />
              <Route path="/admin/vets/:vetId/breaks" element={<VetBreaksDetails />} />
            </Route>
          </Route>
        </Route>

        {/* ================= VET ================= */}

        <Route element={<RequireAuth />}>
          <Route element={<RequireRole allowed={["VET"]} />}>
            <Route element={<VetLayout />}>
              <Route
                path="/vet"
                element={<Navigate to="/vet/dashboard" replace />}
              />

              <Route path="/vet/dashboard" element={<VetDashboard />} />
              <Route path="/vet/profile" element={<VetProfile />} />
              <Route path="/vet/appointments" element={<VetAppointments />} />

              {/* VIEW ONLY */}
              <Route
                path="/vet/working-hours"
                element={<VetWorkingHoursView />}
              />
              <Route
                path="/vet/breaks"
                element={<VetBreaksView />}
              />

              {/* <Route path="/vet/leaves" element={<VetLeaves />} />
               */}
              <Route path="/app/visit" element={<VetAppointmentsPetsPage />} />
              <Route path="/app/visits/pet/:petId" element={<VisitsPage />} />
            </Route>
          </Route>
        </Route>



        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}