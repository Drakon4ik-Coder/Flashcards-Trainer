import { useState } from "react";
import { api } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Login sets the auth cookie on success
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Fetch the current user
      const { user } = await api("/api/auth/me");
      onLogin(user); // pass user to App
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card form-card fade-up">
      <div>
        <h2>Welcome back</h2>
        <p>Log in to keep your decks in sync.</p>
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
          placeholder="••••••••"
        />
      </label>

      <button className="btn btn-primary" disabled={loading || !email || !password}>
        {loading ? "Logging in…" : "Login"}
      </button>

      {error && <p className="form-error">Error: {error}</p>}
    </form>
  );
}
