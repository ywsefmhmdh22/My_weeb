import { useState, useEffect } from "react";
import { db, storage } from "@/utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import Image from "next/image";

export default function ProfileSettings() {
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [userId, setUserId] = useState<string | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchProfileData(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfileData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileImage(data.profileImage || "/default-avatar.png");
        setName(data.name || "");
        setEmail(data.email || "");
        setLanguage(data.language || "ar");
        setDarkMode(data.darkMode || false);
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      await setDoc(doc(db, "users", userId), {
        profileImage,
        name,
        email,
        language,
        darkMode,
      });

      if (auth.currentUser) {
        if (auth.currentUser.email !== email) {
          await updateEmail(auth.currentUser, email);
        }
        if (password) {
          await updatePassword(auth.currentUser, password);
        }
      }

      alert("تم حفظ التغييرات بنجاح!");
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
      alert("حدث خطأ أثناء الحفظ.");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && userId) {
      const file = event.target.files[0];
      const storageRef = ref(storage, `profileImages/${userId}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setProfileImage(downloadURL);
      } catch (error) {
        console.error("خطأ في رفع الصورة:", error);
      }
    }
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">إعدادات الملف الشخصي</h1>

      <div className="flex flex-col items-center">
        <label htmlFor="upload-avatar" className="cursor-pointer">
          <Image src={profileImage} alt="Profile" width={128} height={128} className="rounded-full border-4 border-gray-400 mb-4" />
        </label>
        <input id="upload-avatar" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-lg mb-2">الاسم الكامل</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg bg-gray-200" />
        </div>

        <div>
          <label className="block text-lg mb-2">البريد الإلكتروني</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-gray-200" />
        </div>

        <div>
          <label className="block text-lg mb-2">كلمة المرور (اتركها فارغة إذا لم ترغب في تغييرها)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-gray-200" />
        </div>

        <div>
          <label className="block text-lg mb-2">اللغة</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-3 rounded-lg bg-gray-200">
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <input type="checkbox" id="darkMode" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="w-5 h-5" />
          <label htmlFor="darkMode" className="text-lg">تفعيل الوضع الليلي</label>
        </div>

        <button onClick={handleSave} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 transition">
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}