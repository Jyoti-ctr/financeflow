import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import api from "../api";
import TransactionModal from "../components/TransactionModal";
import { useToast } from "../components/Toast";

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", type: "", category_id: "", start_date: "", end_date: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));
    const [t, c] = await Promise.all([
      api.get("/transactions/", { params }),
      api.get("/categories/"),
    ]);
    setItems(t.data);
    setCategories(c.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filters]);

  const del = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    toast.show("Transaction deleted");
    load();
  };

  const edit = (t) => { setEditing(t); setModalOpen(true); };
  const closeModal = () => { setEditing(null); setModalOpen(false); };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Transactions</div>
          <div className="page-subtitle">Manage all your income and expenses</div>
        </div>
        <button className="btn-add" onClick={() => setModalOpen(true)}><FiPlus /> Add</button>
      </div>

      <div className="card-box">
        <div className="filters-row">
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <FiSearch style={{ position: "absolute", left: 12, top: 13, color: "var(--text-muted)" }} />
            <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search..." value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <select className="form-input" style={{ flex: "0 0 130px" }} value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="form-input" style={{ flex: "0 0 160px" }} value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <input className="form-input" style={{ flex: "0 0 160px" }} type="date" value={filters.start_date} onChange={(e) => setFilters({ ...filters, start_date: e.target.value })} />
          <input className="form-input" style={{ flex: "0 0 160px" }} type="date" value={filters.end_date} onChange={(e) => setFilters({ ...filters, end_date: e.target.value })} />
        </div>

        {loading ? <div className="spinner" /> : items.length === 0 ? (
          <div className="empty-state">No transactions found</div>
        ) : (
          <table className="txn-table">
            <thead>
              <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.description || "—"}</td>
                  <td>{t.category ? `${t.category.icon} ${t.category.name}` : "—"}</td>
                  <td><span className={`badge badge-${t.type}`}>{t.type}</span></td>
                  <td style={{ fontWeight: 600 }} className={t.type === "income" ? "text-success" : "text-danger"}>
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => edit(t)}><FiEdit2 /></button>
                    <button className="icon-btn danger" onClick={() => del(t.id)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <TransactionModal open={modalOpen} onClose={closeModal} onSaved={load} editing={editing} />
    </div>
  );
}