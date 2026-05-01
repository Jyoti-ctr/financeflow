import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import api from "../api";
import { useToast } from "../components/Toast";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "📁", color: "#6366f1", type: "expense" });
  const toast = useToast();

  const load = async () => setItems((await api.get("/categories/")).data);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories/", form);
      toast.show("Category added");
      setForm({ name: "", icon: "📁", color: "#6366f1", type: "expense" });
      setAdding(false);
      load();
    } catch { toast.show("Error", "error"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    toast.show("Category deleted");
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Categories</div>
          <div className="page-subtitle">Organize your transactions</div>
        </div>
        <button className="btn-add" onClick={() => setAdding(!adding)}><FiPlus /> New</button>
      </div>

      {adding && (
        <div className="card-box" style={{ marginBottom: 20 }}>
          <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 150 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Name</label>
              <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Icon</label>
              <input className="form-input" style={{ width: 80 }} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Color</label>
              <input className="form-input" style={{ width: 70, padding: 4 }} type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Type</label>
              <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button className="btn-add" type="submit">Save</button>
          </form>
        </div>
      )}

      <div className="categories-grid">
        {items.map((c) => (
          <div className="category-card" key={c.id}>
            <div className="cat-icon-box" style={{ background: c.color + "20", color: c.color }}>{c.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "capitalize" }}>{c.type}</div>
            </div>
            <button className="icon-btn danger" onClick={() => del(c.id)}><FiTrash2 /></button>
          </div>
        ))}
      </div>
    </div>
  );
}