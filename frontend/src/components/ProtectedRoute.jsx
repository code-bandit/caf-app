import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ role }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <div className="empty-state">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin/home" : "/home"} replace />;
  }

  return <Outlet />;
}
