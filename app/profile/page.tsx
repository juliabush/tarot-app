"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const currentUser = session?.user;

  const [username, setUsername] = useState(currentUser?.name || "");
  const [newUsername, setNewUsername] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(
    currentUser?.image || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  if (!currentUser) return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("username", newUsername || username);
    formData.append("userId", currentUser.id);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        router.push("/settings");
      } else {
        alert("Failed to update profile: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent pb-48 min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-3xl flex gap-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-2xl">👤</span>
            )}
          </div>

          {/* File input container */}
          <div className="flex flex-col items-center gap-1">
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setImage(e.target.files[0]);
              }}
              className="hidden"
            />
            <span className="text-sm text-gray-400">
              {image ? image.name : "No file chosen"}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 justify-center">
          <div className="flex flex-col">
            <label className="text-gray-600 font-semibold mb-1">
              Current Username
            </label>
            <input
              type="text"
              value={username}
              disabled
              className="p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="flex flex-col mt-2">
            <label className="text-gray-600 font-semibold mb-1">
              New Username
            </label>
            <input
              type="text"
              placeholder="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
