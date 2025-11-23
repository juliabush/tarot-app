"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/"); // default redirect

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let url = params.get("callbackUrl") || "/";

    if (url.includes("/login") || url.includes("/signup")) {
      url = "/";
    }

    setCallbackUrl(url);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials.");
      return;
    }

    router.push(callbackUrl); // safe redirect
  }

  async function handleOAuth(provider: string) {
    await signIn(provider, { callbackUrl }); // also safe redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center pb-32 bg-transparent">
      <div className="p-10 rounded-2xl w-104 flex flex-col gap-5 text-black bg-stone-900 shadow-xl">
        <h1 className="text-center text-2xl font-bold mb-4 text-white">
          Log in
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-600 p-2.5 rounded bg-gray-700 placeholder-gray-400 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-600 p-2.25 rounded bg-gray-700 placeholder-gray-400 text-white"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded font-semibold"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-400 mt-2">
          or continue with
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOAuth("google")}
            className="flex items-center justify-center gap-2 border border-gray-600 p-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600"
          >
            <img
              src="/login-logos/google.jpeg"
              alt="Google"
              className="w-5 h-5 rounded-full"
            />
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuth("github")}
            className="flex items-center justify-center gap-2 border border-gray-600 p-2 rounded font-semibold bg-gray-900 text-white hover:bg-gray-700"
          >
            <img
              src="/login-logos/github.jpg"
              alt="GitHub"
              className="w-5 h-5 rounded-full"
            />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
