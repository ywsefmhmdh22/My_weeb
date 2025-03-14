import Image from "next/image";
import { useState } from "react";

export default function ContactSeller() {
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]);
    }
  };

  return (
    <div>
      <h1>اتصل بالبائع</h1>
      
      {/* رفع الصور */}
      <input type="file" multiple onChange={handleImageUpload} />

      {/* عرض الصور */}
      <div className="flex mt-4">
        {images.map((image, index) => (
          <Image 
            key={index}
            src={URL.createObjectURL(image)}
            alt={`صورة ${index + 1}`} 
            width={64} 
            height={64} 
            className="w-16 h-16 object-cover mr-2 rounded-md border"
            unoptimized // في حال كان مصدر الصورة غير مدعوم من Next.js
          />
        ))}
      </div>
    </div>
  );
}