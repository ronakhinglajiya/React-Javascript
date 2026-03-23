import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnAkSKB47XZ22ewIcCCpIrLxK8tMFxSC8",
  authDomain: "macrotrackingapp-c654d.firebaseapp.com",
  projectId: "macrotrackingapp-c654d",
  storageBucket: "macrotrackingapp-c654d.firebasestorage.app",
  messagingSenderId: "141350628192",
  appId: "1:141350628192:web:0068f15a8de465fc574c05"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
