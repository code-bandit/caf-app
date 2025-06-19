import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav.jsx";
import { listRestaurantHistory } from "../../api/history.api.js";

export default function AdminHistory() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    listRestaurantHistory().then(setEntries);
  }, []);

  return (
    <>
      <div className="screen">
        <h1 className="page-title">Order History</h1>

        {entries.length === 0 && <p className="empty-state">No orders yet.</p>}

        {entries.map((entry) => (
          <div key={entry.id} className="restaurant-card">
            <div className="dish-thumb" style={{ width: 56, height: 56, aspectRatio: "auto" }} />
            <div className="restaurant-meta">
              <h3>{entry.item_name}</h3>
              <p>
                {entry.customer_name} · Qty {entry.quantity} ·{" "}
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
