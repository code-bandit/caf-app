import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav.jsx";
import { listRestaurantComplaints, updateComplaintStatus } from "../../api/complaints.api.js";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  const load = () => listRestaurantComplaints().then(setComplaints);

  useEffect(load, []);

  const resolve = async (id) => {
    await updateComplaintStatus(id, "resolved");
    load();
  };

  return (
    <>
      <div className="screen">
        <h1 className="page-title">Complaints</h1>

        {complaints.length === 0 && <p className="empty-state">No complaints logged yet.</p>}

        {complaints.map((c) => (
          <div key={c.id} className="card" style={{ marginBottom: 14 }}>
            <div className="section-header" style={{ margin: "0 0 8px" }}>
              <strong>{c.customer_name}</strong>
              <span className={`status-pill ${c.status === "resolved" ? "online" : "offline"}`}>
                {c.status}
              </span>
            </div>
            <p style={{ margin: "0 0 8px", fontSize: 14 }}>{c.message}</p>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--color-text-secondary)" }}>
              {new Date(c.created_at).toLocaleString()}
            </p>
            {c.status === "open" && (
              <button type="button" className="link-btn" style={{ fontSize: 13 }} onClick={() => resolve(c.id)}>
                Mark as resolved
              </button>
            )}
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  );
}
