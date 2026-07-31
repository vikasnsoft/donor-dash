"use client";

import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-gray-50 py-6 px-6 md:px-12 border-t border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <Link href="/" className="flex items-baseline">
            <span className="text-2xl font-semibold">Donor</span>
            <span className="text-2xl font-semibold text-orange-500 ml-0.5">
              Dash
            </span>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            Community Finance Platform
          </p>
        </div>

        <div className="flex space-x-6">
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-orange-500"
          >
            About
          </Link>
          <Link
            href="/features"
            className="text-sm text-gray-600 hover:text-orange-500"
          >
            Features
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-600 hover:text-orange-500"
          >
            Contact
          </Link>
          <Link
            href="https://github.com/vikasnsoft/donor-dash"
            className="text-sm text-gray-600 hover:text-orange-500"
          >
            GitHub
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} DonorDash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
