"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import DeleteButton from "@/components/delete_button";

export default function ManageAccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const currentUser = session?.user;

  if (!currentUser) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 bg-transparent">
      <div className="w-2/5 p-8 pb-36 flex flex-col justify-center items-center relative">
        <div className="absolute w-96 h-164 rounded-lg bg-purple-300 opacity-30 blur-3xl" />

        <motion.div
          className="w-96 h-164 rounded-lg shadow-3xl perspective-1000"
          whileHover={{
            scale: 1.05,
            rotateY: 15,
            rotateX: 10,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
        >
          <img
            src="/tarot-res-images/17_Star.jpg"
            alt="Tarot Card"
            className="w-full h-full object-cover rounded-lg animate-spin-slow"
          />
        </motion.div>

        <style jsx>{`
          .animate-spin-slow {
            animation: spin 12s linear infinite;
          }
          @keyframes spin {
            from {
              transform: rotateY(0deg);
            }
            to {
              transform: rotateY(360deg);
            }
          }
        `}</style>
      </div>

      <div className="w-3/5 p-8 flex flex-col justify-center pb-48 space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold mb-3">Manage Your Account</h1>
          <p className="text-gray-400 text-[19px] leading-relaxed mb-3">
            Use these options to customize your profile, log out securely, or
            delete your account if needed. Everything you need to manage your
            account is available here.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-3">Account Options</h2>

          <button
            onClick={() => router.push("/profile")}
            className="w-full flex justify-between items-center mt-3 px-6 py-3 rounded-lg bg-purple-500/30 hover:bg-zinc-950 hover:text-white transition shadow-sm"
          >
            Customize Profile
            <User className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex justify-between items-center px-6 py-3 rounded-lg bg-green-600/75 text-white hover:bg-lime-600 transition shadow-sm"
          >
            Logout
            <LogOut className="w-5 h-5 text-white" />
          </button>

          <DeleteButton userId={currentUser.id} />
        </div>
      </div>
    </div>
  );
}
