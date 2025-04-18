// Import only what's needed
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_Wl5OvCmq2F5WtlM9gNHVMpCplPWPGbQ",
  authDomain: "wefundeachother-17cd9.firebaseapp.com",
  databaseURL: "https://wefundeachother-17cd9-default-rtdb.firebaseio.com",
  projectId: "wefundeachother-17cd9",
  storageBucket: "wefundeachother-17cd9.firebasestorage.app",
  messagingSenderId: "825665064662",
  appId: "1:825665064662:web:7eabcb02c74db797fd8377",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore

export { auth, db }; // ✅ Export Firestore too
