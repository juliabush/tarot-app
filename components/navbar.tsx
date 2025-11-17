"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full bg-black/30 backdrop-blur-sm py-4 shadow-md">
      <div className="max-w-[1300px] mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide">
          AskTarotAnything
        </Link>

        <div className="flex gap-6">
          <Link href="/spreads">Tarot Spreads</Link>
          <Link href="/matrix">Destiny Matrix</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
