import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        if (!form.name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        const { user } = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password,
        );
        await updateProfile(user, { displayName: form.name });
        // Create user document in Firestore with default goals
        await setDoc(doc(db, "users", user.uid), {
          name: form.name,
          email: form.email,
          goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      // onAuthStateChanged in App.jsx handles navigation automatically
    } catch (err) {
      const messages = {
        "auth/email-already-in-use":
          "An account with this email already exists.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-credential": "Invalid email or password.",
      };
      setError(messages[err.code] || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">macros.</div>
        <div className="auth-tagline">Track what fuels you.</div>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="Jane Smith"
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              placeholder="jane@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              value={form.password}
              onChange={handle}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              style={{
                background: "#fcebeb",
                color: "#a32d2d",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              {error}
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                className="auth-link"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="auth-link"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
