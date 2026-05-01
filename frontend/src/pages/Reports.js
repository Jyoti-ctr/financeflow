import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import api from "../api";
import { useToast } from "../components/Toast";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const toast = useToast();

  useEffect(() => {
    api.get("/reports/summary").then((r) => setSummary(r.data));
  }, []);

  const download = async () => {
    try {
      const r = await api.get("/reports/export-csv", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
      toast.show("CSV exported successfully");
    } catch {
      toast.show("Export failed", "error");
    }
  };

  if (!summary) return <div className="spinner" />;

  const savingsRate = summary.total_income > 0
    ? ((summary.balance / summary.total_income) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Reports</div>
          <div className="page-subtitle">Detailed financial reports and insights</div>
        </div>
        <button className="btn-add" onClick={download}>
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value" style={{ color: savingsRate >= 0 ? "#10b981" : "#ef4444" }}>
            {savingsRate}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Monthly Income</div>
          <div className="stat-value" style={{ color: "#10b981" }}>
            ${(summary.total_income / 6).toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Monthly Expense</div>
          <div className="stat-value" style={{ color: "#ef4444" }}>
            ${(summary.total_expense / 6).toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Net Balance</div>
          <div className="stat-value" style={{ color: summary.balance >= 0 ? "#10b981" : "#ef4444" }}>
            ${summary.balance.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="card-box" style={{ marginBottom: 20 }}>
        <div className="chart-title">📈 Income vs Expense Trend (6 months)</div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={summary.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card-box">
        <div className="chart-title">📊 Category Breakdown</div>
        {summary.category_breakdown.length === 0 ? (
          <div className="empty-state">No expense data yet</div>
        ) : (
          <table className="txn-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Spent</th>
                <th>% of Expenses</th>
              </tr>
            </thead>
            <tbody>
              {summary.category_breakdown
                .sort((a, b) => b.value - a.value)
                .map((c, i) => {
                  const pct = ((c.value / summary.total_expense) * 100).toFixed(1);
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td className="text-danger" style={{ fontWeight: 600 }}>
                        ${c.value.toFixed(2)}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              flex: 1,
                              height: 8,
                              background: "var(--border)",
                              borderRadius: 4,
                              overflow: "hidden",
                              maxWidth: 200,
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                              }}
                            />
                          </div>
                          <span style={{ fontWeight: 600, minWidth: 50 }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}