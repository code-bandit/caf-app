import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function TwoFactor() {
  const { pendingUserId, verifyTwoFactor } = useAuth();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  if (!pendingUserId) {
    return <Navigate to="/sign-in" replace />;
  }

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await verifyTwoFactor(digits.join(""));
      navigate(user.role === "admin" ? "/admin/home" : "/home");
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Logo />
      </div>
      <h1 className="page-title">Verify It's You</h1>
      <p style={{ color: "var(--color-text-secondary)" }}>
        Enter the 6-digit code we sent to your email address.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>

        <button className="btn btn-primary" disabled={loading || digits.some((d) => !d)}>
          {loading ? "Verifying…" : "Verify"}
        </button>
      </form>
    </div>
  );
}
