import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav.jsx";
import { listMine, deleteItem } from "../../api/menuItems.api.js";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const load = () => listMine().then(setItems);

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item from your menu?")) return;
    await deleteItem(id);
    load();
  };

  return (
    <>
      <div className="screen">
        <div className="section-header" style={{ margin: "0 0 20px" }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Menu Items</h1>
          <Link to="/admin/items/new" className="btn btn-accent" style={{ width: "auto", padding: "8px 16px", fontSize: 13 }}>
            + Add Item
          </Link>
        </div>

        {items.length === 0 && <p className="empty-state">You haven't added any items yet.</p>}

        {items.map((item) => (
          <div key={item.id} className="restaurant-card">
            <div className="dish-thumb" style={{ width: 56, height: 56, aspectRatio: "auto" }} />
            <div className="restaurant-meta">
              <h3>{item.name}</h3>
              <p>₦{Number(item.price).toLocaleString()} · {item.category === "drink" ? "Drink" : "Main dish"}</p>
            </div>
            <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
              <button type="button" className="link-btn" onClick={() => navigate(`/admin/items/${item.id}/edit`)}>
                Edit
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={() => handleDelete(item.id)}
                style={{ color: "var(--color-danger)" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  );
}
