import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottomNav from "../../components/BottomNav.jsx";
import { createComplaint } from "../../api/complaints.api.js";

export default function Complaints() {
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await createComplaint({ restaurantId, message });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="screen">
        <span className="back-link" onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          ← Back
        </span>
        <h1 className="page-title">Log a Complaint</h1>

        {sent ? (
          <p className="empty-state">
            Your complaint has been sent to the restaurant. They'll follow up shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>What went wrong?</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Tell us what happened…"
              />
            </div>
            <button className="btn btn-primary" disabled={sending || !restaurantId}>
              {sending ? "Sending…" : "Submit Complaint"}
            </button>
          </form>
        )}
      </div>
      <BottomNav />
    </>
  );
}
