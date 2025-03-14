import { useState, useEffect } from "react";
import { db } from "@/utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
// import { loadStripe } from "@stripe/stripe-js"; // ❌ تم التعليق لأنه غير مستخدم حاليًا

export default function AddAd() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = "user123";

  useEffect(() => {
    const fetchUserPaymentData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (["stripe", "paypal"].includes(userData.selectedMethod)) {
            setPaymentMethod(userData.selectedMethod);
          }
        }
      } catch (error) {
        console.error("🔥 خطأ أثناء جلب بيانات المستخدم:", error);
      }
      setIsLoading(false);
    };

    fetchUserPaymentData();
  }, [userId]);

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">📝 إضافة إعلان جديد</h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <label className="block text-lg mb-2">📌 عنوان الإعلان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: سيارة مستعملة للبيع"
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
          />
        </div>

        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <label className="block text-lg mb-2">💰 السعر ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="مثال: 50"
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
          />
        </div>

        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <label className="block text-lg mb-2">💳 طريقة الدفع</label>
          {isLoading ? (
            <p>⏳ جاري تحميل طريقة الدفع...</p>
          ) : (
            <p className="text-green-400">
              {paymentMethod ? `✅ سيتم الدفع باستخدام ${paymentMethod}` : "❌ لم يتم اختيار وسيلة الدفع"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}