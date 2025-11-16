// client/src/pages/Decks.js
import { useEffect, useState } from "react";
import { api } from "../api";

export default function Decks() {
  const [decks, setDecks] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

  async function loadDecks() {
    setLoadingList(true);
    setError("");
    try {
      const data = await api("/api/decks");
      console.log("GET /api/decks response:", data);
      setDecks(Array.isArray(data.decks) ? data.decks : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadDecks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      const deck = (await api("/api/decks", {
        method: "POST",
        body: JSON.stringify({ name }),
      })).deck;
      setDecks(prev => [deck, ...prev]); // add new at top
      setName("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Your decks</h2>

      <form
        onSubmit={handleCreate}
        style={{ display: "grid", gap: 8, marginBottom: 24 }}
      >
        <label>
          New deck name
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Spanish A1"
          />
        </label>
        <button disabled={loading || !name.trim()}>
          {loading ? "Creating…" : "Create deck"}
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {loadingList ? (
        <p>Loading decks…</p>
      ) : decks.length === 0 ? (
        <p>No decks yet. Create your first one above.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
          {decks.map(deck => (
            <li
              key={deck.id}
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{deck.name}</span>
              {/* You can add buttons for detail/delete later */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
