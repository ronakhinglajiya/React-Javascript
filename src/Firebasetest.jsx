// FirebaseTest.jsx
// ─────────────────────────────────────────────────────────────
// TEMPORARY FILE — delete this once Firebase is confirmed working
//
// HOW TO USE:
//   1. In App.jsx, temporarily replace the return statement with:
//        import FirebaseTest from "./FirebaseTest";
//        return <FirebaseTest />;
//   2. Run the app and follow the on-screen steps
//   3. Once all 3 checks show green, delete this file and revert App.jsx
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const STATUS = { idle: "⬜", running: "🔄", pass: "✅", fail: "❌" };

export default function FirebaseTest() {
  const TEST_EMAIL = `test_${Date.now()}@macrotest.dev`;
  const TEST_PASS = "TestPass123";

  const [results, setResults] = useState({
    auth: { status: "idle", msg: "Not run yet" },
    firestore: { status: "idle", msg: "Not run yet" },
    cleanup: { status: "idle", msg: "Not run yet" },
  });
  const [running, setRunning] = useState(false);

  function setResult(key, status, msg) {
    setResults((r) => ({ ...r, [key]: { status, msg } }));
  }

  async function runTests() {
    setRunning(true);
    let uid = null;

    // ── Test 1: Firebase Auth ──────────────────────────────
    setResult("auth", "running", "Creating test account...");
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        TEST_EMAIL,
        TEST_PASS,
      );
      uid = user.uid;
      await signOut(auth);
      await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASS);
      setResult("auth", "pass", `Signed up + signed in as ${TEST_EMAIL}`);
    } catch (err) {
      setResult("auth", "fail", `${err.code}: ${err.message}`);
      setRunning(false);
      return;
    }

    // ── Test 2: Firestore read/write ───────────────────────
    setResult("firestore", "running", "Writing and reading test document...");
    try {
      const ref = doc(db, "users", uid);
      await setDoc(ref, {
        name: "Test User",
        createdAt: new Date().toISOString(),
      });
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().name === "Test User") {
        setResult("firestore", "pass", "Write + read successful");
      } else {
        setResult(
          "firestore",
          "fail",
          "Document written but data didn't match on read",
        );
      }
    } catch (err) {
      setResult("firestore", "fail", `${err.code}: ${err.message}`);
      setRunning(false);
      return;
    }

    // ── Test 3: Cleanup ────────────────────────────────────
    setResult("cleanup", "running", "Deleting test data...");
    try {
      await deleteDoc(doc(db, "users", uid));
      await signOut(auth);
      setResult("cleanup", "pass", "Test document deleted, signed out");
    } catch (err) {
      setResult(
        "cleanup",
        "fail",
        `Cleanup failed (not critical): ${err.message}`,
      );
    }

    setRunning(false);
  }

  const allPass = Object.values(results).every((r) => r.status === "pass");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f5f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          border: "1px solid #e2ddd6",
          borderRadius: 12,
          padding: 32,
          width: "100%",
          maxWidth: 480,
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 18,
            fontWeight: 700,
            color: "#c9622a",
            marginBottom: 4,
          }}
        >
          macros. — Firebase test
        </div>
        <div style={{ fontSize: 13, color: "#7a746d", marginBottom: 24 }}>
          Runs 3 checks: Auth signup/login · Firestore read/write · Cleanup
        </div>

        {/* Results */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            { key: "auth", label: "Firebase Authentication" },
            { key: "firestore", label: "Firestore Database" },
            { key: "cleanup", label: "Cleanup" },
          ].map(({ key, label }) => {
            const r = results[key];
            return (
              <div
                key={key}
                style={{
                  background:
                    r.status === "pass"
                      ? "#e8f2eb"
                      : r.status === "fail"
                        ? "#fcebeb"
                        : "#f7f5f0",
                  borderRadius: 8,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{STATUS[r.status]}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
                </div>
                <div
                  style={{ fontSize: 12, color: "#7a746d", paddingLeft: 26 }}
                >
                  {r.msg}
                </div>
              </div>
            );
          })}
        </div>

        {allPass && (
          <div
            style={{
              background: "#e8f2eb",
              color: "#4a7c59",
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            🎉 All tests passed! Firebase is working correctly.
            <div style={{ fontWeight: 400, marginTop: 4 }}>
              You can now delete FirebaseTest.jsx and revert App.jsx.
            </div>
          </div>
        )}

        <button
          onClick={runTests}
          disabled={running}
          style={{
            width: "100%",
            padding: 12,
            background: running ? "#e2ddd6" : "#c9622a",
            color: running ? "#7a746d" : "white",
            border: "none",
            borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            cursor: running ? "default" : "pointer",
          }}
        >
          {running
            ? "Running tests..."
            : allPass
              ? "Run again"
              : "Run Firebase tests"}
        </button>

        <div
          style={{
            fontSize: 11,
            color: "#b0a89f",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          This creates and immediately deletes a temporary test account.
        </div>
      </div>
    </div>
  );
}
