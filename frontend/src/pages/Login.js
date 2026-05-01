import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.show("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.show(err.response?.data?.detail || "Login failed", "error");
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">💰 FinanceFlow</div>
        <div className="auth-subtitle">Welcome back! Sign in to your account.</div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn-primary" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}