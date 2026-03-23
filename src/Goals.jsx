import { useState } from "react";
import { useMacro } from "./MacroContext";

const PRESETS = [
  {
    label: "Weight loss",
    description: "Moderate deficit, high protein",
    goals: { calories: 1600, protein: 140, carbs: 140, fat: 50 },
  },
  {
    label: "Maintenance",
    description: "Balanced macros for steady weight",
    goals: { calories: 2000, protein: 130, carbs: 200, fat: 65 },
  },
  {
    label: "Muscle gain",
    description: "Surplus calories, high protein",
    goals: { calories: 2600, protein: 180, carbs: 280, fat: 75 },
  },
  {
    label: "Performance",
    description: "High carb, moderate protein",
    goals: { calories: 2800, protein: 150, carbs: 360, fat: 65 },
  },
];

export default function Goals() {
  const { goals, updateGoals } = useMacro();
  const [form, setForm] = useState({ ...goals });
  const [saved, setSaved] = useState(false);

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: Number(e.target.value) || 0 }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    await updateGoals(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function applyPreset(preset) {
    setForm({ ...preset.goals });
    setSaved(false);
  }

  const calFromMacros = form.protein * 4 + form.carbs * 4 + form.fat * 9;
  const proteinPct =
    calFromMacros > 0
      ? Math.round(((form.protein * 4) / calFromMacros) * 100)
      : 0;
  const carbsPct =
    calFromMacros > 0
      ? Math.round(((form.carbs * 4) / calFromMacros) * 100)
      : 0;
  const fatPct =
    calFromMacros > 0 ? Math.round(((form.fat * 9) / calFromMacros) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">My Goals</div>
        <div className="page-sub">Set your daily macro targets</div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: 24 }}>
        <div className="log-section-title" style={{ marginBottom: 12 }}>
          Quick presets
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--accent-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--surface)";
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 2,
                  color: "var(--text)",
                }}
              >
                {p.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {p.description}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  marginTop: 6,
                  fontWeight: 600,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {p.goals.calories} kcal
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom goals form */}
      <form className="card" onSubmit={handleSave}>
        <div className="section-title" style={{ marginBottom: 16 }}>
          Custom goals
        </div>

        <div className="form-group">
          <label className="form-label">Daily calories (kcal)</label>
          <input
            className="form-input"
            name="calories"
            type="number"
            min="0"
            value={form.calories}
            onChange={handle}
          />
        </div>
        <div className="form-row" style={{ marginBottom: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Protein (g)</label>
            <input
              className="form-input"
              name="protein"
              type="number"
              min="0"
              value={form.protein}
              onChange={handle}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Carbohydrates (g)</label>
            <input
              className="form-input"
              name="carbs"
              type="number"
              min="0"
              value={form.carbs}
              onChange={handle}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Fat (g)</label>
          <input
            className="form-input"
            name="fat"
            type="number"
            min="0"
            value={form.fat}
            onChange={handle}
          />
        </div>

        {/* Live macro split preview */}
        <div
          className="card-sm"
          style={{ marginBottom: 16, background: "var(--surface2)" }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 10,
            }}
          >
            Macro split preview
          </div>
          <div
            style={{
              display: "flex",
              height: 10,
              borderRadius: 99,
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                flex: proteinPct,
                background: "var(--protein)",
                transition: "flex 0.3s",
              }}
            />
            <div
              style={{
                flex: carbsPct,
                background: "var(--carbs)",
                transition: "flex 0.3s",
              }}
            />
            <div
              style={{
                flex: fatPct,
                background: "var(--fat)",
                transition: "flex 0.3s",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <span style={{ color: "var(--protein)", fontWeight: 600 }}>
              Protein {proteinPct}%
            </span>
            <span style={{ color: "var(--carbs)", fontWeight: 600 }}>
              Carbs {carbsPct}%
            </span>
            <span style={{ color: "var(--fat)", fontWeight: 600 }}>
              Fat {fatPct}%
            </span>
          </div>
          <div
            style={{ fontSize: 11, color: "var(--text-hint)", marginTop: 8 }}
          >
            Macro calories: {calFromMacros} kcal (target: {form.calories} kcal)
          </div>
        </div>

        <button className="btn-primary" type="submit">
          {saved ? "✓ Goals saved!" : "Save goals"}
        </button>
      </form>

      {/* Active goals summary */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>
          Current active goals
        </div>
        <div className="goals-grid">
          {[
            {
              label: "Calories",
              val: goals.calories,
              unit: "kcal",
              color: "var(--cal)",
              bg: "var(--cal-light)",
            },
            {
              label: "Protein",
              val: goals.protein,
              unit: "g",
              color: "var(--protein)",
              bg: "var(--protein-light)",
            },
            {
              label: "Carbs",
              val: goals.carbs,
              unit: "g",
              color: "var(--carbs)",
              bg: "var(--carbs-light)",
            },
            {
              label: "Fat",
              val: goals.fat,
              unit: "g",
              color: "var(--fat)",
              bg: "var(--fat-light)",
            },
          ].map((g) => (
            <div
              key={g.label}
              style={{
                background: g.bg,
                borderRadius: "var(--radius-sm)",
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: g.color,
                  marginBottom: 4,
                }}
              >
                {g.label}
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                {g.val}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {g.unit} / day
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
