import { useState } from "react";
import { useMacro } from "./MacroContext";

const COMMON_FOODS = [
  {
    name: "Chicken Breast",
    serving: "100g",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {
    name: "White Rice (cooked)",
    serving: "100g",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
  },
  {
    name: "Whole Egg",
    serving: "1 large",
    calories: 78,
    protein: 6,
    carbs: 0.6,
    fat: 5,
  },
  {
    name: "Banana",
    serving: "1 medium",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
  },
  {
    name: "Greek Yogurt (plain)",
    serving: "100g",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
  },
  {
    name: "Oats (dry)",
    serving: "100g",
    calories: 389,
    protein: 17,
    carbs: 66,
    fat: 7,
  },
  {
    name: "Avocado",
    serving: "100g",
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
  },
  {
    name: "Salmon (cooked)",
    serving: "100g",
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
  },
  {
    name: "Whole Milk",
    serving: "250ml",
    calories: 150,
    protein: 8,
    carbs: 12,
    fat: 8,
  },
  {
    name: "Almonds",
    serving: "30g",
    calories: 174,
    protein: 6,
    carbs: 6,
    fat: 15,
  },
  {
    name: "Brown Rice (cooked)",
    serving: "100g",
    calories: 112,
    protein: 2.6,
    carbs: 24,
    fat: 0.9,
  },
  {
    name: "Broccoli",
    serving: "100g",
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
  },
  {
    name: "Cheddar Cheese",
    serving: "30g",
    calories: 120,
    protein: 7,
    carbs: 0.4,
    fat: 10,
  },
  {
    name: "Sweet Potato",
    serving: "100g",
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
  },
  {
    name: "Tuna (canned)",
    serving: "100g",
    calories: 116,
    protein: 26,
    carbs: 0,
    fat: 1,
  },
  {
    name: "Peanut Butter",
    serving: "2 tbsp",
    calories: 188,
    protein: 8,
    carbs: 6,
    fat: 16,
  },
  {
    name: "Cottage Cheese",
    serving: "100g",
    calories: 98,
    protein: 11,
    carbs: 3.4,
    fat: 4.3,
  },
  {
    name: "Lentils (cooked)",
    serving: "100g",
    calories: 116,
    protein: 9,
    carbs: 20,
    fat: 0.4,
  },
  {
    name: "Blueberries",
    serving: "100g",
    calories: 57,
    protein: 0.7,
    carbs: 14,
    fat: 0.3,
  },
  {
    name: "Olive Oil",
    serving: "1 tbsp",
    calories: 119,
    protein: 0,
    carbs: 0,
    fat: 14,
  },
];

const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

function formatDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function offsetDate(dateKey, days) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d + days).toISOString().slice(0, 10);
}

