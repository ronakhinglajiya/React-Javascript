import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1a1714 0%, #2d2420 50%, #1a1714 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  split: {
    display: "flex",
    width: "100%",
    maxWidth: "900px",
    minHeight: "560px",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
  },
  left: {
    flex: 1,
    background:
      "linear-gradient(160deg, #c9622a 0%, #9e4a1e 60%, #7a3515 100%)",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  leftOverlay: {
    position: "absolute",
    top: "-60px",
    right: "-60px",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
  },
  leftOverlay2: {
    position: "absolute",
    bottom: "-80px",
    left: "-40px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
  },
  logo: {
    fontFamily: "monospace",
    fontSize: "28px",
    fontWeight: "700",
    color: "white",
    letterSpacing: "-1px",
    position: "relative",
    zIndex: 1,
  },
  leftContent: {
    position: "relative",
    zIndex: 1,
  },
  leftHeading: {
    fontSize: "32px",
    fontWeight: "700",
    color: "white",
    lineHeight: "1.2",
    marginBottom: "16px",
  },
  leftSub: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.75)",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  macroRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  macroBadge: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "white",
  },
  macroBadgeVal: {
    fontSize: "18px",
    fontWeight: "700",
    fontFamily: "monospace",
    display: "block",
  },
  macroBadgeLabel: {
    fontSize: "11px",
    opacity: 0.75,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  right: {
    flex: 1,
    background: "#faf8f5",
    padding: "48px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1714",
    marginBottom: "6px",
  },
  subheading: {
    fontSize: "14px",
    color: "#7a746d",
    marginBottom: "32px",
  },
  formGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    color: "#7a746d",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid #e2ddd6",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#1a1714",
    background: "white",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "#c9622a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: "4px",
    transition: "background 0.15s",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  toggle: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#7a746d",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#c9622a",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "inherit",
    textDecoration: "underline",
    padding: 0,
  },
};

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
        await setDoc(doc(db, "users", user.uid), {
          name: form.name,
          email: form.email,
          goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
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

  function switchMode() {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
    setForm({ name: "", email: "", password: "" });
  }

  const fields = [
    ...(mode === "signup"
      ? [
          {
            name: "name",
            label: "Full Name",
            type: "text",
            placeholder: "Jane Smith",
          },
        ]
      : []),
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "jane@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.split}>
        {/* Left decorative panel */}
        <div style={styles.left}>
          <div style={styles.leftOverlay} />
          <div style={styles.leftOverlay2} />
          <div style={styles.logo}>macros.</div>
          <div style={styles.leftContent}>
            <div style={styles.leftHeading}>
              Fuel your body.
              <br />
              Track your goals.
            </div>
            <div style={styles.leftSub}>
              Log meals, hit your macros, and stay consistent — all in one
              place.
            </div>
            <div style={styles.macroRow}>
              {[
                { val: "2,400", label: "Calories" },
                { val: "180g", label: "Protein" },
                { val: "240g", label: "Carbs" },
                { val: "70g", label: "Fat" },
              ].map((m) => (
                <div key={m.label} style={styles.macroBadge}>
                  <span style={styles.macroBadgeVal}>{m.val}</span>
                  <span style={styles.macroBadgeLabel}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div style={styles.right}>
          <div style={styles.heading}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </div>
          <div style={styles.subheading}>
            {mode === "login"
              ? "Sign in to continue tracking your macros"
              : "Start tracking your nutrition today"}
          </div>

          <form onSubmit={submit}>
            {fields.map((f) => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <input
                  style={{
                    ...styles.input,
                    borderColor:
                      focusedField === f.name ? "#c9622a" : "#e2ddd6",
                    boxShadow:
                      focusedField === f.name
                        ? "0 0 0 3px rgba(201,98,42,0.12)"
                        : "none",
                  }}
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handle}
                  onFocus={() => setFocusedField(f.name)}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            ))}

            {error && <div style={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                background: loading ? "#d4cdc7" : "#c9622a",
                cursor: loading ? "default" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#9e4a1e";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#c9622a";
              }}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <div style={styles.toggle}>
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button style={styles.toggleBtn} onClick={switchMode}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
