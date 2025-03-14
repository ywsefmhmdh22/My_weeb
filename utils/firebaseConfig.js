import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ إضافة الاستيراد الصحيح

const firebaseConfig = {
  apiKey: "AIzaSyAes1Jp55lBihDdsB5A1oIilupPMls78oM",
  authDomain: "aldaher-efd2c.firebaseapp.com",
  projectId: "aldaher-efd2c",
  storageBucket: "aldaher-efd2c.appspot.com",
  messagingSenderId: "642390804624",
  appId: "1:642390804624:web:d1ab49e70936a845117015",
  measurementId: "G-1B0W6Z2QE1",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ تعريف storage بشكل صحيح

export { app, auth, db, storage };