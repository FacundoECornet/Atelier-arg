import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "atelierhomesarg.firebaseapp.com",
  projectId: "atelierhomesarg",
  storageBucket: "atelierhomesarg.appspot.com",
  messagingSenderId: "REDACTED_ID",
  appId: "1:REDACTED_ID:web:e0d5353bb8715b1c8c4683",
  measurementId: "REDACTED_MEASUREMENT_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
