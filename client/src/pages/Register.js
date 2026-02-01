// client/src/pages/Register.js
import { useState } from "react";
import { api } from "../api";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      onRegister(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card form-card fade-up">
      <div>
        <h2>Create your account</h2>
        <p>Start a fresh deck set in minutes.</p>
      </div>

      <label className="field">
        Email
        <input
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>

      <label className="field">
        Password
        <input
          className="input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="min. 8 characters"
        />
      </label>

      <button className="btn btn-primary" disabled={loading || !email || !password}>
        {loading ? "Creating account…" : "Register"}
      </button>

      {error && <p className="form-error">Error: {error}</p>}
    </form>
  );
}
