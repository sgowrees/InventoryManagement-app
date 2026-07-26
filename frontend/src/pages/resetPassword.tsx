import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authApi } from "../lib/api";

export default function ResetPassword() {
  const { resetToken } = useParams<{ resetToken: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!resetToken) {
      setError("Invalid reset link.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(resetToken, password);
      setSuccess("Password updated! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Reset failed. The link may have expired.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🔒</span>
          <h1>Set new password</h1>
          <p>Choose a strong password for your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            New password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={6}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
