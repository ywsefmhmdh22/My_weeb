import { useState, useEffect } from "react";
import { db, doc, getDoc, setDoc } from "@/utils/firebaseConfig"; // 🔹 استيراد Firestore
import { getAuth } from "firebase/auth"; // 🔹 لإحضار بيانات المستخدم

export default function PrivacySettings() {
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [searchVisibility, setSearchVisibility] = useState(true);
  const [adPersonalization, setAdPersonalization] = useState(true);
  const [dataDownload, setDataDownload] = useState(false);
  const [autoDelete, setAutoDelete] = useState("never");
  const auth = getAuth(); // 🔹 جلب المستخدم الحالي

  // 🟢 جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth.currentUser) return; // 🔹 إذا لم يكن هناك مستخدم مسجل، لا تفعل شيئًا
      const userId = auth.currentUser.uid;
      const docRef = doc(db, "privacySettings", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileVisibility(data.profileVisibility || "public");
        setSearchVisibility(data.searchVisibility ?? true);
        setAdPersonalization(data.adPersonalization ?? true);
        setDataDownload(data.dataDownload ?? false);
        setAutoDelete(data.autoDelete || "never");
      }
    };

    fetchSettings();
  }, [auth.currentUser]);

  // 🟢 حفظ البيانات إلى Firebase
  const handleSave = async () => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const docRef = doc(db, "privacySettings", userId);

    await setDoc(docRef, {
      profileVisibility,
      searchVisibility,
      adPersonalization,
      dataDownload,
      autoDelete
    });

    alert("✅ تم حفظ إعدادات الخصوصية بنجاح!");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">🔒 إعدادات الخصوصية</h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* رؤية الملف الشخصي */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <label className="block text-lg mb-2">👀 من يمكنه رؤية ملفك الشخصي؟</label>
          <select
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
          >
            <option value="public">الجميع</option>
            <option value="friends">الأصدقاء فقط</option>
            <option value="private">أنا فقط</option>
          </select>
        </div>

        {/* البحث عن الحساب */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex items-center justify-between">
          <span className="text-lg">🔍 السماح بالبحث عن حسابي</span>
          <input type="checkbox" checked={searchVisibility} onChange={() => setSearchVisibility(!searchVisibility)} className="w-5 h-5"/>
        </div>

        {/* تخصيص الإعلانات */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex items-center justify-between">
          <span className="text-lg">🎯 تخصيص الإعلانات بناءً على بياناتي</span>
          <input type="checkbox" checked={adPersonalization} onChange={() => setAdPersonalization(!adPersonalization)} className="w-5 h-5"/>
        </div>

        {/* تحميل البيانات */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex items-center justify-between">
          <span className="text-lg">📥 السماح بتحميل جميع بياناتي</span>
          <input type="checkbox" checked={dataDownload} onChange={() => setDataDownload(!dataDownload)} className="w-5 h-5"/>
        </div>

        {/* حذف البيانات تلقائيًا */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <label className="block text-lg mb-2">🗑 حذف بياناتي تلقائيًا بعد:</label>
          <select value={autoDelete} onChange={(e) => setAutoDelete(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white">
            <option value="never">عدم الحذف</option>
            <option value="6months">6 أشهر</option>
            <option value="1year">سنة واحدة</option>
            <option value="2years">سنتين</option>
          </select>
        </div>

        {/* زر الحفظ */}
        <button onClick={handleSave} className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-800 transition text-lg font-bold">
          💾 حفظ التغييرات
        </button>
      </div>
    </div>
  );
}