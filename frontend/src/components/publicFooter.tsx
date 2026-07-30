"use client";

import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-gray-50 py-6 px-6 md:px-12 border-t border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <Link href="/" className="flex items-baseline">
            <span className="text-2xl font-semibold">Erlin</span>
            <span className="text-2xl font-semibold text-blue-500 ml-0.5">
              ai
            </span>
            <span className="text-blue-500 text-xs ml-0.5">+</span>
          </Link>
        </div>

        <div className="flex space-x-6">
          <Link
            href="/services"
            className="text-sm text-gray-600 hover:text-blue-500"
          >
            Services
          </Link>
          <Link
            href="/case-studies"
            className="text-sm text-gray-600 hover:text-blue-500"
          >
            Case Studies
          </Link>
          <Link
            href="/about-us"
            className="text-sm text-gray-600 hover:text-blue-500"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-600 hover:text-blue-500"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center">
          <Link
            href="https://instagram.com"
            className="text-gray-600 hover:text-blue-500"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
