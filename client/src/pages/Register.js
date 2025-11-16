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
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 12, maxWidth: 360, margin: "2rem auto" }}
    >
      <h2>Register</h2>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="min. 8 characters"
        />
      </label>

      <button disabled={loading || !email || !password}>
        {loading ? "Creating account…" : "Register"}
      </button>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
    </form>
  );
}
