"use client";

import React, { useEffect, useState } from "react";
import { FiLock, FiUnlock } from "react-icons/fi";
import toast from "react-hot-toast";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

// تعريف نوع المستخدم لتجنب استخدام any
type User = {
  id: string;
  name?: string;
  email?: string;
  date?: string;
  isBanned?: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  // ✅ جلب المستخدمين من Firestore عند تحميل الصفحة
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const usersList: User[] = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">), // تحويل البيانات إلى النوع المناسب
        }));

        setUsers(usersList);
      } catch (error) {
        console.error("خطأ في جلب المستخدمين:", error);
      }
    };

    fetchUsers();
  }, []);

  // ✅ حظر المستخدم
  const banUser = async (id: string) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { isBanned: true });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isBanned: true } : user
        )
      );

      toast.error("تم حظر المستخدم.");
    } catch (error) {
      console.error("خطأ في الحظر:", error);
    }
  };

  // ✅ فك حظر المستخدم
  const unbanUser = async (id: string) => {
    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { isBanned: false });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isBanned: false } : user
        )
      );

      toast.success("تم فك الحظر عن المستخدم.");
    } catch (error) {
      console.error("خطأ في فك الحظر:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-all p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        🔥 إدارة المستخدمين
      </h1>

      {/* ✅ جدول المستخدمين */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">👤 اسم المستخدم</th>
              <th className="py-3 px-6 text-left">📧 البريد الإلكتروني</th>
              <th className="py-3 px-6 text-left">📅 تاريخ التسجيل</th>
              <th className="py-3 px-6 text-center">⚡ حالة الحساب</th>
              <th className="py-3 px-6 text-center">🔧 التحكم</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-4 px-6">{user.name}</td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">{user.date}</td>
                <td className="py-4 px-6 text-center">
                  {user.isBanned ? (
                    <span className="text-red-500 font-semibold">🚫 محظور</span>
                  ) : (
                    <span className="text-green-500 font-semibold">✅ نشط</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {user.isBanned ? (
                    <button
                      onClick={() => unbanUser(user.id)}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                      <FiUnlock /> فك الحظر
                    </button>
                  ) : (
                    <button
                      onClick={() => banUser(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                      <FiLock /> حظر المستخدم
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}