import { useState, useEffect } from "react";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    // التحقق من تسجيل دخول المستخدم
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchFavorites(user.uid);
      } else {
        setUserId(null);
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // جلب الإعلانات المفضلة من Firestore
  const fetchFavorites = async (userId: string) => {
    try {
      const favCollection = collection(db, "users", userId, "favorites");
      const querySnapshot = await getDocs(favCollection);
      const favData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favData);
    } catch (error) {
      console.error("خطأ في جلب المفضلات:", error);
    }
  };

  // إزالة إعلان من المفضلة
  const removeFavorite = async (id: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, "users", userId, "favorites", id));
      setFavorites(favorites.filter((ad) => ad.id !== id));
    } catch (error) {
      console.error("خطأ في حذف الإعلان:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">⭐ إعلاناتي المفضلة</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-lg text-gray-300">❌ لا توجد إعلانات مفضلة حتى الآن.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((ad) => (
            <div key={ad.id} className="bg-gray-800 p-5 rounded-lg shadow-lg">
              <img src={ad.image} alt={ad.title} className="w-full h-40 object-cover rounded-lg mb-4" />
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