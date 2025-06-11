import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../components/Logo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SignIn() {
  const [role, setRole] = useState("customer");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ role, identifier, password });
      navigate("/verify-2fa");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen narrow-screen">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Logo />
      </div>
      <h1 className="page-title">Sign In</h1>

      <div className="tabs">
        <div className={`tab ${role === "customer" ? "active" : ""}`} onClick={() => setRole("customer")}>
          Customer
        </div>
        <div className={`tab ${role === "admin" ? "active" : ""}`} onClick={() => setRole("admin")}>
          Administrator
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            placeholder="E-mail/Phone No."
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <label className="checkbox-row">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember Me Always
        </label>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Signing In…" : "Sign In"}
        </button>
      </form>

      <p className="helper-link">
        Don't have an account? <Link to="/sign-up"><b>Sign Up</b></Link>
      </p>
    </div>
  );
}
