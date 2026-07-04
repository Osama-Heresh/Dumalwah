import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmheIHEN7Lq2o14sby6IZ5hoLm9hGfLvo",
  authDomain: "xenodochial-seat-8jlsj.firebaseapp.com",
  projectId: "xenodochial-seat-8jlsj",
  storageBucket: "xenodochial-seat-8jlsj.firebasestorage.app",
  messagingSenderId: "330270693518",
  appId: "1:330270693518:web:9cd2247dea078c6374d1df",
  databaseId: "ai-studio-abcb6da9-af60-4636-863b-65b8179a1271"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.databaseId);
