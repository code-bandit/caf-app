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
    if (!confirm("Remove this item from your menu?")) return;
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
            <div className="restaurant-thumb">{item.category === "drink" ? "🥤" : "🍽️"}</div>
            <div className="restaurant-meta">
              <h3>{item.name}</h3>
              <p>₦{Number(item.price).toLocaleString()} · {item.category === "drink" ? "Drink" : "Main dish"}</p>
            </div>
            <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
              <a onClick={() => navigate(`/admin/items/${item.id}/edit`)} style={{ cursor: "pointer" }}>
                Edit
              </a>
              <a onClick={() => handleDelete(item.id)} style={{ cursor: "pointer", color: "var(--color-danger)" }}>
                Delete
              </a>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  );
}
