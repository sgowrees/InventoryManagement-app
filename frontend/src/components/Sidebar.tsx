import { NavLink, useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📦" },
  { to: "/report", label: "Reports", icon: "📊" },
  { to: "/setting", label: "Settings", icon: "⚙️" },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* proceed to login even if logout fails */
    }
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-brand">
        <span className="brand-icon">📋</span>
        {sidebarOpen && <span className="brand-text">Inventory</span>}
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? "‹" : "›"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            title={item.label}
          >
            <span className="link-icon">{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-link logout-btn" onClick={handleLogout}>
          <span className="link-icon">🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
