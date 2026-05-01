export default function StatCard({ icon, label, value, color, bgColor }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bgColor, color }}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
}