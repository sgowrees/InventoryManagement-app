import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">📋</span>
          <h1>Welcome back</h1>
          <p>Sign in to manage your inventory</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={loginUser} className="auth-form">
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot">Forgot password?</Link>
          <span>
            No account? <Link to="/register">Create one</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
