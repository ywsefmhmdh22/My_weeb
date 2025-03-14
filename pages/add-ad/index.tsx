import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

type FormData = {
  title: string;
  description: string;
  category: string;
  price: number;
  whatsapp_contact?: boolean;
};

export default function AddListing() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [images, setImages] = useState<File[]>([]);
  const [userType, setUserType] = useState<"personal" | "business" | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accountType = localStorage.getItem("accountType") as "personal" | "business" | null;
      setUserType(accountType);
      
      if (!accountType) {
        alert("يرجى تسجيل الدخول أولًا!");
        router.push("/login");
      }
    }
  }, [router]);

  const onSubmit = async (data: FormData) => {
    if (userType === "personal") {
      const confirmPayment = window.confirm("💰 يجب الدفع لنشر الإعلان، هل ترغب في المتابعة؟");
      if (!confirmPayment) return;
    }

    console.log("📋 بيانات الإعلان:", data);
    alert("🎉 تم نشر الإعلان بنجاح!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files).filter(
      (file) => !images.some((img) => img.name === file.name)
    );
    setImages((prev) => [...prev, ...files]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full bg-blue-600 p-4 text-white text-center text-lg font-bold">
        {userType === "business" ? "🏆 إضافة إعلان تجاري" : "📢 إضافة إعلان جديد"}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow-lg rounded-md w-full max-w-3xl">
        <h2 className="text-center text-xl font-semibold mb-4 text-gray-700">
          {userType === "business" ? "🚀 نشر إعلان تجاري مميز" : "📢 أدخل تفاصيل الإعلان"}
        </h2>

        {/* 🏷 عنوان الإعلان */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">📌 عنوان الإعلان</label>
          <input type="text" {...register("title", { required: "يجب إدخال العنوان" })} 
            placeholder="مثال: آيفون 13 برو للبيع بحالة ممتازة"
            className="w-full p-2 border rounded-md" />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>

        {/* 📝 وصف الإعلان */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">📝 وصف الإعلان</label>
          <textarea {...register("description", { required: "يجب إدخال الوصف" })} 
            placeholder="اكتب تفاصيل الإعلان هنا..."
            className="w-full p-2 border rounded-md h-28" />
          {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
        </div>

        {/* 📂 اختيار الفئة */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">📂 اختر الفئة</label>
          <select {...register("category", { required: "يجب اختيار الفئة" })} 
            className="w-full p-2 border rounded-md">
            <option value="">اختر...</option>
            <option value="سيارات">🚗 سيارات</option>
            <option value="عقارات">🏠 عقارات</option>
            <option value="إلكترونيات">💻 إلكترونيات</option>
            <option value="وظائف">💼 وظائف</option>
            <option value="حيوانات">🐶 حيوانات</option>
            <option value="أثاث">🛋 أثاث</option>
          </select>
        </div>

        {/* 📷 تحميل الصور */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">📷 تحميل الصور</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded-md" />
          <div className="flex mt-2 flex-wrap">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} className="w-16 h-16 object-cover mr-2 rounded-md border" />
              </div>
            ))}
          </div>
        </div>

        {/* 💰 إدخال السعر */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">💰 السعر</label>
          <input type="number" {...register("price", { required: "يجب إدخال السعر" })} 
            placeholder="مثال: 5000"
            className="w-full p-2 border rounded-md" />
        </div>

        {/* 📞 السماح بالتواصل عبر واتساب */}
        <div className="flex items-center mb-4">
          <input type="checkbox" {...register("whatsapp_contact")} className="mr-2" />
          <label className="text-gray-600">📞 السماح بالتواصل عبر واتساب</label>
        </div>

        {/* 🎁 مميزات الحساب التجاري */}
        {userType === "business" && (
          <div className="bg-green-100 p-4 rounded-md mb-4">
            <h3 className="text-green-600 font-semibold">🚀 مميزات الحساب التجاري:</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>🔝 ظهور الإعلانات أعلى القائمة</li>
              <li>📊 إحصائيات حول أداء الإعلان</li>
              <li>🎥 إمكانية إضافة فيديو للإعلان</li>
            </ul>
          </div>
        )}

        {/* 🚀 زر نشر الإعلان */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-semibold">
          🚀 نشر الإعلان الآن
        </button>
      </form>
    </div>
  );
}