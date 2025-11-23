"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handles email/password signup
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      // Step 1: create user
      const createRes = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        setMessage(createData.message || "Something went wrong.");
        return;
      }

      // Step 2: sign in the user
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setMessage(signInRes.error || "Something went wrong logging in.");
      } else {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Internal server error");
    }
  }

  // Handles OAuth login (Google/GitHub)
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border border-gray-600 p-2.25 rounded bg-gray-700 placeholder-gray-400 text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && (
          <p
            className={`text-sm ${
              message.includes("successful") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded font-semibold"
          type="submit"
          onClick={handleSignup}
        >
          Sign Up
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
          Already have an account?{" "}
          <span onClick={() => router.replace("/login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}
