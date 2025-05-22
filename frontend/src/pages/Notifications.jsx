import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav.jsx";
import { listNotifications, markRead, markAllRead } from "../api/notifications.api.js";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => listNotifications().then(setNotifications).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleRead = async (id) => {
    await markRead(id);
    load();
  };

  const handleReadAll = async () => {
    await markAllRead();
    load();
  };

  return (
    <>
      <div className="screen">
        <div className="section-header" style={{ margin: "0 0 20px" }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Notifications</h1>
          {notifications.some((n) => !n.is_read) && (
            <a onClick={handleReadAll} style={{ cursor: "pointer" }}>Mark all read</a>
          )}
        </div>

        {loading && <p className="empty-state">Loading…</p>}
        {!loading && notifications.length === 0 && <p className="empty-state">You're all caught up.</p>}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-item ${n.is_read ? "" : "unread"}`}
            onClick={() => !n.is_read && handleRead(n.id)}
            style={{ cursor: n.is_read ? "default" : "pointer" }}
          >
            <span style={{ fontSize: 20 }}>{n.type === "spam" ? "⚠️" : "🔔"}</span>
            <div>
              <strong style={{ display: "block", marginBottom: 2 }}>{n.title}</strong>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{n.message}</span>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  );
}
