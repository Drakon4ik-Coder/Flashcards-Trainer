import { useEffect, useState } from "react";
import { api } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Decks from "./pages/Decks";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [page, setPage] = useState("login"); // "login" | "register" | "decks"

  // On initial load, try to restore session from cookie
  useEffect(() => {
    (async () => {
      try {
        const { user } = await api("/api/auth/me");
        setUser(user);
        setPage("decks");
      } catch {
        // not logged in, that's ok
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, []);

  async function handleLogout() {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
    setPage("login");
  }

  function handleLoggedIn(userObj) {
    setUser(userObj);
    setPage("decks");
  }

  if (checkingAuth) {
    return <p className="status-text status-center">Loading…</p>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="logo-mark">FT</div>
          <div>
            <h1 className="brand-title">Flashcards Trainer</h1>
            <p className="brand-subtitle">Build decks. Remember more.</p>
          </div>
        </div>

        <nav className="nav-actions">
          {user ? (
            <>
              <span className="user-pill">{user.email}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-ghost"
                onClick={() => setPage("login")}
                disabled={page === "login"}
              >
                Login
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setPage("register")}
                disabled={page === "register"}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        {!user ? (
          page === "register" ? (
            <Register onRegister={handleLoggedIn} />
          ) : (
            <Login onLogin={handleLoggedIn} />
          )
        ) : (
          <Decks />
        )}
      </main>
    </div>
  );
}

export default App;
