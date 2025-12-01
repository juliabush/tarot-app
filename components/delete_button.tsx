"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  userId: string;
}

export default function DeleteButton({ userId }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Account deleted successfully.");
        router.push("/"); // redirect after deletion
      } else {
        alert("Failed to delete account: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-full flex justify-between items-center px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 hover:text-white transition shadow-sm"
    >
      {loading ? "Deleting..." : "Delete Account"}
      <Trash2 className="w-5 h-5 text-white" />
    </button>
  );
}
