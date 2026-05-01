import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.show("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.show("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.show(err.response?.data?.detail || "Registration failed", "error");
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">💰 FinanceFlow</div>
        <div className="auth-subtitle">Create an account to start tracking</div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn-primary" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}