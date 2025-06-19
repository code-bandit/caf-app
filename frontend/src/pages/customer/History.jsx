import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav.jsx";
import BackLink from "../../components/BackLink.jsx";
import { listMyHistory } from "../../api/history.api.js";

export default function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyHistory()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="screen">
        <BackLink />
        <h1 className="page-title">History</h1>

        {loading && <p className="empty-state">Loading…</p>}
        {!loading && entries.length === 0 && <p className="empty-state">No orders yet.</p>}

        {entries.map((entry) => (
          <div key={entry.id} className="restaurant-card">
            <div className="dish-thumb" style={{ width: 56, height: 56, aspectRatio: "auto" }} />
            <div className="restaurant-meta">
              <h3>{entry.item_name}</h3>
              <p>
                {entry.restaurant_name} · Qty {entry.quantity} ·{" "}
                {new Date(entry.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className="price">₦{Number(entry.price).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  );
}
