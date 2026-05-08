import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function RequireRole({ allowed = [] }) {
  const { role } = useAuth();

  if (!allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}