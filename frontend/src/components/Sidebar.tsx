import React from 'react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside className={sidebarOpen ? "sidebar" : "sidebar closed"}>
      <button
        className="toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "←" : "→"}
      </button>

      {sidebarOpen && (
        <ul>
          <li><a href="dashboard">dashboard</a></li>
          <li><a href="inventory">inventory</a></li>
          <li><a href="report">report</a></li>
          <li><a href="setting">settings</a></li>
          <li><a href="login">logout</a></li>
        </ul>
      )}
      {!sidebarOpen && (
        <ul>
          <li><a href="forgot">logo (add fade)</a></li>
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;