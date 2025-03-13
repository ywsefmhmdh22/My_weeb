import { useState } from "react";

export default function AdminSettings() {
  const [siteName, setSiteName] = useState("موقعي الأسطوري");
  const [settings, setSettings] = useState({
    allowRegistrations: true,
    maintenanceMode: false,
    seoTitle: "أفضل موقع إعلانات في العالم",
    seoDescription: "موقع إعلانات مبوبة قوي وسريع مع أفضل الميزات",
  });

  const handleSave = () => {
    alert("تم حفظ الإعدادات بنجاح! ✅");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">⚙ إعدادات الموقع</h1>

      <div className="space-y-4">
        {/* تعديل اسم الموقع */}
        <div>
          <label className="block text-gray-400">📌 اسم الموقع:</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>

        {/* تفعيل التسجيل */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.allowRegistrations}
            onChange={(e) =>
              setSettings({ ...settings, allowRegistrations: e.target.checked })
            }
            className="w-5 h-5"
          />
          <label className="ml-2">🔓 السماح بالتسجيل</label>
        </div>

        {/* وضع الصيانة */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              setSettings({ ...settings, maintenanceMode: e.target.checked })
            }
            className="w-5 h-5"
          />
          <label className="ml-2">🚧 وضع الصيانة</label>
        </div>

        {/* إعدادات SEO */}
        <div>
          <label className="block text-gray-400">🏆 عنوان SEO:</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1"
            value={settings.seoTitle}
            onChange={(e) =>
              setSettings({ ...settings, seoTitle: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-gray-400">📝 وصف SEO:</label>
          <textarea
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1"
            value={settings.seoDescription}
            onChange={(e) =>
              setSettings({ ...settings, seoDescription: e.target.value })
            }
          />
        </div>

        {/* زر الحفظ */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-bold mt-4"
        >
          💾 حفظ التعديلات
        </button>
      </div>
    </div>
  );
}