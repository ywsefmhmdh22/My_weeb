import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; icon?: string }[]>([]);
  const [ads, setAds] = useState<{ id: string; title: string; description: string; imageUrl?: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = collection(db, "categories");
        const snapshot = await getDocs(categoriesRef);
        const categoryList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "بدون اسم",
            icon: data.icon ? data.icon.toString() : "📁", // ✅ تحويل الرقم إلى نص
          };
        });
        setCategories(categoryList);
      } catch (error) {
        console.error("❌ خطأ في جلب الفئات:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsRef = collection(db, "ads");
        let q = selectedCategory ? query(adsRef, where("category", "==", selectedCategory)) : adsRef;
        const snapshot = await getDocs(q);

        const adList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "إعلان بدون عنوان",
            description: data.description || "لا يوجد وصف متاح.",
            imageUrl: data.imageUrl || "https://via.placeholder.com/150",
          };
        });

        setAds(adList);
      } catch (error) {
        console.error("❌ خطأ في جلب الإعلانات:", error);
      }
    };

    fetchAds();
  }, [selectedCategory]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>aldaher Clone</title>
      </Head>

      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">aldaher</Link>
        </h1>
        <div className="flex items-center">
          <Link href="/add-ad">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded mr-2">
              + إضافة إعلان
            </button>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="ml-4 text-2xl">
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="absolute right-4 top-16 bg-white shadow-lg p-4 rounded">
          <Link href="/news" className="block py-2 hover:text-blue-600">📰 الأخبار</Link>
          <Link href="/my-ads" className="block py-2 hover:text-blue-600">📌 إعلاناتي</Link>
          <Link href="/settings" className="block py-2 hover:text-blue-600">⚙ الإعدادات</Link>
          <Link href="/favorites" className="block py-2 hover:text-blue-600">❤ المفضلة</Link>
        </div>
      )}

      <div className="bg-blue-500 p-4 text-white flex justify-center">
        <input
          type="text"
          placeholder="🔍 ماذا تبحث عن؟"
          className="w-2/3 p-2 text-black rounded"
        />
        <button className="bg-black px-4 py-2 ml-2">بحث</button>
      </div>

      <div className="container mx-auto p-4 flex">
        <aside className="w-1/4 bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-bold mb-2">📂 الفئات</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`cursor-pointer hover:text-blue-600 ${
                  selectedCategory === category.name ? "font-bold text-blue-700" : ""
                }`}
              >
                {category.icon} {category.name}
              </li>
            ))}
          </ul>
        </aside>

        <main className="w-3/4 grid grid-cols-3 gap-4 ml-4">
          {ads.length > 0 ? (
            ads.map((ad) => (
              <Link key={ad.id} href={`/ad/${ad.id}`}>
                <div className="bg-white p-4 rounded shadow-md cursor-pointer">
                  <img
                    src={ad.imageUrl || "https://via.placeholder.com/150"}
                    alt="إعلان"
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="mt-2 font-bold">📌 {ad.title}</h3>
                  <p className="text-gray-600">{ad.description}</p>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                    عرض التفاصيل
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">🚀 لا توجد إعلانات في هذه الفئة.</p>
          )}
        </main>
      </div>
    </div>
  );
}