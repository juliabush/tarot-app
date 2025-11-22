"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="w-full bg-black/30 backdrop-blur-sm py-4 shadow-md">
      <div className="max-w-[1300px] mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide">
          AskTarotAnything
        </Link>

        <div className="flex gap-6 items-center relative">
          <Link href="/spreads">Tarot Spreads</Link>
          <Link href="/matrix">Destiny Matrix</Link>

          {status === "loading" ? (
            <span className="text-white">Loading...</span>
          ) : session?.user ? (
            <div className="relative">
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
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg overflow-hidden z-50">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Manage Account
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white hover:underline"
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
