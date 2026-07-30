"use client";

import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="bg-gray-50 py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center">
        <Link href="/" className="flex items-baseline">
          <span className="text-2xl font-semibold">Erlin</span>
          <span className="text-2xl font-semibold text-blue-500 ml-0.5">
            ai
          </span>
          <span className="text-blue-500 text-xs ml-0.5">+</span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className="text-sm font-medium text-gray-700 hover:text-blue-500"
        >
          Home
        </Link>
        <Link
          href="/services"
          className="text-sm font-medium text-gray-700 hover:text-blue-500"
        >
          Services
        </Link>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-blue-500"
        >
          Pricing
        </Link>
        <Link
          href="/global-guide"
          className="text-sm font-medium text-gray-700 hover:text-blue-500"
        >
          Global Guide
        </Link>
        <Link
          href="/resources"
          className="text-sm font-medium text-gray-700 hover:text-blue-500"
        >
          Resources
        </Link>
        <Link
          href="/blogs"
          className="text-sm font-medium text-gray-700 hover:text-blue-500"
        >
          Blogs
        </Link>
        <Link
          href="/about-us"
          className="text-sm font-medium text-gray-700 hover:text-blue-500"
        >
          About us
        </Link>
        <Link
          href="/contact-us"
          className="text-sm font-medium text-gray-700 hover:text-blue-500"
        >
          Contact us
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="border border-gray-300 hover:border-blue-500 hover:text-blue-500 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/hire-agent"
          className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          Hire Agent
        </Link>
      </div>
    </header>
  );
}
