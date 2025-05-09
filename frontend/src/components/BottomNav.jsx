import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function BottomNav() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const base = isAdmin ? "/admin" : "";
  const secondary = isAdmin
    ? { to: "/admin/items", icon: "📋" }
    : { to: "/search", icon: "🔍" };

  return (
    <nav className="bottom-nav">
      <NavLink to={`${base}/home`} className={({ isActive }) => (isActive ? "active" : "")}>
        🏠
      </NavLink>
      <NavLink to={secondary.to} className={({ isActive }) => (isActive ? "active" : "")}>
        {secondary.icon}
      </NavLink>
      <NavLink to={`${base}/notifications`} className={({ isActive }) => (isActive ? "active" : "")}>
        🔔
      </NavLink>
      <NavLink to={`${base}/profile`} className={({ isActive }) => (isActive ? "active" : "")}>
        👤
      </NavLink>
    </nav>
  );
}
