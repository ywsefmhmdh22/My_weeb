"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig"; // استيراد Firebase auth
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ تسجيل الدخول ناجح!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("❌ " + err.message);
      } else {
        setError("❌ حدث خطأ غير معروف.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      {/* شريط التنقل العلوي */}
      <div className="w-full bg-blue-600 p-4 text-white text-center text-lg font-bold">
        <span className="text-white">kleinanzeigen</span>
      </div>

      {/* صندوق تسجيل الدخول */}
      <div className="bg-white p-6 shadow-lg rounded-md w-96">
        <h2 className="text-center text-xl font-semibold mb-4 text-gray-700">تسجيل الدخول</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* حقل البريد الإلكتروني */}
          <div>
            <label className="block text-gray-600 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className="block text-gray-600 mb-1">كلمة المرور</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {/* رابط استعادة كلمة المرور */}
        <div className="mt-4 text-center">
          <Link href="#" className="text-blue-600 text-sm">
            هل نسيت كلمة المرور؟
          </Link>
        </div>

        {/* رابط إنشاء حساب جديد */}
        <div className="mt-2 text-center">
          <span className="text-gray-600 text-sm">ليس لديك حساب؟ </span>
          <Link href="/register" className="text-blue-600 text-sm font-semibold">
            سجل الآن
          </Link>
        </div>
      </div>
    </div>
  );
}