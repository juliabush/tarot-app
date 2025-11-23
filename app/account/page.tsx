"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function ManageAccountPage() {
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="w-2/5 bg-white p-8 flex flex-col justify-center items-center shadow-md">
        <h1 className="text-3xl font-bold mb-4">Manage Your Account</h1>
        <p className="text-gray-600 text-center">
          Here you can view and edit your account details, update settings, and
          more.
        </p>
      </div>

      <div className="w-3/5 p-8 flex flex-col justify-start">
        <h2 className="text-2xl font-semibold mb-6">Account Options</h2>

        <button
          onClick={() => router.push("/profile")}
          className="mb-4 w-full text-left px-4 py-2 rounded hover:bg-purple-100 transition"
        >
          Profile
        </button>

        <button
          onClick={() => router.push("/settings")}
          className="mb-4 w-full text-left px-4 py-2 rounded hover:bg-purple-100 transition"
        >
          Settings
        </button>

        <button
          onClick={handleLogout}
          className="mt-8 w-full text-left px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
