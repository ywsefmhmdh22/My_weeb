import { useState, useEffect } from "react";
import { db } from "@/utils/firebaseConfig"; // ✅ استيراد قاعدة البيانات
import { doc, getDoc } from "firebase/firestore"; // ✅ تصحيح استيراد Firestore
import { loadStripe } from "@stripe/stripe-js"; // ✅ استيراد Stripe

export default function AddAd() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [stripeKey, setStripeKey] = useState(""); // 🔑 مفتاح Stripe
  const [paypalClientId, setPaypalClientId] = useState(""); // 🔑 مفتاح PayPal
  const [isLoading, setIsLoading] = useState(true);
  const userId = "user123"; // استبدلها بالـ userId الفعلي

  // ✅ تحميل بيانات الدفع تلقائيًا من Firestore
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const docRef = doc(db, "paymentSettings", "global"); // ✅ استدعاء بيانات الدفع
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (["stripe", "paypal"].includes(data.selectedMethod)) {
            setPaymentMethod(data.selectedMethod);
          }
          setStripeKey(data.stripePublicKey || ""); // جلب مفتاح Stripe
          setPaypalClientId(data.paypalClientId || ""); // جلب مفتاح PayPal
        }
      } catch (error) {
        console.error("🔥 خطأ أثناء جلب بيانات الدفع:", error);
      }
      setIsLoading(false);
    };

    fetchPaymentData();
  }, []);

  // ✅ تنفيذ الدفع عبر Stripe أو PayPal
  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("❌ لم يتم العثور على بيانات الدفع، يرجى إعداد طريقة الدفع أولًا!");
      return;
    }

    if (paymentMethod === "stripe") {
      if (!stripeKey) {
        alert("❌ مفتاح Stripe غير متوفر!");
        return;
      }
      const stripe = await loadStripe(stripeKey);
      
      if (!stripe) {
        alert("❌ فشل تحميل Stripe! تأكد من صحة المفتاح وإعادة المحاولة.");
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: "price_1XXXXXX", quantity: 1 }],
        mode: "payment",
        successUrl: "https://your-website.com/success",
        cancelUrl: "https://your-website.com/cancel",
      });

      if (error) {
        alert("❌ فشل الدفع عبر Stripe: " + error.message);
      }
    } else if (paymentMethod === "paypal") {
      if (!paypalClientId) {
        alert("❌ مفتاح PayPal غير متوفر!");
        return;
      }
      try {
        const response = await fetch("/api/paypal/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: price, clientId: paypalClientId }),
        });
        const data = await response.json();

        if (data.approvalUrl) {
          window.location.href = data.approvalUrl; // 🔁 توجيه المستخدم لصفحة الدفع في PayPal
        } else {
          alert("❌ فشل إنشاء الدفع عبر PayPal!");
        }
      } catch (error) {
        console.error("PayPal Payment Error:", error);
        alert("❌ حدث خطأ أثناء الدفع عبر PayPal!");
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">📝 إضافة إعلان جديد</h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* عنوان الإعلان */}
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

        {/* سعر الإعلان */}
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

        {/* الدفع التلقائي */}
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

        {/* زر نشر الإعلان */}
        <button
          onClick={handlePayment}
          disabled={isLoading || !paymentMethod}
          className={`w-full p-4 rounded-lg text-lg font-bold transition ${
            isLoading || !paymentMethod
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-800"
          }`}
        >
          🚀 نشر الإعلان والدفع
        </button>
      </div>
    </div>
  );
}