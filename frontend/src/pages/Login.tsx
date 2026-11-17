
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { apiRequest } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest<{
        access_token: string;
        user: { id: string; email: string; full_name: string; role: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("debugarena_access_token", result.access_token);
      localStorage.setItem("debugarena_user", JSON.stringify(result.user));
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          Debug<span>Arena</span>
        </div>

        <p className="eyebrow">RECRUITER PORTAL</p>
        <h1>Welcome back</h1>
        <p className="auth-description">
          Sign in to manage assessments and discover top talent.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
{loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have a recruiter account?{" "}
          <Link to="/register">Create an account</Link>
        </p>

        <p className="auth-note">
          Candidate? Use the assessment invitation link provided by your recruiter.
        </p>
      </div>
    </div>
  );
}

export default Login;
