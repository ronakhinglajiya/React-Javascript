import { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

const MacroContext = createContext(null);

const DEFAULT_GOALS = { calories: 2000, protein: 150, carbs: 200, fat: 65 };

export function MacroProvider({ children, user }) {
  const uid = user.uid;
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [logs, setLogs] = useState({});
  const [loadingGoals, setLoadingGoals] = useState(true);

  // Load user goals from Firestore once on mount
  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (snap.exists() && snap.data().goals) setGoals(snap.data().goals);
      setLoadingGoals(false);
    });
  }, [uid]);

  // Real-time listener for all food log entries
  useEffect(() => {
    if (!uid) return;
    const logsRef = collection(db, "users", uid, "logs");
    const unsub = onSnapshot(logsRef, (snapshot) => {
      const newLogs = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const dk = data.dateKey;
        if (!newLogs[dk]) newLogs[dk] = [];
        newLogs[dk].push({ ...data, id: docSnap.id });
      });
      setLogs(newLogs);
    });
    return () => unsub();
  }, [uid]);

  function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function getLogsForDate(dateKey) {
    return logs[dateKey] || [];
  }

  async function addFoodEntry(dateKey, entry) {
    await addDoc(collection(db, "users", uid, "logs"), {
      ...entry,
      dateKey,
      createdAt: new Date().toISOString(),
    });
  }

  async function removeFoodEntry(dateKey, id) {
    await deleteDoc(doc(db, "users", uid, "logs", id));
  }

  function getTotalsForDate(dateKey) {
    return getLogsForDate(dateKey).reduce(
      (acc, e) => ({
        calories: acc.calories + (Number(e.calories) || 0),
        protein: acc.protein + (Number(e.protein) || 0),
        carbs: acc.carbs + (Number(e.carbs) || 0),
        fat: acc.fat + (Number(e.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }

  async function updateGoals(newGoals) {
    setGoals(newGoals); // optimistic update
    await updateDoc(doc(db, "users", uid), { goals: newGoals });
  }

  return (
    <MacroContext.Provider
      value={{
        logs,
        goals,
        loadingGoals,
        getTodayKey,
        getLogsForDate,
        addFoodEntry,
        removeFoodEntry,
        getTotalsForDate,
        updateGoals,
      }}
    >
      {children}
    </MacroContext.Provider>
  );
}

export function useMacro() {
  return useContext(MacroContext);
}
