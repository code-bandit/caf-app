import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../components/Logo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  gender: "",
  address: "",
  businessName: "",
};

export default function SignUp() {
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ role, ...form });
      navigate("/sign-in");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen narrow-screen">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Logo />
      </div>
      <h1 className="page-title">Sign Up</h1>

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
          <input placeholder="Full Name" value={form.name} onChange={update("name")} required />
        </div>
        {role === "admin" && (
          <div className="field">
            <input
              placeholder="Business Name"
              value={form.businessName}
              onChange={update("businessName")}
              required
            />
          </div>
        )}
        <div className="field">
          <input type="email" placeholder="E-mail" value={form.email} onChange={update("email")} required />
        </div>
        <div className="field">
          <input placeholder="Phone No." value={form.phone} onChange={update("phone")} />
        </div>
        <div className="field">
          <input placeholder="Username" value={form.username} onChange={update("username")} required />
        </div>
        <div className="field">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
            required
            minLength={8}
          />
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Creating Account…" : "Sign Up"}
        </button>
      </form>

      <p className="helper-link">
        Already have an account? <Link to="/sign-in"><b>Sign In</b></Link>
      </p>
    </div>
  );
}
