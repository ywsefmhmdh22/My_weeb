import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// ✅ تعريف نوع البيانات الخاصة بالإعلانات
type Ad = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  views: number;
  posted: string;
};

export default function MyAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ads"));
        const adsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ad[]; // 🔥 تحويل البيانات إلى النوع Ad
        setAds(adsList);
      } catch (error) {
        console.error("خطأ في جلب الإعلانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const deleteAd = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ads", id));
      setAds((prevAds) => prevAds.filter((ad) => ad.id !== id));
    } catch (error) {
      console.error("خطأ في حذف الإعلان:", error);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
      <Head>
        <title>إعلاناتي | لوحة التحكم</title>
      </Head>

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">📢 إعلاناتي</h1>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">⏳ جاري تحميل الإعلانات...</p>
        ) : ads.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">❌ لا توجد إعلانات حاليًا.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {ads.map((ad: Ad) => ( // ✅ تحديد نوع الإعلان
              <motion.div
                key={ad.id}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image src={ad.image} width={300} height={200} className="rounded-lg" alt={ad.title} />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-2">{ad.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">{ad.description}</p>
                <p className="text-green-600 font-bold mt-1">
                  💰 {ad.price} {ad.currency}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">👁 {ad.views} مشاهدة | 📅 {ad.posted}</p>

                <div className="flex justify-between mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    ✏ تعديل
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={() => deleteAd(ad.id)}
                  >
                    🗑 حذف
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}