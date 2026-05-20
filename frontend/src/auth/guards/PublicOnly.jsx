import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Loader from "../../components/common/Loader";

export default function PublicOnly() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) return <Loader label="Loading..." />;

  if (isAuthenticated) {
    const to =
      role === "ADMIN"
        ? "/admin/dashboard"
        : role === "VET"
        ? "/vet/dashboard"
        : "/app/dashboard"; // OWNER lands here

    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}