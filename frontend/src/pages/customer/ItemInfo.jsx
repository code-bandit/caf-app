import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BottomNav from "../../components/BottomNav.jsx";
import BackLink from "../../components/BackLink.jsx";
import { getItem } from "../../api/menuItems.api.js";
import { createHistoryEntry } from "../../api/history.api.js";

export default function ItemInfo() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    getItem(id).then(setItem);
  }, [id]);

  const handleOrder = async () => {
    setOrdering(true);
    try {
      await createHistoryEntry({ restaurantId: item.restaurant_id, menuItemId: item.id, quantity: 1 });
      setConfirmed(true);
    } finally {
      setOrdering(false);
    }
  };

  if (!item) {
    return <div className="empty-state">Loading…</div>;
  }

  return (
    <>
      <div className="screen">
        <BackLink />

        <div className="dish-thumb" style={{ width: "100%", aspectRatio: "auto", height: 220, marginBottom: 18 }} />

        <h1 className="page-title" style={{ marginBottom: 6 }}>{item.name}</h1>
        <p className="price" style={{ fontSize: 18, marginBottom: 18 }}>
          ₦{Number(item.price).toLocaleString()}
        </p>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: 30 }}>
          {item.description || "No description provided."}
        </p>

        {confirmed ? (
          <p className="error-banner" style={{ background: "#e5f6e7", color: "var(--color-success)" }}>
            Added to your history! Head to the restaurant to pick it up.
          </p>
        ) : (
          <button className="btn btn-primary" onClick={handleOrder} disabled={ordering}>
            {ordering ? "Placing…" : "Order This"}
          </button>
        )}
      </div>
      <BottomNav />
    </>
  );
}
