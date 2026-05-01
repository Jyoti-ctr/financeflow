import { NavLink } from "react-router-dom";
import { FiHome, FiList, FiTag, FiBarChart2, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { theme, toggle } = useTheme();

  const links = [
    { to: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/transactions", icon: <FiList />, label: "Transactions" },
    { to: "/categories", icon: <FiTag />, label: "Categories" },
    { to: "/reports", icon: <FiBarChart2 />, label: "Reports" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">💰 FinanceFlow</div>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ padding: "8px", fontSize: 13, color: "var(--text-muted)" }}>
          👤 {user?.name}
        </div>
        <button className="theme-toggle" onClick={toggle}>
          {theme === "light" ? <FiMoon /> : <FiSun />}
          <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
        </button>
        <button className="logout-btn" onClick={logout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}