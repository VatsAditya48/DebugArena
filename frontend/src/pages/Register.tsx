
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import "../App.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setMessage(
      "Your registration form is valid. Account creation will be enabled after backend API integration."
    );
  };

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "32px 16px",
      }}
    >
      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "36px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>
            Debug<span style={{ color: "#8b5cf6" }}>Arena</span>
          </h1>

          <h2 style={{ fontSize: "23px", marginBottom: "8px" }}>
            Create your recruiter account
          </h2>

          <p style={{ color: "#929bb1", fontSize: "14px" }}>
            Join DebugArena and start managing technical assessments.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "18px" }}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Work Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
            />

            {error && (
              <p role="alert" style={{ color: "#f87171", fontSize: "13px" }}>
                {error}
              </p>
            )}

            {message && (
              <p role="status" style={{ color: "#a78bfa", fontSize: "13px" }}>
                {message}
              </p>
            )}

            <Button type="submit" className="auth-submit">
              Create Account
            </Button>
          </div>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "14px",
            color: "#929bb1",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#a78bfa", textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>

        <p className="auth-note">
          AI-Powered Technical Assessment Platform
        </p>
      </div>
    </div>
  );
}

export default Register;
