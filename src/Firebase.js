import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPJefZTfomIZq6YrBddho8ddjJpDNTY3Q",
  authDomain: "atelierhomesarg.firebaseapp.com",
  projectId: "atelierhomesarg",
  storageBucket: "atelierhomesarg.appspot.com",
  messagingSenderId: "639541890234",
  appId: "1:639541890234:web:e0d5353bb8715b1c8c4683",
  measurementId: "G-JNKCG2H10L"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
