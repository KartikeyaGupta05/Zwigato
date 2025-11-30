// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "zwigato-971fe.firebaseapp.com",
  projectId: "zwigato-971fe",
  storageBucket: "zwigato-971fe.firebasestorage.app",
  messagingSenderId: "471827842003",
  appId: "471827842003:web:2db7dc7d270e81a3fee526",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
