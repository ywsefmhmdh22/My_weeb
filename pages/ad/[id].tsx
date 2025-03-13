import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/utils/firebaseConfig";
import { doc, getDoc, DocumentData } from "firebase/firestore";

export default function AdDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<DocumentData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const docRef = doc(db, "ads", Array.isArray(id) ? id[0] : id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setListing(docSnap.data());
          } else {
            setListing(null);
            setError(true);
          }
        } catch (err) {
          console.error("خطأ في جلب البيانات:", err);
          setError(true);
        }
      };

      fetchData();
    }
  }, [id]);

  if (error || !listing) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-2xl font-bold">
        🚫 الإعلان غير موجود
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 transition-all">
      <Head>
        <title>
          {listing?.title ? `${listing.title} - إعلانات مميزة` : "إعلان غير متاح - إعلانات مميزة"}
        </title>
        <meta name="description" content={listing?.description || "هذا الإعلان غير متاح."} />
      </Head>

      {/* ✅ حاوية المحتوى */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all">
        {/* ✅ صور الإعلان */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {listing?.images && listing.images.length > 0 ? (
            listing.images.map((img: string, index: number) => (
              <Image
                key={index}
                src={img}
                width={500}
                height={300}
                className="rounded-lg object-cover"
                alt={listing.title}
              />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">🚫 لا توجد صور متاحة</p>
          )}
        </motion.div>

        {/* ✅ تفاصيل الإعلان */}
        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{listing?.title}</h1>
          <p className="text-xl text-green-600 font-semibold mt-2">
            💰 {listing?.price} {listing?.currency}
          </p>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            📍 {listing?.location} | 👁 {listing?.views} مشاهدة | 📅 {listing?.posted}
          </p>

          {/* ✅ وصف الإعلان */}
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {listing?.description || "لا يوجد وصف متاح لهذا الإعلان."}
          </p>
        </motion.div>

        {/* ✅ معلومات البائع */}
        <motion.div
          className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">👤 معلومات البائع</h3>
          {listing?.seller ? (
            <>
              <p className="text-gray-700 dark:text-gray-300">🧑 {listing.seller.name}</p>
              <p className="text-gray-500 dark:text-gray-400">📅 عضو منذ {listing.seller.joined}</p>
              <p className="text-gray-500 dark:text-gray-400">📢 عدد الإعلانات: {listing.seller.adsCount}</p>
              <p className="text-yellow-500">⭐ التقييم: {listing.seller.rating}/5</p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">🚫 معلومات البائع غير متاحة</p>
          )}
        </motion.div>

        {/* ✅ زر التواصل مع البائع */}
        {listing?.seller && (
          <motion.button
            className="mt-4 w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition"
            whileHover={{ scale: 1.05 }}
            onClick={() =>
              router.push(`
                /contactSeller?sellerId=${listing.seller.id}&sellerName=${listing.seller.name}
              `)
            }
          >
            📩 تواصل مع البائع
          </motion.button>
        )}
      </div>
    </div>
  );
}