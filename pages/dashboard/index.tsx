import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FiUsers, FiSettings, FiTag } from "react-icons/fi";

export default function Dashboard() {
  const [users, setUsers] = useState(0);
  const [ads, setAds] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const adsSnap = await getDocs(collection(db, "ads"));

        setUsers(usersSnap.size);
        setAds(adsSnap.size);
      } catch (error) {
        console.error("❌ خطأ في جلب البيانات:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* ✅ القائمة الجانبية */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-500">🚀 Dashboard</h2>
        <NavItem icon={<FiUsers />} label="المستخدمون" onClick={() => router.push("users")} />
        <NavItem icon={<FiTag />} label="الإعلانات" onClick={() => router.push("ads")} />
        <NavItem icon={<FiSettings />} label="الإعدادات" onClick={() => router.push("rret")} />
        <NavItem icon={<FiSettings />} label="المدفوعات " onClick={() => router.push("paymentss")}/>
      </aside>

      {/* ✅ المحتوى الرئيسي */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-4">📊 نظرة عامة</h1>
        <div className="grid grid-cols-2 gap-6">
          <StatCard title="عدد المستخدمين" value={users} />
          <StatCard title="عدد الإعلانات" value={ads} />
        </div>
      </main>
    </div>
  );
}

/* ✅ مكوّن عنصر القائمة الجانبية */
function NavItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center p-3 text-lg font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-all"
    >
      <span className="text-xl mr-3">{icon}</span>
      {label}
    </button>
  );
}

/* ✅ مكوّن البطاقة الإحصائية */
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-blue-500">{value.toLocaleString()}</p>
    </div>
  );
}