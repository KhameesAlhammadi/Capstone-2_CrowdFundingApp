// firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Remove analytics import since it causes issues in React Native
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_Wl5OvCmq2F5WtlM9gNHVMpCplPWPGbQ",
  authDomain: "wefundeachother-17cd9.firebaseapp.com",
  databaseURL: "https://wefundeachother-17cd9-default-rtdb.firebaseio.com",
  projectId: "wefundeachother-17cd9",
  storageBucket: "wefundeachother-17cd9.firebasestorage.app",
  messagingSenderId: "825665064662",
  appId: "1:825665064662:web:7eabcb02c74db797fd8377",
  measurementId: "G-BGT1MB36FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Do not initialize analytics in a React Native environment
// const analytics = getAnalytics(app);

export const firebaseApp = app;
