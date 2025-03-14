import { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// واجهة بيانات الإعلان
interface Ad {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Ad[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // التحقق من تسجيل دخول المستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]); // ✅ إضافة auth إلى التبعيات

  // جلب الإعلانات المفضلة عند تغير userId
  useEffect(() => {
    if (userId) {
      fetchFavorites(userId);
    }
  }, [userId]);

  const fetchFavorites = async (userId: string) => {
    try {
      setLoading(true);
      const favCollection = collection(db, "users", userId, "favorites");
      const querySnapshot = await getDocs(favCollection);
      const favData: Ad[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Ad, "id">; // إزالة id من البيانات القادمة من Firestore
        return { id: doc.id, ...data }; // إضافة id من Firestore
      });
      setFavorites(favData);
    } catch (error) {
      console.error("❌ خطأ في جلب المفضلات:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, "users", userId, "favorites", id));
      setFavorites((prev) => prev.filter((ad) => ad.id !== id));
    } catch (error) {
      console.error("❌ خطأ في حذف الإعلان:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">⭐ إعلاناتي المفضلة</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-300">⏳ جاري تحميل الإعلانات...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-lg text-gray-300">❌ لا توجد إعلانات مفضلة حتى الآن.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((ad) => (
            <div key={ad.id} className="bg-gray-800 p-5 rounded-lg shadow-lg">
              {ad.image ? (
                <Image
                  src={ad.image}
                  alt={ad.title}
                  width={300}
                  height={200}
                  objectFit="cover"
                  className="rounded-lg mb-4"
                  unoptimized // ✅ إضافة unoptimized لحل مشكلة Next.js مع الصور الخارجية
                />
              ) : (
                <div className="w-full h-40 bg-gray-700 flex items-center justify-center rounded-lg mb-4">
                  📷 لا توجد صورة
                </div>
              )}
              <h2 className="text-2xl font-bold">{ad.title}</h2>
              <p className="text-gray-300">{ad.description}</p>
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => removeFavorite(ad.id)} 
                  className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-800 transition"
                >
                  ❌ إزالة من المفضلة
                </button>
                <a 
                  href={`/ad/${ad.id}`} 
                  className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  🔍 عرض الإعلان
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}