import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@/utils/firebaseConfig"; // استيراد فايربيز
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Settings() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [paymentMethod, setPaymentMethod] = useState("");
  const user = auth.currentUser; // الحصول على المستخدم الحالي

  useEffect(() => {
    if (user) {
      const fetchSettings = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setDarkMode(data.darkMode);
          setLanguage(data.language);
          setPaymentMethod(data.paymentMethod);
        }
      };

      fetchSettings();
    }
  }, [user]);

  const updateSettings = async (key: string, value: any) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { [key]: value }, { merge: true });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    updateSettings("darkMode", !darkMode);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    updateSettings("language", lang);
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>

      <div className="space-y-4">
        <button onClick={() => router.push("/profile")} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 transition">
          إعدادات الملف الشخصي
        </button>

        <button onClick={toggleDarkMode} className="w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-600 transition">
          {darkMode ? "إيقاف الوضع الليلي" : "تشغيل الوضع الليلي"}
        </button>

        <select value={language} onChange={(e) => changeLanguage(e.target.value)} className="w-full p-3 rounded-lg bg-gray-200">
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>

        <button onClick={() => router.push("/privacy")} className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 transition">
          إعدادات الخصوصية
        </button>

        <button onClick={() => router.push("/payment-settings")} className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition">
          إعدادات الدفع (طريقة الدفع الحالية: {paymentMethod || "غير محددة"})
        </button>
      </div>
    </div>
  );
}