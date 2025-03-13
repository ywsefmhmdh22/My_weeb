import { useState } from "react";

export default function Payments() {
  // بيانات تجريبية (يمكنك جلب البيانات من API)
  const [payments] = useState([
    { id: 201, user: "أحمد سالم", amount: "$250", ad: "سوق مرسيدس للبيع", date: "2025-03-08", duration: "30 يوم" },
    { id: 202, user: "فادي محمد", amount: "$500", ad: "خطة عقارية استثمارية", date: "2025-03-06", duration: "60 يوم" },
    { id: 203, user: "سيد حسن", amount: "$150", ad: "ملابس أطفال بالجملة", date: "2025-03-05", duration: "15 يوم" },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">💳 لوحة تحكم المدفوعات الأسطورية</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-600 p-3">رقم الدفع</th>
                <th className="border border-gray-600 p-3">المستخدم</th>
                <th className="border border-gray-600 p-3">الإعلان</th>
                <th className="border border-gray-600 p-3">المبلغ</th>
                <th className="border border-gray-600 p-3">التاريخ</th>
                <th className="border border-gray-600 p-3">المدة</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="bg-gray-800 hover:bg-gray-700 transition">
                  <td className="border border-gray-600 p-3 text-center">{payment.id}</td>
                  <td className="border border-gray-600 p-3 text-center">{payment.user}</td>
                  <td className="border border-gray-600 p-3 text-center">{payment.ad}</td>
                  <td className="border border-gray-600 p-3 text-center text-green-400 font-bold">{payment.amount}</td>
                  <td className="border border-gray-600 p-3 text-center">{payment.date}</td>
                  <td className="border border-gray-600 p-3 text-center">{payment.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}