"use client";

import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="bg-gray-50 py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center">
        <Link href="/" className="flex items-baseline">
          <span className="text-2xl font-semibold">Donor</span>
          <span className="text-2xl font-semibold text-orange-500 ml-0.5">
            Dash
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className="text-sm font-medium text-gray-700 hover:text-orange-500"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-sm font-medium text-gray-700 hover:text-orange-500"
        >
          About
        </Link>
        <Link
          href="/features"
          className="text-sm font-medium text-gray-700 hover:text-orange-500"
        >
          Features
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium text-gray-700 hover:text-orange-500"
        >
          Contact
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="border border-gray-300 hover:border-orange-500 hover:text-orange-500 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
