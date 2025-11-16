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
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading…</p>;
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Flashcards</h1>

        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {user ? (
            <>
              <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                {user.email}
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPage("login")}
                disabled={page === "login"}
              >
                Login
              </button>
              <button
                onClick={() => setPage("register")}
                disabled={page === "register"}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <main>
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
