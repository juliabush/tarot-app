"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-black/30 backdrop-blur-sm py-4 shadow-md">
      <div className="max-w-[1300px] mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide text-white">
          AskTarotAnything
        </Link>

        <div className="flex gap-6 items-center relative">
          <Link href="/spreads" className="text-white hover:underline">
            Tarot Spreads
          </Link>
          <Link href="/matrix" className="text-white hover:underline">
            Destiny Matrix
          </Link>

          {status === "loading" ? (
            <span className="text-white">Loading...</span>
          ) : session?.user ? (
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "avatar"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-white">
                  {session.user.name || session.user.email}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute top-10 right-0 left-0 mt-2 w-40 bg-white rounded shadow-lg overflow-hidden z-[999]">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Manage Account
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <button
                onClick={() => signIn()}
                className="text-white hover:underline"
              >
                Login
              </button>

              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
