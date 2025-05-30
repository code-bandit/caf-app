import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../../components/BottomNav.jsx";
import Logo from "../../components/Logo.jsx";
import { getMyRestaurant, updateMyRestaurant } from "../../api/restaurants.api.js";
import { listMine } from "../../api/menuItems.api.js";

export default function Dashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);

  const load = () => {
    getMyRestaurant().then(setRestaurant);
    listMine().then(setItems);
  };

  useEffect(load, []);

  const setStatus = async (status) => {
    const updated = await updateMyRestaurant({ status });
    setRestaurant(updated);
  };

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="hero-panel">
        <div className="top-bar" style={{ marginBottom: 24 }}>
          <Logo light />
          <span className="avatar">🏛️</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 8 }}>Dashboard</h1>
        <span
          style={{
            background: "rgba(255,255,255,0.2)",
            padding: "6px 14px",
            borderRadius: 999,
            fontSize: 13,
          }}
        >
          📅 {today}
        </span>
      </div>

      <div className="screen" style={{ paddingTop: 24 }}>
        <h3 style={{ marginBottom: 14 }}>Availability Status:</h3>
        <div
          onClick={() => setStatus("online")}
          className="card"
          style={{
            background: restaurant?.status === "online" ? "var(--color-ink)" : "var(--color-primary-light)",
            color: restaurant?.status === "online" ? "#fff" : "var(--color-ink)",
            marginBottom: 12,
            cursor: "pointer",
          }}
        >
          <strong style={{ fontSize: 18 }}>Online</strong>
          <p style={{ margin: "4px 0 0", opacity: 0.8, fontSize: 13 }}>Active</p>
        </div>
        <div
          onClick={() => setStatus("offline")}
          className="card"
          style={{
            background: restaurant?.status === "offline" ? "var(--color-ink)" : "var(--color-primary-light)",
            color: restaurant?.status === "offline" ? "#fff" : "var(--color-ink)",
            marginBottom: 20,
            cursor: "pointer",
          }}
        >
          <strong style={{ fontSize: 18 }}>Offline</strong>
          <p style={{ margin: "4px 0 0", opacity: 0.8, fontSize: 13 }}>Inactive</p>
        </div>

        <div className="section-header">
          <h3>Recent Updates</h3>
          <Link to="/admin/items">View All</Link>
        </div>

        {items.slice(0, 5).map((item) => (
          <div key={item.id} className="restaurant-card">
            <div className="restaurant-thumb">{item.category === "drink" ? "🥤" : "🍽️"}</div>
            <div className="restaurant-meta">
              <h3>{item.name}</h3>
              <p>{item.category === "drink" ? "Drink" : "Main dish"} · updated {new Date(item.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="empty-state">No menu items yet — add your first one.</p>}
      </div>

      <BottomNav />
    </>
  );
}
