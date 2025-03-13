"use client";

import React, { useState, useEffect } from "react";
import { FiTrash, FiRefreshCw, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig"; // تأكد من أن لديك ملف firebaseConfig.ts يحتوي على إعدادات Firebase

// ✅ تعريف نوع الإعلان
type Ad = {
  id: string;
  title: string;
  type: string;
  user: string;
  date: string;
  status: string;
};

export default function AdsDashboard() {
  const [ads, setAds] = useState<Ad[]>([]);

  // ✅ جلب الإعلانات من Firestore
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, "ads");
        const adsSnapshot = await getDocs(adsCollection);
        const adsList: Ad[] = adsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Ad, "id">), // تحويل البيانات إلى نوع Ad
        }));
        setAds(adsList);
      } catch (error) {
        console.error("خطأ في جلب الإعلانات:", error);
        toast.error("حدث خطأ أثناء تحميل الإعلانات.");
      }
    };

    fetchAds();
  }, []);

  // ✅ تحديث حالة الإعلان في Firestore
  const updateAdStatus = async (id: string, status: string) => {
    try {
      const adRef = doc(db, "ads", id);
      await updateDoc(adRef, { status });

      setAds((prevAds) =>
        prevAds.map((ad) => (ad.id === id ? { ...ad, status } : ad))
      );

      toast.success(`تم تحديث حالة الإعلان إلى: ${status}`);
    } catch (error) {
      console.error("خطأ في تحديث الإعلان:", error);
      toast.error("حدث خطأ أثناء تحديث الإعلان.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center animate-bounce">
        ⚡ إدارة الإعلانات (الصفحة النوبلية 🔥)
      </h1>

      {/* ✅ جدول الإعلانات */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">🆔 رقم الإعلان</th>
              <th className="py-3 px-6 text-left">📝 عنوان الإعلان</th>
              <th className="py-3 px-6 text-left">🏷 النوع</th>
              <th className="py-3 px-6 text-left">👤 المعلن</th>
              <th className="py-3 px-6 text-left">📅 تاريخ النشر</th>
              <th className="py-3 px-6 text-center">🔥 الحالة</th>
              <th className="py-3 px-6 text-center">⚙ التحكم</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr
                key={ad.id}
                className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <td className="py-4 px-6 font-semibold text-gray-800 dark:text-gray-200">
                  {ad.id}
                </td>
                <td className="py-4 px-6 font-semibold text-gray-800 dark:text-gray-200">
                  {ad.title}
                </td>
                <td className="py-4 px-6 font-semibold text-gray-800 dark:text-gray-200">
                  {ad.type}
                </td>
                <td className="py-4 px-6 font-semibold text-gray-800 dark:text-gray-200">
                  {ad.user}
                </td>
                <td className="py-4 px-6 font-semibold text-gray-800 dark:text-gray-200">
                  {ad.date}
                </td>
                <td className="py-4 px-6 text-center">
                  {ad.status === "نشط" && (
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      ✅ نشط
                    </span>
                  )}
                  {ad.status === "محذوف" && (
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                      🗑 محذوف
                    </span>
                  )}
                  {ad.status === "مغلق" && (
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      🚫 مغلق
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-center flex justify-center gap-2">
                  {ad.status !== "محذوف" && (
                    <button
                      onClick={() => updateAdStatus(ad.id, "محذوف")}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <FiTrash /> حذف
                    </button>
                  )}
                  {ad.status === "محذوف" && (
                    <button
                      onClick={() => updateAdStatus(ad.id, "نشط")}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <FiRefreshCw /> استرجاع
                    </button>
                  )}
                  {ad.status !== "مغلق" && (
                    <button
                      onClick={() => updateAdStatus(ad.id, "مغلق")}
                      className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <FiXCircle /> إغلاق
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}