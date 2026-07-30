"use client";

import { RegisterForm } from "@/components/forms/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <p className="text-gray-500 mt-2">
          Join our donation management platform
        </p>
      </div>

      <div className="space-y-4">
        <RegisterForm />
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
