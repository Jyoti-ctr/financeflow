import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import api from "../api";
import { useToast } from "./Toast";

export default function TransactionModal({ open, onClose, onSaved, editing }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (open) {
      api.get("/categories/").then((r) => setCategories(r.data));
      if (editing) {
        setType(editing.type);
        setAmount(editing.amount);
        setDescription(editing.description || "");
        setDate(editing.date);
        setCategoryId(editing.category_id || "");
      } else {
        setType("expense"); setAmount(""); setDescription("");
        setDate(new Date().toISOString().split("T")[0]);
        setCategoryId("");
      }
    }
  }, [open, editing]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        type,
        amount: parseFloat(amount),
        description,
        date,
        category_id: categoryId ? parseInt(categoryId) : null,
      };
      if (editing) await api.put(`/transactions/${editing.id}`, data);
      else await api.post("/transactions/", data);
      toast.show(editing ? "Transaction updated" : "Transaction added");
      onSaved();
      onClose();
    } catch {
      toast.show("Error saving transaction", "error");
    }
    setLoading(false);
  };

  if (!open) return null;
  const filteredCats = categories.filter((c) => c.type === type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{editing ? "Edit" : "Add"} Transaction</div>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={submit}>
          <div className="type-toggle">
            <button type="button" className={`${type === "income" ? "active income" : ""}`} onClick={() => setType("income")}>Income</button>
            <button type="button" className={`${type === "expense" ? "active expense" : ""}`} onClick={() => setType("expense")}>Expense</button>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input className="form-input" type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select className="form-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Select category</option>
              {filteredCats.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input className="form-input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input className="form-input" placeholder="Optional note..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        </form>
      </div>
    </div>
  );
}