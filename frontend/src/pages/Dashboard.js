import { useEffect, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity, FiPlus } from "react-icons/fi";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../api";
import StatCard from "../components/StatCard";
import TransactionModal from "../components/TransactionModal";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    const [s, t] = await Promise.all([
      api.get("/reports/summary"),
      api.get("/transactions/?limit=5"),
    ]);
    setSummary(s.data);
    setRecent(t.data);
  };

  useEffect(() => { load(); }, []);

  if (!summary) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Overview of your financial activity</div>
        </div>
        <button className="btn-add" onClick={() => setModalOpen(true)}>
          <FiPlus /> Add Transaction
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FiTrendingUp />} label="Total Income" value={`$${summary.total_income.toFixed(2)}`} color="#10b981" bgColor="rgba(16,185,129,0.1)" />
        <StatCard icon={<FiTrendingDown />} label="Total Expenses" value={`$${summary.total_expense.toFixed(2)}`} color="#ef4444" bgColor="rgba(239,68,68,0.1)" />
        <StatCard icon={<FiDollarSign />} label="Balance" value={`$${summary.balance.toFixed(2)}`} color={summary.balance >= 0 ? "#10b981" : "#ef4444"} bgColor="rgba(99,102,241,0.1)" />
        <StatCard icon={<FiActivity />} label="Transactions" value={summary.transaction_count} color="#8b5cf6" bgColor="rgba(139,92,246,0.1)" />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📊 Monthly Overview</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={summary.monthly}>
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">🥧 Expense Categories</div>
          {summary.category_breakdown.length === 0 ? (
            <div className="empty-state">No expense data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={summary.category_breakdown} dataKey="value" nameKey="name" outerRadius={90} label>
                  {summary.category_breakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card-box">
        <div className="chart-title">🕒 Recent Transactions</div>
        {recent.length === 0 ? (
          <div className="empty-state">No transactions yet. Add your first one!</div>
        ) : (
          <table className="txn-table">
            <thead>
              <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th style={{ textAlign: "right" }}>Amount</th></tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.description || "—"}</td>
                  <td>{t.category ? `${t.category.icon} ${t.category.name}` : "—"}</td>
                  <td><span className={`badge badge-${t.type}`}>{t.type}</span></td>
                  <td style={{ textAlign: "right", fontWeight: 600 }} className={t.type === "income" ? "text-success" : "text-danger"}>
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={load} />
    </div>
  );
}