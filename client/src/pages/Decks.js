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
    <section className="card content-shell fade-up">
      <div className="section-head">
        <div>
          <h2 className="section-title">Your decks</h2>
          <p className="section-subtitle">Organize topics you want to master.</p>
        </div>
        <div className="count-pill">{decks.length} decks</div>
      </div>

      <form onSubmit={handleCreate} className="deck-form">
        <label className="field">
          New deck name
          <input
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Spanish A1"
          />
        </label>
        <button className="btn btn-primary" disabled={loading || !name.trim()}>
          {loading ? "Creating…" : "Create deck"}
        </button>
      </form>

      {error && <p className="form-error">Error: {error}</p>}

      {loadingList ? (
        <p className="status-text">Loading decks…</p>
      ) : decks.length === 0 ? (
        <p className="status-text">No decks yet. Create your first one above.</p>
      ) : (
        <ul className="deck-list">
          {decks.map((deck, index) => (
            <li
              key={deck.id}
              className="deck-item fade-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className="deck-name">{deck.name}</span>
              <span className="status-text">Ready</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
