"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig"; // استيراد Firebase auth
import { db } from "@/utils/firebaseConfig"; // استيراد Firestore
import { doc, setDoc } from "firebase/firestore"; // دوال التعامل مع Firestore
import Link from "next/link";
import React from "react"; // إضافة الاستيراد لضمان تعرف TypeScript على React.FormEvent

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("خاص");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // تسجيل المستخدم في Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // حفظ بيانات المستخدم في Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        accountType: accountType,
        createdAt: new Date(),
      });

      alert("🎉 تم التسجيل بنجاح وحفظ البيانات في Firestore!");
    } catch (err) {
      setError((err as Error).message); // إضافة نوع الخطأ لضمان التوافق مع TypeScript
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      {/* الهيدر */}
      <header className="w-full bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">kleinanzeigen</h1>
        <Link href="/login">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200">
            تسجيل الدخول
          </button>
        </Link>
      </header>

      {/* نموذج التسجيل */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-6">
        <h2 className="text-xl font-semibold text-blue-600 text-center mb-4">
          سجل في 30 ثانية
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-gray-700">كيف ترغب في استخدام الإعلانات؟</label>
            <select
              className="w-full p-2 border rounded-md"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="خاص">خاص</option>
              <option value="تجاري">تجاري</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">كلمة المرور</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "جارٍ التسجيل..." : "سجل مجانًا"}
          </button>
        </form>
      </div>
    </div>
  );
}