import { useState, useEffect, useRef } from "react";

interface Seller {
  id: string;
  name: string;
}

interface Message {
  text?: string;
  fileUrl?: string;
  fileType?: string;
  sender: "user" | "seller";
  timestamp: number;
}

export default function ContactSeller({ seller }: { seller: Seller | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!seller?.id) return;
    const savedMessages = JSON.parse(localStorage.getItem("chat_" + seller.id) || "[]");
    setMessages(savedMessages);
  }, [seller?.id]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (msg: Message) => {
    const updatedMessages = [...messages, msg];
    setMessages(updatedMessages);
    if (seller?.id) {
      localStorage.setItem("chat_" + seller.id, JSON.stringify(updatedMessages));
    }
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    sendMessage({ text: input, sender: "user", timestamp: Date.now() });
    setInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage({ fileUrl: reader.result as string, fileType: file.type, sender: "user", timestamp: Date.now() });
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    const chunks: Blob[] = [];
    
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      const reader = new FileReader();
      reader.onload = () => {
        sendMessage({ fileUrl: reader.result as string, fileType: "audio", sender: "user", timestamp: Date.now() });
      };
      reader.readAsDataURL(audioBlob);
    };
    
    recorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white py-3 px-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">تواصل مع {seller?.name || "البائع"}</h2>
        </div>

        {/* منطقة الرسائل */}
        <div ref={chatRef} className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs p-3 rounded-lg shadow-md ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.fileUrl && (
                  msg.fileType?.startsWith("image/") ? (
                    <img src={msg.fileUrl} alt="Attachment" className="w-full rounded-md mt-2" />
                  ) : msg.fileType === "audio" ? (
                    <audio controls src={msg.fileUrl} className="w-full mt-2"></audio>
                  ) : (
                    <a href={msg.fileUrl} download className="text-blue-700 mt-2 block">📄 تحميل الملف</a>
                  )
                )}
                <small className="block text-xs mt-1 text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          ))}
        </div>

        {/* إدخال النص + زر الإرسال + رفع الملفات + تسجيل الصوت */}
        <div className="flex items-center border-t p-3 space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
          />
          <button onClick={handleSendText} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            إرسال
          </button>
          <input type="file" onChange={handleFileUpload} className="hidden" id="fileUpload" />
          <label htmlFor="fileUpload" className="cursor-pointer bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400">
            📎
          </label>
          {recording ? (
            <button onClick={stopRecording} className="bg-red-600 text-white px-3 py-2 rounded-lg">⏹</button>
          ) : (
            <button onClick={startRecording} className="bg-green-600 text-white px-3 py-2 rounded-lg">🎤</button>
          )}
        </div>
      </div>
    </div>
  );
}