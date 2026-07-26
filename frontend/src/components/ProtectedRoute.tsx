import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { authApi } from "../lib/api";

export default function ProtectedRoute() {
  const [status, setStatus] = useState<"loading" | "auth" | "guest">("loading");

  useEffect(() => {
    authApi
      .loggedIn()
      .then((res) => setStatus(res.data ? "auth" : "guest"))
      .catch(() => setStatus("guest"));
  }, []);

  if (status === "loading") {
    return (
      <div className="page-center">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
