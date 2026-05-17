import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function RequireRole({ allowed = [] }) {
  const { role, isLoading } = useAuth();

  if (isLoading) return null;

  if (!allowed.includes(role)) {
    const redirectPath =
      role === "ADMIN"
        ? "/admin/dashboard"
        : role === "VET"
        ? "/vet/dashboard"
        : "/app/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
