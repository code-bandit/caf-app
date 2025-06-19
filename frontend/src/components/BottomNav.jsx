import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function BottomNav() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const base = isAdmin ? "/admin" : "";
  const secondary = isAdmin
    ? { to: "/admin/items", icon: "/icons/search.png", alt: "Items" }
    : { to: "/search", icon: "/icons/search.png", alt: "Search" };

  return (
    <nav className="bottom-nav">
      <NavLink to={`${base}/home`} className={({ isActive }) => (isActive ? "active" : "")}>
        <img src="/icons/home.png" alt="Home" />
      </NavLink>
      <NavLink to={secondary.to} className={({ isActive }) => (isActive ? "active" : "")}>
        <img src={secondary.icon} alt={secondary.alt} />
      </NavLink>
      <NavLink to={`${base}/notifications`} className={({ isActive }) => (isActive ? "active" : "")}>
        <img src="/icons/bell.png" alt="Notifications" />
      </NavLink>
      <NavLink to={`${base}/profile`} className={({ isActive }) => (isActive ? "active" : "")}>
        <img src="/icons/profile.png" alt="Profile" />
      </NavLink>
    </nav>
  );
}
