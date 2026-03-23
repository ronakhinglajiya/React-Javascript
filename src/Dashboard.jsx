import { useMacro } from "./MacroContext";

function clamp(v) {
  return Math.min(v, 100);
}

function Ring({ pct, color, size = 110, stroke = 11 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (clamp(pct) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e2ddd6"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function MacroStat({ label, current, goal, color, colorLight, unit = "g" }) {
  const pct = goal > 0 ? Math.round((current / goal) * 100) : 0;
  return (
    <div className="macro-card" style={{ background: colorLight }}>
      <div className="macro-label" style={{ color }}>
        {label}
      </div>
      <div className="macro-value">{Math.round(current)}</div>
      <div className="macro-goal">
        / {goal}
        {unit}
      </div>
      <div className="progress-bar" style={{ marginTop: 4 }}>
        <div
          className="progress-fill"
          style={{ width: `${clamp(pct)}%`, background: color }}
        />
      </div>
      <div style={{ fontSize: 11, color, fontWeight: 600 }}>{pct}%</div>
    </div>
  );
}

export default function Dashboard({ setPage }) {
  const {
    getTodayKey,
    getTotalsForDate,
    getLogsForDate,
    goals,
    removeFoodEntry,
  } = useMacro();
  const todayKey = getTodayKey();
  const totals = getTotalsForDate(todayKey);
  const entries = getLogsForDate(todayKey);
  const calPct =
    goals.calories > 0
      ? Math.round((totals.calories / goals.calories) * 100)
      : 0;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Today</div>
        <div className="page-sub">{today}</div>
      </div>

      {/* Calorie ring */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 16,
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Ring pct={calPct} color="var(--cal)" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 17,
                fontWeight: 700,
                color: "var(--cal)",
              }}
            >
              {Math.round(totals.calories)}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              kcal
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
            {calPct >= 100
              ? "Goal reached!"
              : `${goals.calories - Math.round(totals.calories)} kcal remaining`}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
              marginBottom: 14,
            }}
          >
            {Math.round(totals.calories)} of {goals.calories} kcal consumed
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              {
                label: "Protein",
                val: totals.protein,
                color: "var(--protein)",
              },
              { label: "Carbs", val: totals.carbs, color: "var(--carbs)" },
              { label: "Fat", val: totals.fat, color: "var(--fat)" },
            ].map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 2,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 14,
                    fontWeight: 700,
                    color: m.color,
                  }}
                >
                  {Math.round(m.val)}g
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Macro breakdown */}
      <div className="macro-summary">
        <MacroStat
          label="Calories"
          current={totals.calories}
          goal={goals.calories}
          color="var(--cal)"
          colorLight="var(--cal-light)"
          unit="kcal"
        />
        <MacroStat
          label="Protein"
          current={totals.protein}
          goal={goals.protein}
          color="var(--protein)"
          colorLight="var(--protein-light)"
        />
        <MacroStat
          label="Carbs"
          current={totals.carbs}
          goal={goals.carbs}
          color="var(--carbs)"
          colorLight="var(--carbs-light)"
        />
        <MacroStat
          label="Fat"
          current={totals.fat}
          goal={goals.fat}
          color="var(--fat)"
          colorLight="var(--fat-light)"
        />
      </div>

      {/* Today's food list */}
      <div className="card">
        <div className="section-header">
          <div className="section-title">Today's food</div>
          <button className="btn-small" onClick={() => setPage("log")}>
            + Add food
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🥗</div>
            <div className="empty-text">No food logged yet</div>
            <div className="empty-sub">
              Start adding meals to track your macros
            </div>
          </div>
        ) : (
          entries.map((e) => (
            <div className="food-entry" key={e.id}>
              <div>
                <div className="food-name">{e.name}</div>
                <div className="food-serving">{e.serving}</div>
              </div>
              <div className="food-macros">
                <span className="macro-pill protein">{e.protein}g P</span>
                <span className="macro-pill carbs">{e.carbs}g C</span>
                <span className="macro-pill fat">{e.fat}g F</span>
                <span className="food-cal">{e.calories} kcal</span>
                <button
                  className="btn-remove"
                  onClick={() => removeFoodEntry(todayKey, e.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