export default function FoodLog() {
  const {
    getTodayKey,
    getLogsForDate,
    addFoodEntry,
    removeFoodEntry,
    getTotalsForDate,
  } = useMacro();
  const [dateKey, setDateKey] = useState(getTodayKey);
  const [meal, setMeal] = useState("Breakfast");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("search");
  const [custom, setCustom] = useState({
    name: "",
    serving: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const isToday = dateKey === getTodayKey();
  const entries = getLogsForDate(dateKey);
  const totals = getTotalsForDate(dateKey);

  const filtered = search.trim()
    ? COMMON_FOODS.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  function quickAdd(food) {
    addFoodEntry(dateKey, { ...food, meal });
    setSearch("");
  }

  function handleCustom(e) {
    setCustom((c) => ({ ...c, [e.target.name]: e.target.value }));
  }

  function submitCustom(e) {
    e.preventDefault();
    if (!custom.name || !custom.calories) return;
    addFoodEntry(dateKey, {
      name: custom.name,
      serving: custom.serving || "1 serving",
      calories: Number(custom.calories) || 0,
      protein: Number(custom.protein) || 0,
      carbs: Number(custom.carbs) || 0,
      fat: Number(custom.fat) || 0,
      meal,
    });
    setCustom({
      name: "",
      serving: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    });
  }

  const byMeal = MEALS.reduce((acc, m) => {
    acc[m] = entries.filter((e) => e.meal === m);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Food Log</div>
        <div className="page-sub">Track your meals and macros</div>
      </div>

      {/* Date navigation */}
      <div className="date-nav">
        <button onClick={() => setDateKey((k) => offsetDate(k, -1))}>‹</button>
        <div className="date-label">
          {isToday ? "Today" : formatDate(dateKey)}
        </div>
        <button
          onClick={() => setDateKey((k) => offsetDate(k, 1))}
          disabled={isToday}
          style={{ opacity: isToday ? 0.35 : 1 }}
        >
          ›
        </button>
      </div>

      {/* Daily totals bar */}
      <div
        className="card-sm"
        style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}
      >
        {[
          {
            label: "Calories",
            val: totals.calories,
            unit: "kcal",
            color: "var(--cal)",
          },
          {
            label: "Protein",
            val: totals.protein,
            unit: "g",
            color: "var(--protein)",
          },
          {
            label: "Carbs",
            val: totals.carbs,
            unit: "g",
            color: "var(--carbs)",
          },
          { label: "Fat", val: totals.fat, unit: "g", color: "var(--fat)" },
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
                fontSize: 15,
                fontWeight: 700,
                color: m.color,
              }}
            >
              {Math.round(m.val)}
              {m.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Meal selector */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}
      >
        {MEALS.map((m) => (
          <button
            key={m}
            onClick={() => setMeal(m)}
            style={{
              padding: "6px 14px",
              border: "1px solid",
              borderColor: meal === m ? "var(--accent)" : "var(--border)",
              borderRadius: 99,
              background: meal === m ? "var(--accent)" : "transparent",
              color: meal === m ? "white" : "var(--text-muted)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Add food panel */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="tabs">
          <button
            className={`tab-btn ${tab === "search" ? "active" : ""}`}
            onClick={() => setTab("search")}
          >
            Search foods
          </button>
          <button
            className={`tab-btn ${tab === "custom" ? "active" : ""}`}
            onClick={() => setTab("custom")}
          >
            Custom entry
          </button>
        </div>

        {tab === "search" && (
          <div>
            <input
              className="form-input"
              placeholder="Search foods (e.g. chicken, rice, banana...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            {filtered.length > 0 && (
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {filtered.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderBottom:
                        i < filtered.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      background: "var(--surface)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {f.serving} · {f.protein}g P · {f.carbs}g C · {f.fat}g F
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {f.calories} kcal
                      </span>
                      <button className="btn-small" onClick={() => quickAdd(f)}>
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {search.trim() && filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: 14,
                  padding: "20px 0",
                }}
              >
                No results. Try a custom entry instead.
              </div>
            )}
          </div>
        )}

        {tab === "custom" && (
          <form onSubmit={submitCustom}>
            <div className="form-row" style={{ marginBottom: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Food name *</label>
                <input
                  className="form-input"
                  name="name"
                  value={custom.name}
                  onChange={handleCustom}
                  placeholder="e.g. Grilled chicken"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Serving size</label>
                <input
                  className="form-input"
                  name="serving"
                  value={custom.serving}
                  onChange={handleCustom}
                  placeholder="e.g. 150g"
                />
              </div>
            </div>
            <div className="form-row-4" style={{ marginBottom: 14 }}>
              {[
                { key: "calories", label: "Calories *" },
                { key: "protein", label: "Protein (g)" },
                { key: "carbs", label: "Carbs (g)" },
                { key: "fat", label: "Fat (g)" },
              ].map(({ key, label }) => (
                <div
                  className="form-group"
                  key={key}
                  style={{ marginBottom: 0 }}
                >
                  <label className="form-label">{label}</label>
                  <input
                    className="form-input"
                    name={key}
                    type="number"
                    min="0"
                    step="0.1"
                    value={custom[key]}
                    onChange={handleCustom}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <button
              className="btn-primary"
              type="submit"
              disabled={!custom.name || !custom.calories}
            >
              Add to {meal}
            </button>
          </form>
        )}
      </div>

      {/* Food entries grouped by meal */}
      {MEALS.map((m) => {
        const mEntries = byMeal[m];
        if (mEntries.length === 0) return null;
        const mTotal = mEntries.reduce(
          (acc, e) => ({
            calories: acc.calories + e.calories,
            protein: acc.protein + e.protein,
            carbs: acc.carbs + e.carbs,
            fat: acc.fat + e.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        );
        return (
          <div className="card" key={m} style={{ marginBottom: 12 }}>
            <div className="section-header" style={{ marginBottom: 8 }}>
              <div className="section-title">{m}</div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 13,
                  color: "var(--cal)",
                  fontWeight: 700,
                }}
              >
                {Math.round(mTotal.calories)} kcal
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              P: {Math.round(mTotal.protein)}g · C: {Math.round(mTotal.carbs)}g
              · F: {Math.round(mTotal.fat)}g
            </div>
            {mEntries.map((e) => (
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
                    onClick={() => removeFoodEntry(dateKey, e.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {entries.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">
            Nothing logged for {isToday ? "today" : formatDate(dateKey)}
          </div>
          <div className="empty-sub">
            Search a food above or enter a custom meal
          </div>
        </div>
      )}
    </div>
  );
}
