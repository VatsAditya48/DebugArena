
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    // Temporary frontend demonstration only.
    // Real authentication will be connected to Shairaf's API.
    localStorage.setItem("debugarena_user", JSON.stringify({
      email,
      role: "recruiter",
    }));

    navigate("/");
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

          <button type="submit" className="auth-submit">
            Sign In
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
