import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getMe, updateMe } from "../api/users.api.js";

const FIELDS = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "email", label: "E-mail", readOnly: true },
  { key: "phone", label: "Phone No." },
  { key: "username", label: "Username" },
  { key: "gender", label: "Gender" },
];

export default function Profile() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMe().then((u) => {
      setProfile(u);
      setForm(u);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMe({
        name: form.name,
        address: form.address,
        phone: form.phone,
        username: form.username,
        gender: form.gender,
      });
      setProfile(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="empty-state">Loading…</div>;
  }

  return (
    <>
      <div className="screen">
        <div className="section-header" style={{ margin: "0 0 30px" }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Profile</h1>
          <a onClick={() => (editing ? handleSave() : setEditing(true))} style={{ cursor: "pointer" }}>
            {editing ? (saving ? "Saving…" : "Save") : "Edit"}
          </a>
        </div>

        <div style={{ textAlign: "center", fontSize: 64, marginBottom: 30 }}>👤</div>

        {FIELDS.map(({ key, label, readOnly }) => (
          <div className="field" key={key}>
            <label>{label}:</label>
            <input
              value={form[key] || ""}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              disabled={!editing || readOnly}
            />
          </div>
        ))}

        <button className="btn btn-outline" onClick={logout} style={{ marginTop: 20 }}>
          Log Out
        </button>
      </div>
      <BottomNav />
    </>
  );
}
