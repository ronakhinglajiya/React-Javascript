import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import FoodLog from "./FoodLog";
import Goals from "./Goals";
import Nav from "./Nav";
import { MacroProvider } from "./MacroContext";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsub();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setPage("dashboard");
  }

  // Still checking auth state — show splash
  if (user === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f5f0",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 22,
            fontWeight: 700,
            color: "#c9622a",
          }}
        >
          macros.
        </div>
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <MacroProvider user={user}>
      <div className="app">
        <Nav
          page={page}
          setPage={setPage}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          {page === "dashboard" && <Dashboard setPage={setPage} />}
          {page === "log" && <FoodLog />}
          {page === "goals" && <Goals />}
        </main>
      </div>
    </MacroProvider>
  );
}
