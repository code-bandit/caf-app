import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../../components/BottomNav.jsx";
import BackLink from "../../components/BackLink.jsx";
import { getItem, createItem, updateItem } from "../../api/menuItems.api.js";

const emptyForm = { name: "", description: "", price: "", image_url: "", category: "main_dish" };

export default function ItemForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      getItem(id).then((item) =>
        setForm({
          name: item.name,
          description: item.description || "",
          price: item.price,
          image_url: item.image_url || "",
          category: item.category,
        })
      );
    }
  }, [mode, id]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (mode === "edit") {
        await updateItem(id, form);
      } else {
        await createItem(form);
      }
      navigate("/admin/items");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="screen">
        <BackLink />
        <h1 className="page-title">{mode === "edit" ? "Update Item" : "Add Item"}</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <img src="/icons/add-picture.png" alt="" style={{ width: 56, height: 56, opacity: 0.8 }} />
            <span style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>Add Picture</span>
          </div>
          <div className="field">
            <input placeholder="Image URL" value={form.image_url} onChange={update("image_url")} />
          </div>
          <div className="field">
            <input placeholder="Item Name" value={form.name} onChange={update("name")} required />
          </div>
          <div className="field">
            <textarea
              placeholder="Description (Optional)"
              rows={3}
              value={form.description}
              onChange={update("description")}
            />
          </div>
          <div className="field">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={update("price")}
              required
            />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={update("category")}>
              <option value="main_dish">Main dish</option>
              <option value="drink">Drink</option>
            </select>
          </div>

          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Submit"}
          </button>
        </form>
      </div>
      <BottomNav />
    </>
  );
}
