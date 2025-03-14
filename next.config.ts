
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // يسمح بالتصدير إلى ملفات HTML ثابتة
  distDir: "out", // تحديد مجلد الإخراج
  images: {
    unoptimized: true, // تعطيل تحسين الصور عند التصدير
  },
};

export default nextConfig;