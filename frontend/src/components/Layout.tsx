import { useState } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function Layout({ title, subtitle, children, actions }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="app-main">
        <header className="page-header">
          <div>
            <h1>{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="page-actions">{actions}</div>}
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
