"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Call your API route to create a new user
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Optionally sign in the user automatically after registration
      await signIn("credentials", { redirect: false, email, password });
      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
      setLoading(false);
    }
  }

  async function handleOAuth(provider: string) {
    await signIn(provider, { callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center pb-32 bg-transparent">
      <div className="p-10 rounded-2xl w-104 flex flex-col gap-5 text-black bg-stone-900 shadow-xl">
        <h1 className="text-center text-2xl font-bold mb-4 text-white">
          Sign Up
        </h1>

        <input
          className="border border-gray-600 p-2.5 rounded bg-gray-700 placeholder-gray-400 text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="border border-gray-600 p-2.5 rounded bg-gray-700 placeholder-gray-400 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border border-gray-600 p-2.5 rounded bg-gray-700 placeholder-gray-400 text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="border border-gray-600 p-2.5 rounded bg-gray-700 placeholder-gray-400 text-white"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold"
          type="submit"
          onClick={(e) => handleSignUp(e)}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-2">
          or continue with
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-600 p-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600"
            onClick={() => handleOAuth("google")}
          >
            <img
              src="/login-logos/google.jpeg"
              alt="Google"
              className="w-5 h-5 rounded-full"
            />
            Continue with Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-600 p-2 rounded font-semibold bg-gray-900 text-white hover:bg-gray-700"
            onClick={() => handleOAuth("github")}
          >
            <img
              src="/login-logos/github.jpg"
              alt="GitHub"
              className="w-5 h-5 rounded-full"
            />
            Continue with GitHub
          </button>
        </div>

        <p className="text-center text-sm mt-1 text-purple-400 cursor-pointer hover:underline">
          Already have an account? Log in
        </p>
      </div>
    </div>
  );
}
